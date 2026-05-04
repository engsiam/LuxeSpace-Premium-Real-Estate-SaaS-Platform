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
import { Globe, User as UserIcon, Mail, Lock, ShieldCheck, Briefcase, Sparkles, ChevronRight, Eye, EyeOff, Check, Star } from 'lucide-react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const handleGoogleAuth = async () => {
    try {
      // By default, NextAuth's Google provider handles the user creation and role assignment
      // in the backend callbacks (e.g., setting default role to 'USER').
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      toast.error('Failed to authenticate with Google');
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms & Conditions to continue.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success('Account created successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto overflow-hidden rounded-[40px] border border-white/10 bg-[#020817]/90 backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.45)] border rounded-3xl mt-4 md:mt-10 lg:mt-20"
    >
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[850px]">

        {/* Left Side - Image Panel */}
        <div className="relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-16 w-full lg:w-[58%] min-h-[300px] lg:min-h-auto order-1">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop"
              alt="Premium Living"
              fill
              className="object-cover scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-180">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-bold text-xl tracking-wide">LuxeSpace</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-8 mt-20 lg:mt-0">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Exclusive Membership</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black dark:text-white text-black leading-[1.1] tracking-tighter flex">
                Join The Network

              </h1>
              <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                Experience the pinnacle of real estate in Bangladesh. Join a community of elite investors and property owners.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-5 pt-4">
              {[
                { icon: ShieldCheck, title: 'Bank-Grade Security', desc: 'Enterprise-level encryption for all your data.' },
                { icon: Sparkles, title: 'Elite Access', desc: 'View exclusive, off-market luxury listings.' },
                { icon: Briefcase, title: 'Professional Tools', desc: 'Advanced analytics and market insights.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">{item.title}</h4>
                    <p className="text-white/50 text-[11px] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="flex items-center justify-center bg-[#020817] px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16 w-full lg:flex-1 order-2">
          <div className="w-full max-w-[480px]">

            <div className="space-y-3 mb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-primary">
                Membership Application
              </p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white">
                Create Account
              </h2>
              <p className="text-base leading-relaxed text-white/50">
                Apply for membership to unlock premium features.
              </p>
            </div>

            <div className="mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-base font-bold text-white hover:bg-white/10 transition-all mb-8"
              >
                <FcGoogle className="mr-3 h-6 w-6" />
                Continue with Google
              </Button>

              <div className="mb-8 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-[11px] font-black uppercase tracking-[0.25em] text-white/40">Or register with email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* NAME */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                            <Input
                              {...field}
                              placeholder="John Doe"
                              className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-5 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* EMAIL + ROLE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                              <Input
                                {...field}
                                placeholder="john@example.com"
                                className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-5 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                            Account Type
                          </FormLabel>
                          <Select onValueChange={(val: string | null) => field.onChange(val || 'USER')} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <Briefcase className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 z-10" />
                                <SelectTrigger className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 text-white text-base focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent className="bg-[#0d1526] border-white/10 rounded-2xl shadow-2xl">
                              <SelectItem value="USER" className="text-white/80 hover:text-white rounded-xl">Client / Buyer</SelectItem>
                              <SelectItem value="AGENT" className="text-white/80 hover:text-white rounded-xl">Agent / Broker</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* PASSWORD + CONFIRM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-14 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                            Confirm
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                              <Input
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-14 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                              >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* TERMS */}
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${agreedToTerms
                        ? 'bg-primary border-primary'
                        : 'border-white/20 bg-transparent hover:border-primary/60'
                        }`}
                    >
                      {agreedToTerms && <Check className="h-3 w-3 text-primary-foreground" />}
                    </button>
                    <p className="text-xs leading-relaxed text-white/50">
                      I agree to LuxeSpace's{' '}
                      <Link href="/terms" className="font-bold text-white hover:text-primary transition">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="font-bold text-white hover:text-primary transition">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="h-16 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-[0_10px_40px_rgba(255,215,0,0.25)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(255,215,0,0.35)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        <span>INITIALIZING...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>INITIALIZE MEMBERSHIP</span>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* SIGN IN LINK */}
            <div className="mt-10 text-center">
              <p className="text-sm text-white/40">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-primary transition hover:text-primary/80">
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}

