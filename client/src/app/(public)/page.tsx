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

export default function HomePage() {
  return (
    <>
      <HeroSection />
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
