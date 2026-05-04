'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/design-system/components';
import Link from 'next/link';
import { Search, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';

const HERO_VIDEOS = [
  'https://www.pexels.com/download/video/34030196/',
  'https://www.pexels.com/download/video/13761471/',
  'https://www.pexels.com/download/video/14016414/',
  'https://www.pexels.com/download/video/37368568/'

];

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get('/properties/featured');
        const properties = response.data.data || [];
        const videos = properties
          .flatMap((p: any) => p.videos || [])
          .slice(0, 6);
        if (videos.length > 0) {
          // Use real videos if available
        }
      } catch (error) {
        // Use default videos
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if (!isVideoPlaying || HERO_VIDEOS.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 14000);
    
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore?searchTerm=${encodeURIComponent(searchTerm)}`);
    }
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
    setCurrentVideoIndex((prev) => (prev - 1 + HERO_VIDEOS.length) % HERO_VIDEOS.length);
  };

  const goToNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  return (
    <section className="relative min-[90vh] flex items-center overflow-hidden py-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          key={currentVideoIndex}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-opacity duration-1000"
          onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length)}
        >
          <source src={HERO_VIDEOS[currentVideoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2">
        {HERO_VIDEOS.length > 1 && (
          <>
            <button
              onClick={goToPrevVideo}
              className="w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-secondary-foreground transition-all duration-300 backdrop-blur-xl"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={toggleVideo}
              className="w-12 h-12 rounded-full bg-card/80 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-secondary-foreground transition-all duration-300 backdrop-blur-xl"
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={goToNextVideo}
              className="w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-secondary-foreground transition-all duration-300 backdrop-blur-xl"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Content - Left Aligned, Max-Width */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-bold uppercase tracking-[0.3em]">
              Elite Property Network
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Find Your <span className="text-primary italic">Dream</span> Property
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white mb-10 leading-relaxed max-w-xl">
            Connecting distinguished individuals with Bangladesh's most extraordinary architectural masterpieces. Experience luxury living redefined.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary h-5 w-5 group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Where would you like to live?"
                className="w-full h-14 pl-14 pr-6 rounded-xl bg-card/60 border border-border text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-[#C9A74D] text-base backdrop-blur-xl transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-14 px-8">
              Search Properties
            </Button>
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/explore">
              <Button variant="outline" size="lg" className="h-14 px-8">
                Browse All Properties
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="ghost" size="lg" className="h-14 px-8 text-primary hover:text-foreground">
                Learn More →
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-16 pt-8 border-t border-border/50">
            <div>
              <div className="text-3xl font-bold text-primary">250+</div>
              <div className="text-sm text-muted-foreground mt-1">Premium Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">45+</div>
              <div className="text-sm text-muted-foreground mt-1">Elite Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
