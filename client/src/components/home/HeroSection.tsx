'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/design-system/components';
import Link from 'next/link';
import { Search, Play, Pause, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useDebounce } from '@/hooks/useDebounce';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [heroVideos, setHeroVideos] = useState<string[]>([]);
  const [heroTitle, setHeroTitle] = useState('Find Your Dream Property');
  const [heroSubtitle, setHeroSubtitle] = useState<string | undefined>();
  const [sliderInterval, setSliderInterval] = useState(8);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [videoKey, setVideoKey] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/settings');
        const settings = response.data.data;
        if (settings) {
          if (settings.heroVideos && settings.heroVideos.length > 0) {
            const validVideos = settings.heroVideos.filter((v: string) => v && v.trim() !== '');
            if (validVideos.length > 0) {
              setHeroVideos(validVideos);
              setCurrentVideoIndex(0);
              setVideoKey(k => k + 1);
            }
          }
          if (settings.heroTitle) {
            setHeroTitle(settings.heroTitle);
          }
          if (settings.heroSubtitle) {
            setHeroSubtitle(settings.heroSubtitle);
          }
          if (settings.sliderInterval) {
            setSliderInterval(settings.sliderInterval);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (heroVideos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, sliderInterval * 1000);

    return () => clearInterval(interval);
  }, [heroVideos.length, sliderInterval]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchTerm.trim() || debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`/properties?searchTerm=${encodeURIComponent(debouncedSearchTerm)}&limit=5&fields=title,city`);
        const properties: Array<{title: string; city: string}> = response.data.data || [];
        const titles = properties.map(p => p.title);
        const cities = properties.map(p => p.city);
        const uniqueSuggestions = [...new Set([...titles, ...cities])].slice(0, 6);
        setSuggestions(uniqueSuggestions as string[]);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      router.push(`/explore?searchTerm=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    router.push(`/explore?searchTerm=${encodeURIComponent(suggestion)}`);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const goToPrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + heroVideos.length) % heroVideos.length);
  };

  const goToNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  };

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-background">

      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">

        <video
          key={`video-${currentVideoIndex}-${videoKey}`}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          onEnded={() =>
            setCurrentVideoIndex(
              (prev) => (prev + 1) % heroVideos.length
            )
          }
        >
          <source
            src={heroVideos[currentVideoIndex]}
            type="video/mp4"
          />
        </video>

        {/* LIGHT MODE OVERLAY */}
        <div className="absolute inset-0 bg-white/10 dark:hidden" />

        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/5 to-white/20 dark:hidden" />

        {/* DARK MODE OVERLAY */}
        <div className="absolute inset-0 hidden dark:block bg-black/55" />

        <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-black/80 via-black/30 to-black/70" />
      </div>

      {/* VIDEO CONTROLS */}
      {heroVideos.length > 1 && (
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">

          <button
            onClick={goToPrevVideo}
            className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-background/70
          text-foreground
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-primary
          hover:bg-primary
          hover:text-primary-foreground
        "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={toggleVideo}
            aria-label={
              isVideoPlaying
                ? 'Pause video'
                : 'Play video'
            }
            className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-background/70
          text-foreground
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-primary
          hover:bg-primary
          hover:text-primary-foreground
        "
          >
            {isVideoPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>

          <button
            onClick={goToNextVideo}
            className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-background/70
          text-foreground
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-primary
          hover:bg-primary
          hover:text-primary-foreground
        "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* HERO CONTENT */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 pt-16 sm:pt-0">

        <div className="max-w-3xl">

          {/* BADGE */}
          <div
            className="
          mb-6
          sm:mb-8
          inline-flex
          items-center
          gap-2
          sm:gap-3
          rounded-full
          border
          border-primary/30
          bg-primary/10
          px-4
          sm:px-5
          py-2
          sm:py-2.5
          backdrop-blur-xl
        "
          >
            <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-primary animate-pulse" />

            <span
              className="
            text-[10px]
            sm:text-[11px]
            font-black
            uppercase
            tracking-[0.3em]
            sm:tracking-[0.35em]
            text-primary
          "
            >
              Elite Property Network
            </span>
          </div>

          {/* TITLE */}
          <h1
            className="
          max-w-4xl
          text-3xl
          sm:text-4xl
          md:text-5xl
          lg:text-6xl
          xl:text-7xl
          font-black
          leading-[0.95]
          tracking-[-0.02em]
          text-foreground
        "
          >
            {heroTitle ? (
              heroTitle.split('Dream').map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 && <span className="italic text-primary">Dream</span>}
                </span>
              ))
            ) : (
              <>
                Find Your <span className="italic text-primary">Dream</span> Property
              </>
            )}
          </h1>

{/* SUBTITLE */}
          <p
            className="
          mt-4
          sm:mt-6
          lg:mt-8
          max-w-2xl
          text-sm
          sm:text-base
          md:text-lg
          leading-relaxed
          text-foreground/80
        "
          >
            {heroSubtitle || "Discover Bangladesh's most exclusive luxury residences crafted for modern lifestyles."}
          </p>

          {/* SEARCH */}
          <form
            onSubmit={(e) => handleSearch(e)}
            className="mt-6 sm:mt-8 lg:mt-10 relative flex flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">

              <Search
                className="
              absolute
              left-4
              sm:left-5
              top-1/2
              h-4
              sm:h-5
              w-4
              sm:w-5
              -translate-y-1/2
              text-primary
              z-10
            "
              />

              <input
                type="text"
                placeholder="Search location or property..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length >= 2) {
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="
              h-12
              sm:h-14
              md:h-16
              w-full
              rounded-xl
              sm:rounded-2xl
              border
              border-border
              bg-background/80
              pl-12
              sm:pl-14
              pr-10
              sm:pr-6
              text-sm
              sm:text-base
              placeholder:text-muted-foreground
              backdrop-blur-xl
              outline-none
              transition-all
              duration-300
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}

              {/* LIVE SUGGESTIONS */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors"
                    >
                      <MapPin size={16} className="text-primary shrink-0" />
                      <span className="text-foreground text-sm font-medium truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="
            h-12
            sm:h-14
            md:h-16
            rounded-xl
            sm:rounded-2xl
            px-6
            sm:px-8
            md:px-10
            text-sm
            sm:text-base
            font-bold
          "
            >
              Search
            </Button>
          </form>

          {/* ACTION BUTTONS */}
          <div className="mt-5 sm:mt-6 lg:mt-8 flex flex-col gap-3 sm:flex-row">

            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="
              h-11
              sm:h-12
              md:h-14
              rounded-xl
              sm:rounded-2xl
              border-border
              bg-background/40
              px-6
              sm:px-8
              backdrop-blur-xl
              text-sm
              sm:text-base
            "
              >
                Browse All Properties
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="ghost"
                size="lg"
                className="
              h-11
              sm:h-12
              md:h-14
              px-2
              text-primary
              hover:text-foreground
            "
              >
                Learn More →
              </Button>
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-10 sm:mt-12 lg:mt-16 inline-flex flex-wrap items-center gap-6 sm:gap-10 rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 px-6 sm:px-8 py-4 sm:py-6 backdrop-blur-2xl dark:border-white/10 dark:bg-black/20 max-w-3xl">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                250+
              </div>

              <div className="mt-1 text-xs sm:text-sm font-medium text-black/70 dark:text-white/60">
                Premium Properties
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                45+
              </div>

              <div className="mt-1 text-xs sm:text-sm font-medium text-black/70 dark:text-white/60">
                Elite Agents
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                98%
              </div>

              <div className="mt-1 text-xs sm:text-sm font-medium text-black/70 dark:text-white/60">
                Satisfaction
              </div>
            </div>
</div>
        </div>
      </div>
    </section>
  );
}