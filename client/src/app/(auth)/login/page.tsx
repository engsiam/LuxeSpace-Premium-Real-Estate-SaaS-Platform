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
import { signIn, getSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, User as UserIcon, Lock, ArrowRight, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const fillDemoCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      form.setValue('email', 'admin@luxespace.com');
      form.setValue('password', 'Admin@123');
    } else {
      form.setValue('email', 'user1@luxespace.com');
      form.setValue('password', 'User@123');
    }
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
        toast.success('Login successful!');
        const session = await getSession();
        const role = session?.user?.role || 'USER';
        router.push(`/dashboard/${role.toLowerCase()}`);
        router.refresh();
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-border/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/20 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10 px-6"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
              <Globe className="text-secondary w-9 h-9" />
            </div>
            <span className="text-5xl font-black tracking-tighter text-foreground">
              LUXE<span className="text-primary">SPACE</span>
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-10 space-y-3 text-center border-b border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-primary w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground font-medium">Secure access to your luxury portfolio</p>
          </div>

          <div className="p-10 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                          <Input placeholder="rahul@example.com" {...field} className="h-14 bg-secondary border-border rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Secure Password</FormLabel>
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

                <Button type="submit" disabled={loading} className="w-full h-16 text-lg font-black bg-primary text-secondary rounded-2xl shadow-xl shadow-primary/20 hover:bg-foreground hover:text-background transition-all group">
                  {loading ? 'Processing...' : <><span>SIGN IN</span><ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></>}
                </Button>
              </form>
            </Form>

            <div className="space-y-4 pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black">
                  <span className="bg-card px-4 text-muted-foreground">Demo Accounts</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl font-black text-xs border-primary/20 text-primary hover:bg-primary hover:text-secondary transition-all"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  ADMIN ACCESS
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-xl font-black text-xs border-primary/20 text-primary hover:bg-primary hover:text-secondary transition-all"
                  onClick={() => fillDemoCredentials('user')}
                >
                  USER ACCESS
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-border text-center space-y-4">
              <p className="text-sm text-muted-foreground font-medium">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-black hover:underline underline-offset-4 decoration-primary/30 transition-all">
                  Join LuxeSpace
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-black uppercase tracking-widest">
                <ShieldCheck size={14} className="text-primary" />
                <span>SSL Encrypted Connection</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
