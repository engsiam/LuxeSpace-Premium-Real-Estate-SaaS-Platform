'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import type { User } from '@/types';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Phone } from 'lucide-react';

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setUser(response.data.data || null);
        setError(null);
      } catch (error) {
        setError('Failed to fetch profile');
        toast.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <div className="h-8 w-64 bg-card animate-pulse rounded-xl mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-card animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Account</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Profile</span></h1>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <UserIcon size={24} />
            </div>
          <div>
            <h2 className="text-xl font-bold text-white">Profile Information</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-muted-foreground">Name</Label>
            <div className="flex items-center gap-3 mt-2 p-4 bg-background border border-border rounded-xl">
              <UserIcon size={18} className="text-primary" />
              <p className="text-lg text-white">{user?.name}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <div className="flex items-center gap-3 mt-2 p-4 bg-background border border-border rounded-xl">
              <Mail size={18} className="text-primary" />
              <p className="text-lg text-white">{user?.email}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Phone</Label>
            <div className="flex items-center gap-3 mt-2 p-4 bg-background border border-border rounded-xl">
              <Phone size={18} className="text-primary" />
              <p className="text-lg text-white">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Role</Label>
            <div className="flex items-center gap-3 mt-2 p-4 bg-background border border-border rounded-xl">
              <p className="text-lg text-white">{user?.role}</p>
            </div>
          </div>
          <Button onClick={() => router.push('/dashboard/user')} className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
