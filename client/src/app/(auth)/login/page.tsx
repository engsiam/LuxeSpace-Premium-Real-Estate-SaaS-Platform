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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, User as UserIcon, Lock, Sparkles, ChevronRight, Building2, TrendingUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { GoogleButton } from '@/components/auth/GoogleButton';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const redirectRef = useRef(false);
  const { login, user, isAuthenticated, isLoading } = useAuthStore();

  console.log('[Login] Render:', { user: !!user, isAuthenticated, isLoading, mounted });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isLoading || isLoggingIn) return;
    if (redirectRef.current) {
      console.log('[Login] Redirect already triggered, skipping');
      return;
    }
    
    if (user && isAuthenticated) {
      redirectRef.current = true;
      console.log('[Login] REDIRECT START - user:', user.email, 'role:', user.role);
      
      const role = user.role || 'USER';
      const targetUrl = role === 'ADMIN' ? '/dashboard/admin' : role === 'AGENT' ? '/dashboard/agent' : '/dashboard/user';
      
      console.log('[Login] Target URL:', targetUrl);
      console.log('[Login] Calling router.replace...');
      router.replace(targetUrl);
      console.log('[Login] router.replace called, waiting for navigation...');
    }
  }, [mounted, user, isAuthenticated, isLoading, isLoggingIn, router]);

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    console.log('[Login] Submitting login...');
    setIsLoggingIn(true);
    
    try {
      const success = await login(data.email, data.password);
      console.log('[Login] Login result:', success);
      
      if (success) {
        toast.success('Welcome back!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('[Login] Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [login]);

  const fillDemoCredentials = (role: 'admin' | 'user' | 'agent') => {
    const credentials = {
      admin: { email: 'admin@luxespace.com', password: 'Admin@123' },
      agent: { email: 'agent1@luxespace.com', password: 'Agent@123' },
      user: { email: 'user1@luxespace.com', password: 'User@123' },
    };
    
    const cred = credentials[role];
    form.setValue('email', cred.email);
    form.setValue('password', cred.password);
    toast.success(`${role.toUpperCase()} credentials loaded`);
  };

  if (!mounted || isLoading || isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            {isLoggingIn ? 'Logging in...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (user && isAuthenticated && redirectRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-[#020817]/90 backdrop-blur-2xl shadow-2xl mt-4 md:mt-10 lg:mt-20"
    >
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[850px]">
        <div className="relative overflow-hidden w-full lg:w-[58%] min-h-[300px] lg:min-h-auto order-1">
          <Image
            src="/login.jpg"
            alt="Luxury Property"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-[#020817]/80" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10 lg:p-16">
            <div className="space-y-6 lg:space-y-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight text-white">LuxeSpace</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Elite Property Network</p>
                </div>
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white">Elite Access</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-[-0.05em] text-white">
                Welcome<br /><span className="italic text-white/70">Back.</span>
              </h1>

              <p className="max-w-[480px] text-lg leading-relaxed text-white/70">
                Enter your credentials to unlock premium features.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-[500px]">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <Building2 className="mb-4 h-7 w-7 text-yellow-400" />
                  <h3 className="text-3xl font-black text-white">2.5B+</h3>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">Property Volume</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <TrendingUp className="mb-4 h-7 w-7 text-emerald-400" />
                  <h3 className="text-3xl font-black text-white">98%</h3>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">Client Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#020817] px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16 w-full lg:flex-1 order-2">
          <div className="w-full max-w-[480px]">
            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-primary">Secure Login</p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white">Access Your Account</h2>
              <p className="text-base leading-relaxed text-white/50">Enter your credentials to unlock premium features.</p>
            </div>

            <div className="mt-12">
              <GoogleButton className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-base font-bold text-white hover:bg-white/10 transition-all mb-6 flex items-center justify-center" />

              <div className="mb-8 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-[11px] font-black uppercase tracking-[0.25em] text-white/40">Or sign in with email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                            <Input {...field} placeholder="you@example.com" className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-5 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">Password</FormLabel>
                          <Link href="#" className="text-xs font-bold text-primary hover:text-primary/80">Forgot password?</Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                            <Input {...field} type="password" placeholder="••••••••" className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-5 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoggingIn} 
                    className="h-16 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-[0_10px_40px_rgba(255,215,0,0.25)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(255,215,0,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoggingIn ? (
                      <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>SIGNING IN...</span></div>
                    ) : (
                      <div className="flex items-center gap-2"><span>SIGN IN</span><ChevronRight className="h-5 w-5" /></div>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Or Quick Login</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'user', label: 'User', icon: Globe },
                    { id: 'agent', label: 'Agent', icon: UserIcon },
                    { id: 'admin', label: 'Admin', icon: ShieldCheck }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      disabled={isLoggingIn}
                      onClick={() => fillDemoCredentials(role.id as any)}
                      className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <role.icon className="h-5 w-5 text-white/40 transition group-hover:text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white/60 group-hover:text-white">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-white/40">Don&apos;t have an account? <Link href="/register" className="font-bold text-primary transition hover:text-primary/80">Create Account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}