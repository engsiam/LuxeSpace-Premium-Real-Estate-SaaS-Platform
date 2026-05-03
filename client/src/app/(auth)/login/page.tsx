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
import { Globe, ShieldCheck, User as UserIcon, Lock, Github, Twitter, Chrome } from 'lucide-react';

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
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-10 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Gradient Blurs (Theme Aware) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-card border border-border shadow-2xl rounded-[3rem] overflow-hidden relative z-10"
      >
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Side - Visual Branding */}
          <div className="md:w-1/2 bg-primary flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden group">
            {/* Abstract Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-[2]" />
            </div>

            <Link href="/" className="z-10 group/logo">
              <div className="w-14 h-14 bg-secondary rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover/logo:rotate-[360deg] group-hover/logo:scale-110">
                <Globe className="text-primary w-8 h-8" />
              </div>
            </Link>

            <div className="z-10 space-y-6">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-black text-secondary-foreground leading-tight tracking-tighter"
              >
                Welcome<br /><span className="text-secondary-foreground/80 italic">Back.</span>
              </motion.h1>
              <p className="text-secondary-foreground/60 text-lg font-medium leading-relaxed max-w-xs">
                Unlock the gateway to Bangladesh's most prestigious real estate network.
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-1 w-16 bg-secondary-foreground/20 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary-foreground/40">Elite Protocol</span>
              </div>
            </div>

            <div className="z-10 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-secondary-foreground/50">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-secondary/20 backdrop-blur-sm" />
                ))}
              </div>
              <span>Trusted by 5k+ Clients</span>
            </div>
          </div>

          {/* Right Side - Authentication Form */}
          <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center space-y-10 bg-card">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight">Access Account</h2>
              <p className="text-muted-foreground text-sm font-medium">Please enter your distinguished credentials below</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Identity (Email)</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="rahul@example.com" 
                            {...field} 
                            className="h-14 bg-background/50 border-white/10 rounded-2xl pl-14 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 text-base transition-all" 
                          />
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
                    <FormItem className="space-y-2">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Secure Key</FormLabel>
                        <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors">Forgot?</Link>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="h-14 bg-background/50 border-white/10 rounded-2xl pl-14 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 text-base transition-all" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full h-16 text-lg font-black bg-primary text-secondary rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden relative group/btn">
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[45deg]" />
                  {loading ? 'AUTHENTICATING...' : 'SIGN IN TO NETWORK'}
                </Button>
              </form>
            </Form>

            <div className="space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-card px-4 text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground/60">Fast Access Portals</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'admin', label: 'ADMIN', icon: ShieldCheck },
                  { id: 'agent', label: 'AGENT', icon: UserIcon },
                  { id: 'user', label: 'USER', icon: Globe },
                ].map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/20 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group/demo"
                    onClick={() => fillDemoCredentials(demo.id as any)}
                  >
                    <demo.icon className="w-5 h-5 text-muted-foreground group-hover/demo:text-primary group-hover/demo:scale-110 transition-all" />
                    <span className="text-[10px] font-black text-muted-foreground group-hover/demo:text-foreground transition-colors">{demo.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm text-muted-foreground font-medium">
                Not a member?{' '}
                <Link href="/register" className="text-primary font-black hover:underline underline-offset-4 decoration-primary/30 transition-all">
                  Apply for Access
                </Link>
              </p>
              <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-full border border-border">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">256-Bit SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
