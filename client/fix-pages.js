const fs = require('fs');
const path = require('path');

// Fix contact page
const contactPath = 'D:/p hero/luxespace/client/src/app/(public)/contact/page.tsx';
const contactContent = `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/contact', formData);
      toast.success('Message sent successfully! Our team will reach out shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-24">
      <section className="relative py-24 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-sm mb-6">
              Get In Touch
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-7xl font-black text-foreground tracking-tighter mb-6">
            Let's Start a <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Conversation</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Whether you're looking for your dream home or have a business inquiry, our premium support team is here to assist you 24/7.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-foreground tracking-tight mb-8">Contact <span className="text-primary">Details</span></h2>
              {[
                { icon: MapPin, label: 'Principal Office', value: 'Gulshan-2, Dhaka, Bangladesh', desc: 'Visit our flagship lounge for a private consultation.' },
                { icon: Mail, label: 'Email Support', value: 'concierge@luxespace.com', desc: 'Expect a response within 2 business hours.' },
                { icon: Phone, label: 'Direct Line', value: '+880 123-456-789', desc: 'Mon-Fri from 9:00 AM to 8:00 PM.' }
              ].map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-8 bg-card rounded-[2rem] border border-border group hover:border-primary/40 transition-all duration-300 shadow-xl">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 text-primary border border-border group-hover:bg-primary group-hover:text-secondary transition-all duration-500">
                    <item.icon size={28} />
                  </div>
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-[9px] mb-2">{item.label}</p>
                  <h3 className="text-xl font-black text-foreground mb-2 leading-tight">{item.value}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="p-10 bg-primary rounded-[2.5rem] text-secondary relative overflow-hidden group shadow-2xl shadow-primary/20">
              <Clock className="mb-6" size={40} />
              <h3 className="text-3xl font-black mb-4 leading-none">Weekend Support?</h3>
              <p className="font-bold opacity-80 leading-relaxed text-lg">Our emergency concierge is available even on holidays for urgent property matters.</p>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-1000" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card p-8 md:p-16 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner"><MessageSquare size={32} /></div>
                <div>
                  <h2 className="text-4xl font-black text-foreground leading-none mb-2">Send a Message</h2>
                  <p className="text-muted-foreground font-medium">Your privacy is our highest priority.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-foreground font-black uppercase tracking-[0.2em] text-[10px] ml-1">Full Name</Label>
                    <Input id="name" placeholder="e.g. Rahul Ahmed" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-foreground font-black uppercase tracking-[0.2em] text-[10px] ml-1">Email Address</Label>
                    <Input id="email" type="email" placeholder="rahul@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="subject" className="text-foreground font-black uppercase tracking-[0.2em] text-[10px] ml-1">Subject</Label>
                  <Input id="subject" placeholder="e.g. Property Inquiry" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all" />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="message" className="text-foreground font-black uppercase tracking-[0.2em] text-[10px] ml-1">Your Message</Label>
                  <Textarea id="message" rows={6} placeholder="Tell us about your requirements..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="bg-secondary/50 border-border rounded-[2rem] p-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all resize-none min-h-[200px]" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-20 py-6 rounded-[1.5rem] bg-primary text-secondary text-xl font-black hover:bg-foreground hover:text-background transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group">
                  {loading ? 'Sending Request...' : <><span>Submit Inquiry</span><Send size={24} className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" /></>}
                </Button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 overflow-hidden rounded-[3rem] border border-border bg-card h-[400px] relative group">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.387383615!2d90.35633137419515!3d23.81033221501092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c791a07363d%3A0xefe840dc5e4d2!2sDhaka!5e0!3m2!1sen!2sbd!4v1711971200000!5m2!1sen!2sbd" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Dhaka Map" className="transition-all duration-700 grayscale invert-[0.8] opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert-0" />
              <div className="absolute inset-0 pointer-events-none border-[12px] border-card rounded-[3rem]" />
              <div className="absolute top-6 left-6 bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-foreground">LuxeSpace HQ - Gulshan</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync(contactPath, contactContent);
console.log('Contact page fixed');

// Fix property details page
const propertyPath = 'D:/p hero/luxespace/client/src/app/(public)/properties/[id]/page.tsx';

const propertyContent = `'use client';

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
  const [property, setProperty] = useState(null);
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
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch property');
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const onSubmitReview = async (data) => {
    try {
      await axiosInstance.post('/reviews', { propertyId: id, ...data });
      toast.success('Review submitted successfully!');
      reviewForm.reset();
    } catch (error) {
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
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-[2rem] border border-border p-10">
              <h2 className="text-2xl font-black text-foreground mb-8">Property <span className="text-primary italic">Overview</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { icon: Maximize, label: 'Area', value: property.area + ' sq.ft.' },
                  { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
                  { icon: Building2, label: 'Type', value: property.type },
                  { icon: MapPin, label: 'Location', value: property.city },
                ].map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 bg-background rounded-2xl border border-border text-center">
                    <item.icon className="mx-auto mb-3 text-primary" size={24} />
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-black text-foreground">{item.value}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg whitespace-pre-wrap">{property.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-[2rem] border border-border overflow-hidden">
              <div className="flex border-b border-border px-6">
                {[
                  { value: 'description', label: 'Description', icon: FileText },
                  { value: 'amenities', label: 'Amenities', icon: Sparkles },
                  { value: 'reviews', label: 'Reviews (' + (property.reviews?.length || 0) + ')', icon: MessageSquare },
                ].map((tab) => (
                  <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={\`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 \${activeTab === tab.value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}\`}>
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className={\`p-10 \${activeTab === 'description' ? 'block' : 'hidden'}\`}>
                <h3 className="text-2xl font-black text-foreground mb-6">About this <span className="text-primary italic">Property</span></h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg whitespace-pre-wrap">{property.description}</p>
              </div>
              <div className={\`p-10 \${activeTab === 'amenities' ? 'block' : 'hidden'}\`}>
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
              <div className={\`p-10 \${activeTab === 'reviews' ? 'block' : 'hidden'}\`}>
                <h3 className="text-2xl font-black text-foreground mb-8">Visitor <span className="text-primary italic">Experiences</span></h3>
                <div className="space-y-6 mb-12">
                  {property.reviews && property.reviews.length > 0 ? property.reviews.map((review) => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 bg-background border border-border rounded-2xl">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-secondary font-black text-xl">{review.user.name[0]}</div>
                          <div>
                            <p className="font-black text-foreground">{review.user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Verified Resident</p>
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
                      <Label className="text-muted-foreground font-black uppercase tracking-widest text-[10px] ml-1">Rating</Label>
                      <select {...reviewForm.register('rating', { valueAsNumber: true })} className="w-full h-14 bg-card border border-border rounded-xl px-4 text-foreground font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        <option value={5}>5 Stars - Exceptional</option>
                        <option value={4}>4 Stars - Great</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Very Poor</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground font-black uppercase tracking-widest text-[10px] ml-1">Your Comment</Label>
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
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-[2rem] border border-border p-8 sticky top-32">
              <h3 className="text-2xl font-black text-foreground mb-6">Interested in this <span className="text-primary italic">Property?</span></h3>
              <Button onClick={() => setIsBookingOpen(true)} className="w-full h-16 bg-primary text-secondary font-black text-lg rounded-2xl hover:bg-foreground hover:text-background transition-all mb-6">Schedule a Viewing</Button>
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><User size={20} /></div>
                  <div>
                    <p className="font-black text-foreground">{property.agent?.name || 'LuxeSpace Agent'}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Premium Agent</p>
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
`;

fs.writeFileSync(propertyPath, propertyContent);
console.log('Property details page fixed');
console.log('All pages fixed successfully!');
