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
import { Globe, User as UserIcon, Mail, Lock, ShieldCheck, Briefcase, Sparkles, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-10 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl bg-card border border-border shadow-2xl rounded-[3rem] overflow-hidden relative z-10"
      >
        <div className="flex flex-col md:flex-row min-h-[700px]">
          {/* Left Side - Visual Branding */}
          <div className="md:w-[40%] bg-primary p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden group">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <Link href="/" className="z-10 group/logo">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover/logo:rotate-[360deg] group-hover/logo:scale-110">
                <Globe className="text-primary w-8 h-8" />
              </div>
            </Link>

            <div className="z-10 space-y-8">
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl font-black text-secondary-foreground leading-[0.9] tracking-tighter"
                >
                  Join The<br />Network.
                </motion.h1>
                <div className="h-1.5 w-20 bg-secondary-foreground/20 rounded-full" />
              </div>
              
              <div className="space-y-6 pt-4">
                {[
                  { icon: ShieldCheck, title: 'Secure Protocol', desc: 'Enterprise-grade encryption' },
                  { icon: Sparkles, title: 'Elite Access', desc: 'Off-market luxury listings' },
                  { icon: Briefcase, title: 'Professional Tools', desc: 'Advanced analytics for agents' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-start gap-4 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 backdrop-blur-sm flex items-center justify-center border border-secondary/20 group-hover/item:bg-secondary group-hover/item:border-transparent transition-all duration-300">
                      <item.icon size={20} className="text-secondary-foreground group-hover/item:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-secondary-foreground font-black text-sm uppercase tracking-widest">{item.title}</h4>
                      <p className="text-secondary-foreground/50 text-xs font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="z-10 text-[10px] font-black uppercase tracking-[0.5em] text-secondary-foreground/30">
              © 2026 LUXESPACE • ESTABLISHED PRESTIGE
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="md:w-[60%] p-12 lg:p-16 flex flex-col justify-center space-y-10 bg-card">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-black text-foreground tracking-tight">Create Profile</h2>
              <p className="text-muted-foreground text-sm font-medium">Experience the pinnacle of real estate in Bangladesh</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Legal Identity</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className="h-14 bg-background/50 border-white/10 rounded-2xl pl-14 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 text-base transition-all" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Email Connection</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <Input 
                              placeholder="john@example.com" 
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Membership Tier</FormLabel>
                        <Select onValueChange={(val: string | null) => field.onChange(val || 'USER')} defaultValue={field.value}>
                          <FormControl>
                            <div className="relative group">
                              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5 z-10 group-focus-within:text-primary transition-colors" />
                              <SelectTrigger className="h-14 bg-background/50 border-white/10 rounded-2xl pl-14 text-foreground text-sm font-bold focus:ring-primary/20">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent className="bg-card border-border rounded-2xl">
                            <SelectItem value="USER" className="text-foreground hover:bg-muted transition-colors">Client (Buyer/Renter)</SelectItem>
                            <SelectItem value="AGENT" className="text-foreground hover:bg-muted transition-colors">Partner (Agent/Broker)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Create Secure Key</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 ml-1">Verify Key</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="h-14 bg-muted/30 border-border rounded-2xl pl-14 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 text-base transition-all" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-16 text-lg font-black bg-primary text-secondary rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[45deg]" />
                  {loading ? 'INITIALIZING...' : <div className="flex items-center justify-center gap-3"><span>INITIALIZE MEMBERSHIP</span><ChevronRight size={22} className="transition-transform group-hover/btn:translate-x-1" /></div>}
                </Button>
              </form>
            </Form>

            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center md:text-left">
              <p className="text-sm text-muted-foreground font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 decoration-primary/30 transition-all">
                  Sign In
                </Link>
              </p>
              <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-full border border-border">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Verified 256-Bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
