'use client';

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import { Settings, ShieldCheck } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings updated successfully!');
    }, 1000);
  };

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Configuration</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">System <span className="text-primary italic">Settings</span></h1>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">General Settings</h2>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="siteName" className="text-muted-foreground">Site Name</Label>
              <Input id="siteName" defaultValue="LuxeSpace" className="bg-background border-border text-white focus-visible:border-primary] focus-visible:ring-1 focus-visible:ring-[#C9A74D]" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail" className="text-muted-foreground">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@luxespace.com" className="bg-background border-border text-white focus-visible:border-primary] focus-visible:ring-1 focus-visible:ring-[#C9A74D]" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Payment Integration (bKash)</h2>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="merchantId" className="text-muted-foreground">Merchant ID</Label>
              <Input id="merchantId" defaultValue="LX-99221" className="bg-background border-border text-white focus-visible:border-primary] focus-visible:ring-1 focus-visible:ring-[#C9A74D]" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey" className="text-muted-foreground">API Key</Label>
              <Input id="apiKey" type="password" defaultValue="••••••••••••••••" className="bg-background border-border text-white focus-visible:border-primary] focus-visible:ring-1 focus-visible:ring-[#C9A74D]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-primary text-secondary-foreground font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
