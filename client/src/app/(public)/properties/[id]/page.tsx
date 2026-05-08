'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import BookingModal from '@/components/property/BookingModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Maximize, BedDouble, Building2, CheckCircle2,
  Star, User, Phone, Mail, ShieldCheck, FileText,
  Sparkles, MessageSquare, ChevronLeft, ChevronRight, Share2, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const reviewForm = useForm<
    z.infer<typeof reviewSchema>
  >({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get('/properties/' + id);
        setProperty(response.data.data || null);
        setError(null);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch property');
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const onSubmitReview = async (
    data: z.infer<typeof reviewSchema>
  ) => {
    try {
      await axiosInstance.post('/reviews', { propertyId: id, ...data });
      toast.success('Review submitted successfully!');
      reviewForm.reset();
      // Refresh property to show new review
      const response = await axiosInstance.get('/properties/' + id);
      setProperty(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const nextImage = () => {
    if (!property?.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property?.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-[600px] w-full rounded-[3rem] mb-12 bg-card" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-12 w-3/4 bg-card" />
              <Skeleton className="h-40 w-full rounded-[2rem] bg-card" />
            </div>
            <Skeleton className="h-96 rounded-[2rem] bg-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-black text-white">Property Not Found</h1>
          <Button onClick={() => router.push('/explore')} className="bg-primary text-secondary-foreground font-black px-8 h-14 rounded-2xl">Back to Explore</Button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : ['/placeholder.jpg'];
  const amenities = property.amenities || [];

  return (
    <div className="bg-[#0B0F1A] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Gallery / Hero Carousel */}
        <div className="relative mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden border border-white/5 shadow-3xl"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-80" />

            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 hover:bg-primary hover:text-secondary-foreground transition-all z-20">
                  <ChevronLeft size={28} />
                </button>
                <button onClick={nextImage} className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 hover:bg-primary hover:text-secondary-foreground transition-all z-20">
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Float Badges */}
            <div className="absolute top-8 left-8 flex gap-4 z-20">
              <Badge className="bg-primary/90 text-secondary-foreground px-4 py-2 rounded-xl border-0 font-black uppercase tracking-widest text-[10px] backdrop-blur-md">
                Featured Asset
              </Badge>
              <Badge className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 font-black uppercase tracking-widest text-[10px] backdrop-blur-md">
                {property.type}
              </Badge>
            </div>

            <div className="absolute top-8 right-8 flex gap-3 z-20">
              <button className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-all">
                <Heart size={20} />
              </button>
              <button className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-secondary-foreground transition-all">
                <Share2 size={20} />
              </button>
            </div>

            {/* Property Title & Price */}
            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6 z-20">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">{property.title}</h1>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">{property.city}, {property.location}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-3xl">
                <p className="text-primary text-5xl font-black tracking-tighter leading-none mb-1">৳{property.price?.toLocaleString()}</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Market Valuation</p>
              </div>
            </div>
          </motion.div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === i ? 'border-primary' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Maximize, label: 'Dimensions', value: property.size + ' sq.ft.' },
                { icon: BedDouble, label: 'Capacity', value: property.bhk + ' BHK' },
                { icon: Building2, label: 'Category', value: property.type },
                { icon: MapPin, label: 'Neighborhood', value: property.area },
              ].map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white/2 border border-white/5 p-6 rounded-3xl text-center hover:border-primary/20 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="text-primary" size={24} />
                  </div>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-black text-white tracking-tight">{item.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Content Tabs Section */}
            <div className="bg-card/30 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-xl">
              <div className="flex flex-wrap border-b border-white/5 bg-white/2">
                {[
                  { value: 'description', label: 'Narrative', icon: FileText },
                  { value: 'amenities', label: 'Amenities', icon: Sparkles },
                  { value: 'reviews', label: 'Resident Reviews', icon: MessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-3 px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.value ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {activeTab === tab.value && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(201,167,77,1)]" />}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-12 min-h-[400px]"
                >
                  {activeTab === 'description' && (
                    <div className="space-y-8">
                      <h3 className="text-3xl font-black text-white">The <span className="text-primary italic">Residence</span> Story</h3>
                      <p className="text-white/60 font-medium leading-[2] text-xl whitespace-pre-wrap">{property.description}</p>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div className="space-y-10">
                      <h3 className="text-3xl font-black text-white">Premium <span className="text-primary italic">Conveniences</span></h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {amenities.length > 0 ? amenities.map((amenity, index) => (
                          <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex items-center gap-5 p-6 bg-white/5 border border-white/5 rounded-[2rem] group hover:border-primary/20 transition-all">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><CheckCircle2 size={20} /></div>
                            <span className="text-white text-lg font-black tracking-tight">{amenity}</span>
                          </motion.div>
                        )) : (
                          <div className="col-span-2 py-12 text-center bg-white/2 rounded-[2rem] border border-dashed border-white/5">
                            <Sparkles className="mx-auto text-white/20 mb-4" size={48} />
                            <p className="text-white/40 italic font-medium">Standard luxury amenities are included. Inquire for specific list.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-10">
                      <h3 className="text-3xl font-black text-white">Client <span className="text-primary italic">Testimonials</span></h3>
                      <div className="space-y-8 mb-16">
                        {property.reviews && property.reviews.length > 0 ? property.reviews.map((review) => (
                          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem]">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-secondary-foreground font-black">{review.user.name[0]}</div>
                                <div>
                                  <p className="font-black text-white">{review.user.name}</p>
                                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">Verified Resident</p>
                                </div>
                              </div>
                              <div className="flex gap-1 text-primary">
                                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'opacity-20'} />)}
                              </div>
                            </div>
                            <p className="text-white/60 font-medium italic">"{review.comment}"</p>
                          </motion.div>
                        )) : <p className="text-white/40">No reviews yet. Share your experience below.</p>}
                      </div>

                      {isAuthenticated && (
                        <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-10">
                          <h4 className="text-xl font-black text-white mb-8">Post a Review</h4>
                          <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-8">
                            <div className="space-y-3">
                              <Label className="text-white/40 font-black uppercase tracking-widest text-[10px] ml-2">Rating</Label>
                              <select {...reviewForm.register('rating', { valueAsNumber: true })} className="w-full h-14 bg-background border border-white/10 rounded-2xl px-6 text-white font-black">
                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                              </select>
                            </div>
                            <div className="space-y-3">
                              <Label className="text-white/40 font-black uppercase tracking-widest text-[10px] ml-2">Observation</Label>
                              <Textarea {...reviewForm.register('comment')} placeholder="Your thoughts on this residence..." className="bg-background border border-white/10 rounded-[2rem] p-8 text-white min-h-[140px]" />
                              {reviewForm.formState.errors.comment && <p className="text-xs text-rose-500 font-bold">{reviewForm.formState.errors.comment.message}</p>}
                            </div>
                            <Button type="submit" className="bg-primary text-secondary-foreground font-black h-16 px-10 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20">Submit Experience</Button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Inquiry */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card border border-white/5 p-10 rounded-[3rem] sticky top-32 shadow-3xl">
              <h3 className="text-2xl font-black text-white mb-8 leading-tight">Inquire about this <span className="text-primary italic font-serif">Residence?</span></h3>
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Please login to book a viewing');
                    router.push(`/login?callbackUrl=/properties/${id}`);
                  } else {
                    setIsBookingOpen(true);
                  }
                }}
                className="w-full h-20 bg-primary text-secondary-foreground font-black text-xl rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(201,167,77,0.4)] mb-10 group"
              >
                <span>Reserve Consultation</span>
                <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>

              <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                    <User size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-white text-lg mb-1">{property.agent?.name || 'LuxeSpace Concierge'}</p>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-primary" />
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Premium Portfolio Agent</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-14 rounded-2xl border-white/10 text-white hover:border-primary/50 font-black uppercase text-[10px] tracking-widest"><Phone size={16} className="mr-2 text-primary" />Call</Button>
                  <Button variant="outline" className="h-14 rounded-2xl border-white/10 text-white hover:border-primary/50 font-black uppercase text-[10px] tracking-widest"><Mail size={16} className="mr-2 text-primary" />Email</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <BookingModal property={property} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
