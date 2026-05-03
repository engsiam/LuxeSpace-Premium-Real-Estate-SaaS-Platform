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
import { useState } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, User as UserIcon, Lock, Sparkles, ChevronRight, Eye, EyeOff, Building2, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

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

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-[40px] border border-white/10 bg-[#020817]/90 backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.45)] border rounded-3xl mt-20"
    >
      <div style={{ display: 'flex', minHeight: '850px' }}>

        {/* LEFT SIDE - Image Panel */}
        <div className="relative overflow-hidden" style={{ width: '58%', flexShrink: 0 }}>

          {/* IMAGE */}
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
            alt="Luxury Property"
            fill
            priority
            className="object-cover"
          />

          {/* OVERLAYS */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-[#020817]/80" />

          {/* GOLD GLOW */}
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />

          {/* CONTENT */}
          <div className="relative z-10 flex h-full flex-col justify-between p-16">

            {/* TOP */}
            <div className="space-y-10">

              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                  <Globe className="h-7 w-7 text-white" />
                </div>

                <div>
                  <p className="text-2xl font-black tracking-tight text-white">
                    LuxeSpace
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Elite Property Network
                  </p>
                </div>
              </Link>

              <div className="max-w-[560px] space-y-8">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white">
                    Elite Access
                  </span>
                </div>

                <h1 className="text-7xl font-black leading-[0.95] tracking-[-0.05em] text-white">
                  Welcome
                  <br />
                  <span className="italic text-white/70">
                    Back.
                  </span>
                </h1>

                <p className="max-w-[480px] text-lg leading-relaxed text-white/70">
                  Access Bangladesh’s most exclusive luxury real estate network and manage your premium property portfolio seamlessly.
                </p>
              </div>
            </div>

            {/* BOTTOM CARDS */}
            <div className="space-y-6">

              <div className="grid grid-cols-2 gap-5 max-w-[500px]">

                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <Building2 className="mb-4 h-7 w-7 text-yellow-400" />
                  <h3 className="text-3xl font-black text-white">
                    2.5B+
                  </h3>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                    Property Volume
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <TrendingUp className="mb-4 h-7 w-7 text-emerald-400" />
                  <h3 className="text-3xl font-black text-white">
                    98%
                  </h3>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                    Client Success
                  </p>
                </div>
              </div>

              <div className="max-w-[520px] rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm leading-relaxed text-white/70">
                  Trusted by elite investors, premium agents, and luxury property developers across Bangladesh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form Panel */}
        <div className="flex items-center justify-center bg-[#020817] px-8 py-16 lg:px-16" style={{ flex: 1 }}>

          <div className="w-full max-w-[480px]">

            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-primary">
                Secure Login
              </p>

              <h2 className="text-3xl font-black tracking-[-0.04em] text-white">
                Access Your Account
              </h2>

              <p className="text-base leading-relaxed text-white/50">
                Enter your credentials to unlock premium features.
              </p>
            </div>

            <div className="mt-12">
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-base font-bold text-white hover:bg-white/10 transition-all mb-8"
              >
                <FcGoogle className="mr-3 h-6 w-6" />
                Continue with Google
              </Button>

              <div className="mb-8 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-[11px] font-black uppercase tracking-[0.25em] text-white/40">Or continue with email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-7"
                >

                  {/* EMAIL */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                          Email Address
                        </FormLabel>

                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />

                            <Input
                              {...field}
                              placeholder="you@example.com"
                              className="h-16 rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-5 text-base text-white placeholder:text-white/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PASSWORD */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-3">

                        <div className="flex items-center justify-between">
                          <FormLabel className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                            Password
                          </FormLabel>

                          <Link
                            href="#"
                            className="text-xs font-bold text-primary hover:text-primary/80"
                          >
                            Forgot password?
                          </Link>
                        </div>

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
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-16 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-[0_10px_40px_rgba(255,215,0,0.25)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(255,215,0,0.35)]"
                  >
                    {loading ? (
                      "AUTHENTICATING..."
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>SIGN IN</span>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* QUICK ACCESS */}
            <div className="mt-10 border-t border-white/10 py-8">

              <p className="mb-5 text-center text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mt-5">
                Quick Access
              </p>

              <div className="flex gap-4">
                {[
                  { id: 'admin', label: 'Admin', icon: ShieldCheck },
                  { id: 'agent', label: 'Agent', icon: UserIcon },
                  { id: 'user', label: 'User', icon: Globe },
                ].map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => fillDemoCredentials(demo.id as any)}
                    className="
          group
          flex-1
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          p-5
          transition-all
          hover:border-primary/40
          hover:bg-primary/10
        "
                  >
                    <demo.icon className="mx-auto mb-3 h-5 w-5 text-white/40 transition group-hover:text-primary" />

                    <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-white/60 group-hover:text-white">
                      {demo.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* REGISTER */}
            <div className="mt-10 text-center">
              <p className="text-sm text-white/40">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-primary transition hover:text-primary/80"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
