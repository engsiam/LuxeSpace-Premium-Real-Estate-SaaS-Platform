'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PropertyTable from '@/components/dashboard/PropertyTable';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { toast } from 'sonner';
import { Building2, Plus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function AgentProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const searchQuery = searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : '';
      const response = await axiosInstance.get(`/properties?page=${page}&limit=${ITEMS_PER_PAGE}${searchQuery}`);
      const data = response.data.data;
      const meta = response.data.meta;
      
      if (Array.isArray(data)) {
        setProperties(data);
        setTotalPages(meta?.totalPages || 1);
        setTotalItems(meta?.total || data.length);
      } else {
        setProperties([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProperties(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
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
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 lg:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Portfolio Control</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Properties</span></h1>
        </div>
        <Link href="/dashboard/agent/add-property">
          <Button className="h-12 lg:h-14 px-6 lg:px-8 bg-primary text-secondary-foreground hover:bg-white rounded-xl font-black shadow-lg transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>ADD NEW</span>
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Inventory</h2>
              <p className="text-sm text-muted-foreground">{loading ? 'Loading...' : `${totalItems} properties (Page ${currentPage} of ${totalPages})`}</p>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 bg-background border border-border rounded-xl text-white text-sm w-64"
              />
            </div>
            <Button type="submit" variant="outline" className="h-10 rounded-xl">
              Search
            </Button>
          </form>
        </div>
        
        {loading ? (
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 md:h-24 w-full rounded-xl lg:rounded-2xl" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Building2 className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-sm mb-4">
              No properties found
            </p>
            <Link href="/dashboard/agent/add-property">
              <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl">
                <Plus size={18} className="mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <PropertyTable 
              properties={properties} 
              loading={loading} 
              onDelete={handleDelete}
            />
          </div>
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
          totalItems={totalItems}
          limit={ITEMS_PER_PAGE}
          showLimitSelector={false}
        />
      </div>
    </div>
  );
}