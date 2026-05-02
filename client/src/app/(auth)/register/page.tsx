'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';
import { Globe, User as UserIcon, Mail, Lock, ShieldCheck, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['USER', 'AGENT']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-10 left-10 z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
              <Globe className="text-secondary w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-foreground">
              LUXE<span className="text-primary">SPACE</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Sparkles className="text-primary w-10 h-10" />
            </div>
            <h2 className="text-5xl font-black text-foreground leading-none">
              Join the<br /><span className="text-primary">Elite Circle</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              Unlock access to Bangladesh's most exclusive luxury real estate portfolio.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: 'Verified & Secure' },
              { icon: Sparkles, text: 'Premium Listings' },
              { icon: Globe, text: 'Global Network' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <item.icon size={20} className="text-primary" />
                </div>
                <span className="text-foreground font-bold">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-10 text-xs text-muted-foreground font-black uppercase tracking-widest">
          © 2026 LuxeSpace. All Rights Reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Globe className="text-secondary w-8 h-8" />
              </div>
              <span className="text-4xl font-black tracking-tighter text-foreground">
                LUXE<span className="text-primary">SPACE</span>
              </span>
            </Link>
          </div>

          <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-10 space-y-3 text-center border-b border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-primary w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">Create Account</h2>
              <p className="text-muted-foreground font-medium text-sm">Join the elite network of property enthusiasts</p>
            </div>

            <div className="p-10 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                            <Input placeholder="John Doe" {...field} className="h-14 bg-secondary border-border rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base transition-all" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                              <Input placeholder="john@example.com" {...field} className="h-14 bg-secondary border-border rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Membership</FormLabel>
                          <Select onValueChange={(val: string | null) => field.onChange(val || 'USER')} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 z-10" />
                                <SelectTrigger className="h-14 bg-secondary border-border rounded-2xl pl-12 text-foreground font-bold focus:ring-primary/40">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent className="bg-card border-border rounded-2xl">
                              <SelectItem value="USER" className="text-foreground focus:bg-primary/10">User (Buyer/Renter)</SelectItem>
                              <SelectItem value="AGENT" className="text-foreground focus:bg-primary/10">Agent (Lister)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                              <Input type="password" placeholder="••••••••" {...field} className="h-14 bg-secondary border-border rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Confirm</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                              <Input type="password" placeholder="••••••••" {...field} className="h-14 bg-secondary border-border rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-16 text-lg font-black bg-primary text-secondary rounded-2xl shadow-xl shadow-primary/20 hover:bg-foreground hover:text-background transition-all group">
                    {loading ? 'Creating Account...' : <><span>REGISTER NOW</span><ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></>}
                  </Button>
                </form>
              </Form>

              <div className="pt-6 border-t border-border text-center space-y-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Already part of the network?{' '}
                  <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 decoration-primary/30 transition-all">
                    Sign In
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-black uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-primary" />
                  <span>100% Secure Registration</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
