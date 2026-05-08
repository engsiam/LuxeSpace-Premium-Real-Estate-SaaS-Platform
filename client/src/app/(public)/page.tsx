export const dynamic = 'force-dynamic';

import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import NewsletterSection from '@/components/home/NewsletterSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const settings = await getSettings();
  
  const heroData = settings ? {
    videos: settings.heroVideos?.filter((v: string) => v && v.trim()) || [],
    title: settings.heroTitle || 'Find Your Dream Property',
    subtitle: settings.heroSubtitle,
    interval: settings.sliderInterval || 8,
  } : {
    videos: [],
    title: 'Find Your Dream Property',
    subtitle: undefined,
    interval: 8,
  };

  return (
    <>
      <HeroSection initialData={heroData} />
      <FeaturedProperties />
      <CategoriesSection />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <BlogPreview />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
    </>
  );
}