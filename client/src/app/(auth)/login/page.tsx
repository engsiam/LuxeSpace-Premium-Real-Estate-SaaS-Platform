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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, User as UserIcon, Lock, Sparkles, ChevronRight, Eye, EyeOff, Building2, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});



export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isHydrating, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isHydrating, router]);

  // Only show loading during hydration, not when authenticated
  if (isHydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const fillDemoCredentials = (role: 'admin' | 'user' | 'agent') => {
    if (role === 'admin') {
      form.setValue('email', 'admin@luxespace.com');
      form.setValue('password', 'Admin@123');
    } else if (role === 'agent') {
      form.setValue('email', 'agent1@luxespace.com');
      form.setValue('password', 'Agent@123');
    } else {
      form.setValue('email', 'user1@luxespace.com');
      form.setValue('password', 'User@123');
    }
    toast.success(`${role.toUpperCase()} credentials loaded`);
  };

  const onSubmit = async (
    data: z.infer<typeof loginSchema>
  ) => {
    const success = await login(
      data.email,
      data.password
    );

    if (success) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };
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
            src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              <div className="mb-8 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-[11px] font-black uppercase tracking-[0.25em] text-white/40">Sign in with email</span>
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
                            <Input {...field} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-14 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white">
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isAuthenticated} className="h-16 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-[0_10px_40px_rgba(255,215,0,0.25)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(255,215,0,0.35)]">
                    {isAuthenticated ? 'REDIRECTING...' : <div className="flex items-center gap-2"><span>SIGN IN</span><ChevronRight className="h-5 w-5" /></div>}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="mt-10 border-t border-white/10 py-8">
              <p className="mb-5 text-center text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mt-5">Quick Access</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[{ id: 'admin', label: 'Admin', icon: ShieldCheck }, { id: 'agent', label: 'Agent', icon: UserIcon }, { id: 'user', label: 'User', icon: Globe }].map((demo) => (
                  <button key={demo.id} type="button" onClick={() => fillDemoCredentials(demo.id as any)} className="group flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5 transition-all hover:border-primary/40 hover:bg-primary/10">
                    <demo.icon className="mx-auto mb-2 sm:mb-3 h-5 w-5 text-white/40 transition group-hover:text-primary" />
                    <p className="text-center text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-white/60 group-hover:text-white">{demo.label}</p>
                  </button>
                ))}
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