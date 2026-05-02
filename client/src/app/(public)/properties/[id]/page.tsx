'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import BookingModal from '@/components/property/BookingModal';
import { motion } from 'framer-motion';
import { MapPin, Maximize, BedDouble, Building2, CheckCircle2, Star, User, Phone, Mail, ShieldCheck, Calendar, FileText, Sparkles, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const reviewForm = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
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

  const onSubmitReview = async (data: { rating: number; comment: string }) => {
    try {
      await axiosInstance.post('/reviews', { propertyId: id, ...data });
      toast.success('Review submitted successfully!');
      reviewForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-[600px] w-full rounded-2xl mb-12 bg-card" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-12 w-3/4 bg-card" />
              <Skeleton className="h-6 w-1/2 bg-card" />
              <Skeleton className="h-40 w-full rounded-3xl bg-card" />
            </div>
            <Skeleton className="h-96 rounded-3xl bg-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-black text-foreground">Error Loading Property</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-secondary">Retry</Button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-black text-foreground">Property Not Found</h1>
          <Button onClick={() => router.push('/explore')} className="bg-primary text-secondary font-black px-8 h-14 rounded-2xl">Back to Explore</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-[600px] rounded-2xl overflow-hidden border border-border shadow-2xl mb-12 group">
          {property.images?.[0] && <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
            <div>
              <Badge className="mb-4 bg-primary/90 text-secondary border-0">{property.type}</Badge>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={18} />
                <span className="font-bold">{property.city}, {property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary text-4xl font-black">৳{property.price?.toLocaleString()}</p>
              <p className="text-muted-foreground text-sm font-bold">Total Price</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl border border-border p-10">
              <h2 className="text-2xl font-black text-foreground mb-8">Property <span className="text-primary italic">Overview</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { icon: Maximize, label: 'Area', value: property.area + ' sq.ft.' },
                  { icon: BedDouble, label: 'BHK', value: property.bhk },
                  { icon: Building2, label: 'Type', value: property.type },
                  { icon: MapPin, label: 'Location', value: property.city },
                ].map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 bg-background rounded-2xl border border-border text-center">
                    <item.icon className="mx-auto mb-3 text-primary" size={24} />
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-black text-foreground">{item.value}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg whitespace-pre-wrap">{property.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="flex border-b border-border px-6">
                {[
                  { value: 'description', label: 'Description', icon: FileText },
                  { value: 'amenities', label: 'Amenities', icon: Sparkles },
                  { value: 'reviews', label: 'Reviews (' + (property.reviews?.length || 0) + ')', icon: MessageSquare },
                ].map((tab) => (
                  <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === tab.value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className={`p-10 ${activeTab === 'description' ? 'block' : 'hidden'}`}>
                <h3 className="text-2xl font-black text-foreground mb-6">About this <span className="text-primary italic">Property</span></h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg whitespace-pre-wrap">{property.description}</p>
              </div>
              <div className={`p-10 ${activeTab === 'amenities' ? 'block' : 'hidden'}`}>
                <h3 className="text-2xl font-black text-foreground mb-8">World-class <span className="text-primary italic">Amenities</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities?.map((amenity, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-5 bg-background border border-border rounded-2xl group hover:border-primary/30 transition-all">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><CheckCircle2 size={18} /></div>
                      <span className="text-foreground font-bold">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className={`p-10 ${activeTab === 'reviews' ? 'block' : 'hidden'}`}>
                <h3 className="text-2xl font-black text-foreground mb-8">Visitor <span className="text-primary italic">Experiences</span></h3>
                <div className="space-y-6 mb-12">
                  {property.reviews && property.reviews.length > 0 ? property.reviews.map((review) => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 bg-background border border-border rounded-2xl">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-secondary font-black text-xl">{review.user.name[0]}</div>
                          <div>
                            <p className="font-black text-foreground">{review.user.name}</p>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Verified Resident</p>
                          </div>
                        </div>
                        <div className="flex gap-1 text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                        </div>
                      </div>
                      <p className="text-muted-foreground font-medium leading-relaxed">{review.comment}</p>
                    </motion.div>
                  )) : <p className="text-muted-foreground">No reviews yet.</p>}
                </div>
                <div className="bg-background rounded-2xl border border-border p-8">
                  <h4 className="text-xl font-black text-foreground mb-6">Write a Review</h4>
                  <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground font-black uppercase tracking-widest text-xs ml-1">Rating</Label>
                      <select {...reviewForm.register('rating', { valueAsNumber: true })} className="w-full h-14 bg-card border border-border rounded-xl px-4 text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        <option value={5}>5 Stars - Exceptional</option>
                        <option value={4}>4 Stars - Great</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Very Poor</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground font-black uppercase tracking-widest text-xs ml-1">Your Comment</Label>
                      <Textarea {...reviewForm.register('comment')} placeholder="Share your experience..." className="bg-card border border-border rounded-2xl p-6 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-lg transition-all min-h-[120px] resize-none" />
                      {reviewForm.formState.errors.comment && <p className="text-sm text-red-500 font-bold ml-1">{reviewForm.formState.errors.comment.message}</p>}
                    </div>
                    <Button type="submit" className="bg-primary text-secondary font-black h-14 px-10 rounded-xl hover:bg-foreground hover:text-background transition-colors">Post Review</Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl border border-border p-8 sticky top-32">
              <h3 className="text-2xl font-black text-foreground mb-6">Interested in this <span className="text-primary italic">Property?</span></h3>
              <Button onClick={() => setIsBookingOpen(true)} className="w-full h-16 bg-primary text-secondary font-black text-lg rounded-2xl hover:bg-foreground hover:text-background transition-all mb-6">Schedule a Viewing</Button>
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><User size={20} /></div>
                  <div>
                    <p className="font-black text-foreground">{property.agent?.name || 'LuxeSpace Agent'}</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Premium Agent</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl border-border text-foreground hover:bg-muted"><Phone size={16} className="mr-2" />Call</Button>
                  <Button variant="outline" className="flex-1 h-12 rounded-xl border-border text-foreground hover:bg-muted"><Mail size={16} className="mr-2" />Email</Button>
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
