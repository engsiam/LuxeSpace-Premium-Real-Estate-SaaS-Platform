'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Settings, Film, Clock, Globe, Mail, Upload, X, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

const DEFAULT_VIDEOS: string[] = [];

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [siteName, setSiteName] = useState('LuxeSpace');
  const [supportEmail, setSupportEmail] = useState('support@luxespace.com');
  const [heroTitle, setHeroTitle] = useState('Find Your Dream Property');
  const [heroSubtitle, setHeroSubtitle] = useState('Connecting distinguished individuals with Bangladesh\'s most extraordinary architectural masterpieces. Experience luxury living redefined.');
  const [heroVideos, setHeroVideos] = useState<string[]>(DEFAULT_VIDEOS);
  const [sliderInterval, setSliderInterval] = useState(8);
  const [sliderAutoPlay, setSliderAutoPlay] = useState(true);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/settings');
        const settings = response.data.data;
        if (settings) {
          if (settings.siteName) setSiteName(settings.siteName);
          if (settings.supportEmail) setSupportEmail(settings.supportEmail);
          if (settings.heroTitle) setHeroTitle(settings.heroTitle);
          if (settings.heroSubtitle) setHeroSubtitle(settings.heroSubtitle);
          if (settings.heroVideos && settings.heroVideos.length > 0) setHeroVideos(settings.heroVideos);
          if (settings.sliderInterval) setSliderInterval(settings.sliderInterval);
          if (settings.sliderAutoPlay !== undefined) setSliderAutoPlay(settings.sliderAutoPlay);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('videos', files[i]);
    }

    try {
      const response = await axiosInstance.post('/settings/herovideos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setHeroVideos(response.data.data.heroVideos);
        toast.success('Video uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      setHeroVideos([...heroVideos, newVideoUrl.trim()]);
      setNewVideoUrl('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    setHeroVideos(heroVideos.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch('/settings', {
        siteName,
        supportEmail,
        heroTitle,
        heroSubtitle,
        heroVideos,
        sliderInterval,
        sliderAutoPlay,
      });
      if (response.data.success) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Configuration</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white">System <span className="text-primary italic">Settings</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border shadow-xl rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Globe size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">General Info</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Site Name</label>
              <div className="relative">
                <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border shadow-xl rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Slider Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Auto-Slide Interval (seconds)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={sliderInterval}
                  onChange={(e) => setSliderInterval(Number(e.target.value))}
                  className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="sliderAutoPlay"
                checked={sliderAutoPlay}
                onChange={(e) => setSliderAutoPlay(e.target.checked)}
                className="w-5 h-5 rounded border-border bg-background text-primary"
              />
              <label htmlFor="sliderAutoPlay" className="text-white cursor-pointer">Auto-play Videos</label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border shadow-xl rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Film size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Hero Section</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Hero Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Hero Subtitle</label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full h-11 px-4 py-2 bg-background border border-border rounded-xl text-white focus:border-primary focus:outline-none resize-none"
                rows={1}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="text-sm text-muted-foreground mb-3 block">Hero Videos (upload or add URL)</label>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="video/mp4,video/webm,video/mov"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
                multiple
              />
              <label
                htmlFor="video-upload"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 cursor-pointer text-sm font-medium"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading...' : 'Upload Video'}
              </label>
              <span className="text-xs text-muted-foreground">MP4, WebM, MOV (max 50MB)</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {heroVideos.map((video, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={video}
                    onChange={(e) => {
                      const newVideos = [...heroVideos];
                      newVideos[index] = e.target.value;
                      setHeroVideos(newVideos);
                    }}
                    className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                    placeholder="Video URL"
                  />
                  <button
                    onClick={() => handleRemoveVideo(index)}
                    className="px-3 h-10 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVideo())}
                  className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                  placeholder="Or add video URL"
                />
                <button
                  onClick={handleAddVideo}
                  className="px-4 h-10 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-primary text-secondary-foreground font-bold hover:bg-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}