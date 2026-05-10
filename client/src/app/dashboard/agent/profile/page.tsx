'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Phone, ShieldCheck, CheckCircle2, Sparkles, Camera, Loader2, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const DEMO_ACCOUNTS = [
  'admin@luxespace.com',
  'agent1@luxespace.com',
  'user1@luxespace.com',
];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AgentProfile() {
  const router = useRouter();
  const { updateAvatar: updateUserStoreAvatar } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: undefined,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        const user = response.data.data;
        form.reset({
          name: user.name,
          phone: user.phone || '',
        });
        if (user.avatar) {
          setAvatar(user.avatar);
        }
        setIsDemoAccount(DEMO_ACCOUNTS.some(demo => user.email?.toLowerCase() === demo.toLowerCase()));
      } catch (error) {
        toast.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setUpdating(true);
    try {
      await axiosInstance.patch('/users/me', data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const response = await axiosInstance.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        const newAvatarUrl = response.data.data.avatar;
        setAvatar(newAvatarUrl);
        updateUserStoreAvatar(newAvatarUrl);
        router.refresh();
        toast.success('Profile picture updated!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setChangingPassword(true);
    try {
      await axios.post(`${BASE_URL}/users/change-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }, {
        withCredentials: true,
      });
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-10 bg-background min-h-screen">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40 md:h-10 md:w-64 rounded-xl lg:rounded-2xl" />
          <Skeleton className="h-3 w-32 md:h-4 md:w-48 rounded-xl lg:rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10">
          <div className="space-y-4 md:space-y-6">
            <Skeleton className="h-64 md:h-72 lg:h-80 w-full rounded-xl lg:rounded-2xl" />
            <Skeleton className="h-24 md:h-28 lg:h-32 w-full rounded-xl lg:rounded-2xl" />
          </div>
          <div className="md:col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
            <Skeleton className="h-48 md:h-56 lg:h-64 w-full rounded-xl lg:rounded-2xl" />
            <Skeleton className="h-56 md:h-64 lg:h-72 w-full rounded-xl lg:rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-12 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Agent Portal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Identity <span className="text-primary italic">Settings</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 max-w-6xl">
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <div className="bg-card border border-border shadow-2xl rounded-xl lg:rounded-[2.5rem] p-4 md:p-6 lg:p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/20 group-hover:scale-110 transition-transform duration-500 overflow-hidden relative cursor-pointer"
            >
              {uploadingImage ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}

              {avatar ? (
                <Avatar className="w-full h-full">
                  <AvatarImage src={avatar} alt={form.getValues().name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">{form.getValues().name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <Sparkles size={48} className="text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-black text-white">{form.getValues().name}</h2>
            <p className="text-sm text-muted-foreground font-medium mb-6 italic">Certified Elite Agent</p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 py-2 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={12} />
                <span>Verified Professional</span>
              </div>
            </div>
          </div>

          <div className="bg-primary p-4 md:p-6 lg:p-8 rounded-xl lg:rounded-[2.5rem] shadow-xl text-secondary-foreground space-y-3 md:space-y-4">
            <h3 className="font-black uppercase tracking-widest text-xs opacity-60">Security Protocol</h3>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <p className="text-sm font-bold">Encrypted Connection Active</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
          <div className="bg-card border border-border shadow-2xl rounded-xl lg:rounded-[2.5rem] overflow-hidden">
            <div className="p-4 md:p-6 lg:p-8 border-b border-border bg-background/20 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <UserIcon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Edit Identity</h3>
                <p className="text-xs text-muted-foreground font-medium">Update your professional details</p>
              </div>
            </div>

            <div className="p-4 md:p-6 lg:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
                              <Input {...field} className="h-14 bg-background/50 border-white/10 rounded-2xl pl-12 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Phone Connection</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
                              <Input placeholder="+880 1XXX XXXXXX" {...field} className="h-14 bg-background/50 border-white/10 rounded-2xl pl-12 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="h-14 px-10 bg-primary text-secondary-foreground rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {updating ? 'SAVING CHANGES...' : 'UPDATE IDENTITY'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {isDemoAccount ? (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 md:p-6 lg:p-8 rounded-xl lg:rounded-[2.5rem]">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-amber-500 mb-2">Demo Account</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Password change is disabled for demo accounts. This account is for demonstration purposes only.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border shadow-2xl rounded-xl lg:rounded-[2.5rem] overflow-hidden">
              <div className="p-4 md:p-6 lg:p-8 border-b border-border bg-background/20 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white tracking-tight">Security</h3>
                  <p className="text-xs text-muted-foreground font-medium">Change your password</p>
                </div>
              </div>

              <div className="p-4 md:p-6 lg:p-10">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 md:space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Current Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
                              <Input type={showPasswords.current ? 'text' : 'password'} {...field} className="h-14 bg-background/50 border-white/10 rounded-2xl pl-12 pr-12 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                              <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">New Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
                              <Input type={showPasswords.new ? 'text' : 'password'} {...field} className="h-14 bg-background/50 border-white/10 rounded-2xl pl-12 pr-12 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                              <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
                              <Input type={showPasswords.confirm ? 'text' : 'password'} {...field} className="h-14 bg-background/50 border-white/10 rounded-2xl pl-12 pr-12 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                              <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={changingPassword}
                        className="h-14 px-10 bg-primary text-secondary-foreground rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {changingPassword ? 'CHANGING...' : 'CHANGE PASSWORD'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-card animate-pulse ${className}`} />;
}