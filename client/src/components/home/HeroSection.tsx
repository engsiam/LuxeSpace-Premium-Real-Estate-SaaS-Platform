'use client';

import { useState, useRef } from 'react';
import { Button } from '@/design-system/components';
import Link from 'next/link';
import { Search, Play, Pause } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
      </div>

      {/* Video Control */}
      <button
        onClick={toggleVideo}
        className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-card/80 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-secondary-foreground transition-all duration-300 backdrop-blur-xl"
        aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
      >
        {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

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
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
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
