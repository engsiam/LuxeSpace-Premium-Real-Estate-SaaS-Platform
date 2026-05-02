'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PropertyTable from '@/components/dashboard/PropertyTable';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

export default function AgentProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get('/properties?limit=100');
        setProperties(response.data.data || []);
      } catch (error) {
        toast.error('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Property Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Properties</span></h1>
        </div>
        <Link href="/dashboard/agent/add-property">
          <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold">
            <Building2 size={18} className="mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Properties</h2>
            <p className="text-sm text-muted-foreground">{properties.length} properties found</p>
          </div>
        </div>
        <PropertyTable properties={properties} loading={loading} />
      </div>
    </div>
  );
}
