'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PropertyTable from '@/components/dashboard/PropertyTable';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { toast } from 'sonner';
import { Building2, Plus } from 'lucide-react';

export default function AgentProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/properties?limit=100');
      setProperties(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/properties/${id}`);
      toast.success('Property deleted successfully');
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Portfolio Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Properties</span></h1>
        </div>
        <Link href="/dashboard/agent/add-property">
          <Button className="h-14 px-8 bg-primary text-secondary-foreground hover:bg-white rounded-2xl font-black shadow-[0_0_30px_-5px_rgba(201,167,77,0.3)] transition-all flex items-center gap-2">
            <Plus size={20} />
            <span>ADD NEW LISTING</span>
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-3xl rounded-[2.5rem] overflow-hidden p-8 max-w-6xl mx-auto backdrop-blur-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Inventory Overview</h2>
            <p className="text-sm text-muted-foreground">Manage your luxury real estate listings</p>
          </div>
        </div>
        <PropertyTable 
          properties={properties} 
          loading={loading} 
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
