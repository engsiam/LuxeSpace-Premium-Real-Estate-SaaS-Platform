'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PropertyTableWrapper from '@/components/dashboard/PropertyTableWrapper';
import { Pagination } from '@/components/ui/pagination';
import { Plus, Building2, Search, RefreshCw } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 10;

export default function AdminProperties() {
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
    } catch {
      toast.error('Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProperties(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Property Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white">Manage <span className="text-primary italic">Properties</span></h1>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button onClick={() => fetchProperties(currentPage)} variant="outline" className="h-10 lg:h-12 rounded-xl border-white/10 text-white hover:bg-white/10">
            <RefreshCw size={16} className="mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button className="h-10 lg:h-12 rounded-xl font-bold flex-1 lg:flex-none">
            <Plus size={16} className="mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-xl lg:rounded-2xl p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 lg:w-12 h-10 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Building2 size={20} className="lg:w-6 lg:h-6" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-white">All Properties</h2>
              <p className="text-xs lg:text-sm text-muted-foreground">{loading ? 'Loading...' : `${totalItems} properties (Page ${currentPage} of ${totalPages})`}</p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 pr-4 bg-background border-white/10 rounded-xl text-white text-sm w-full sm:w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 lg:h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 lg:py-20 bg-white/5 rounded-xl lg:rounded-2xl border border-dashed border-white/10">
              <Building2 className="mx-auto text-muted-foreground mb-4 opacity-20" size={36} />
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs lg:text-sm">No properties found</p>
            </div>
          ) : (
            <PropertyTableWrapper properties={properties} />
          )}
        </div>
        
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