'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PropertyTableWrapper from '@/components/dashboard/PropertyTableWrapper';
import { Plus, Building2, Search } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : '';
      const response = await axiosInstance.get(`/properties${query}`);
      const data = response.data.data;
      
      console.log('Admin Properties Response:', data);
      
      if (data && data.data) {
        setProperties(data.data);
      } else if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 lg:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Property Management</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">Manage <span className="text-primary italic">Properties</span></h1>
        </div>
        <Button 
          onClick={() => fetchProperties()}
          className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold"
        >
          <Plus size={18} className="mr-2" />
          Add Property
        </Button>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">All Properties</h2>
              <p className="text-sm text-muted-foreground">{properties.length} properties</p>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 bg-background border border-border rounded-xl text-white text-sm w-56"
              />
            </div>
            <Button type="submit" variant="outline" className="h-10 rounded-xl">
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Building2 className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-sm">
              No properties found
            </p>
          </div>
        ) : (
          <PropertyTableWrapper properties={properties} />
        )}
      </div>
    </div>
  );
}