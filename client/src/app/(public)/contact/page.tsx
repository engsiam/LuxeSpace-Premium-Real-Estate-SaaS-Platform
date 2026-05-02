'use client';

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

  const handleSubmit = async (e: React.FormEvent) => {
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
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.4em] backdrop-blur-sm mb-6">
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
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-8 bg-card rounded-3xl border border-border group hover:border-primary/40 transition-all duration-300 shadow-xl">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 text-primary border border-border group-hover:bg-primary group-hover:text-secondary transition-all duration-500">
                    <item.icon size={28} />
                  </div>
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-2">{item.label}</p>
                  <h3 className="text-xl font-black text-foreground mb-2 leading-tight">{item.value}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="p-10 bg-primary rounded-3xl text-secondary relative overflow-hidden group shadow-2xl shadow-primary/20">
              <Clock className="mb-6" size={40} />
              <h3 className="text-3xl font-black mb-4 leading-none">Weekend Support?</h3>
              <p className="font-bold opacity-80 leading-relaxed text-lg">Our emergency concierge is available even on holidays for urgent property matters.</p>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-1000" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card p-8 md:p-16 rounded-3xl border border-border shadow-2xl relative overflow-hidden">
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
                    <Label htmlFor="name" className="text-foreground font-black uppercase tracking-[0.2em] text-xs ml-1">Full Name</Label>
                    <Input id="name" placeholder="e.g. Rahul Ahmed" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-foreground font-black uppercase tracking-[0.2em] text-xs ml-1">Email Address</Label>
                    <Input id="email" type="email" placeholder="rahul@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="subject" className="text-foreground font-black uppercase tracking-[0.2em] text-xs ml-1">Subject</Label>
                  <Input id="subject" placeholder="e.g. Property Inquiry" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all" />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="message" className="text-foreground font-black uppercase tracking-[0.2em] text-xs ml-1">Your Message</Label>
                  <Textarea id="message" rows={6} placeholder="Tell us about your requirements..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="bg-secondary/50 border-border rounded-3xl p-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-lg transition-all resize-none min-h-[200px]" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-20 py-6 rounded-3xl bg-primary text-secondary text-xl font-black hover:bg-foreground hover:text-background transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group">
                  {loading ? 'Sending Request...' : <><span>Submit Inquiry</span><Send size={24} className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" /></>}
                </Button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 overflow-hidden rounded-3xl border border-border bg-card h-[400px] relative group">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.387383615!2d90.35633137419515!3d23.81033221501092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c791a07363d%3A0xefe840dc5e4d2!2sDhaka!5e0!3m2!1sen!2sbd!4v1711971200000!5m2!1sen!2sbd" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Dhaka Map" className="transition-all duration-700 grayscale invert-[0.8] opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert-0" />
              <div className="absolute inset-0 pointer-events-none border-[12px] border-card rounded-3xl" />
              <div className="absolute top-6 left-6 bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border text-xs font-black uppercase tracking-widest text-foreground">LuxeSpace HQ - Gulshan</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
