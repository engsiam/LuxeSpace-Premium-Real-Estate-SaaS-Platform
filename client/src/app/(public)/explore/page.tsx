'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'];
const propertyTypes = ['Luxury Apartment', 'Penthouse', 'Commercial Space', 'Villa'];
const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('searchTerm', debouncedSearch);
      if (city) params.set('city', city);
      if (type) params.set('type', type);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (sortBy) params.set('sortBy', sortBy);
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      const response = await axiosInstance.get(`/properties?${params.toString()}`);
      setProperties(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [debouncedSearch, city, type, minPrice, maxPrice, sortBy, currentPage]);

  const clearFilters = () => {
    setSearchTerm('');
    setCity('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setCurrentPage(1);
  };

  const activeFiltersCount = [city, type, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="bg-background min-h-screen pt-24 pb-12">
      {/* Search & Header Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Marketplace</span>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Explore <span className="text-primary italic">Signature</span> Properties</h1>
            <p className="text-muted-foreground font-medium max-w-xl">
              Discover the most prestigious real estate listings across Bangladesh, curated for those who demand excellence.
            </p>
          </div>
        </div>

        {/* Premium Search Bar */}
        <div className="bg-card p-4 rounded-3xl border border-border shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
            <Input
              placeholder="Search by location, neighborhood, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 bg-secondary border-border rounded-2xl pl-14 pr-6 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-base w-full"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-16 px-6 rounded-2xl border-border flex items-center gap-3 font-bold transition-all ${showFilters ? 'bg-primary text-secondary border-primary' : 'text-foreground hover:bg-muted'}`}
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <Select value={sortBy} onValueChange={(val) => setSortBy(val || '')}>
              <SelectTrigger className="h-16 px-6 rounded-2xl border-border bg-card text-foreground font-bold w-full md:w-56 focus:ring-primary/30">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-primary/10 text-foreground cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 mb-12 overflow-hidden"
          >
            <div className="bg-card p-8 rounded-3xl border border-border grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="text-muted-foreground font-black uppercase tracking-widest text-xs ml-1">City</label>
                <Select value={city} onValueChange={(val: string | null) => setCity(val || '')}>
                   <SelectTrigger className="h-14 bg-secondary border-border rounded-xl text-foreground">
                     <SelectValue placeholder="All Cities" />
                   </SelectTrigger>
                   <SelectContent className="bg-card border-border">
                     {cities.map((c) => (
                       <SelectItem key={c} value={c} className="text-foreground focus:bg-primary/10">{c}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>

              <div className="space-y-3">
                <label className="text-muted-foreground font-black uppercase tracking-widest text-xs ml-1">Property Type</label>
                <Select value={type} onValueChange={(val: string | null) => setType(val || '')}>
                   <SelectTrigger className="h-14 bg-secondary border-border rounded-xl text-foreground">
                     <SelectValue placeholder="All Types" />
                   </SelectTrigger>
                   <SelectContent className="bg-card border-border">
                     {propertyTypes.map((t) => (
                       <SelectItem key={t} value={t} className="text-foreground focus:bg-primary/10">{t}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>

              <div className="space-y-3">
                <label className="text-muted-foreground font-black uppercase tracking-widest text-xs ml-1">Min Price (BDT)</label>
                <Input
                  placeholder="Min Price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-14 bg-secondary border-border rounded-xl text-foreground px-4 font-bold"
                />
              </div>

              <div className="space-y-3">
                <label className="text-muted-foreground font-black uppercase tracking-widest text-xs ml-1">Max Price (BDT)</label>
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-14 bg-secondary border-border rounded-xl text-foreground px-4 font-bold"
                />
              </div>

              <div className="md:col-span-4 flex justify-end pt-4 gap-4">
                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground font-bold">
                  Clear All Filters
                </Button>
                <Button onClick={() => setShowFilters(false)} className="bg-primary text-secondary font-black px-8 rounded-xl">
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl bg-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-32 space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Search size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-foreground">No Properties Found</h3>
                  <p className="text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
                </div>
                <Button onClick={clearFilters} className="bg-primary text-secondary font-black px-10 h-14 rounded-2xl">
                  Clear All Filters
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-14 px-6 rounded-2xl border-border text-foreground hover:bg-muted disabled:opacity-30"
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className={`w-14 h-14 rounded-2xl font-black transition-all ${currentPage === page ? 'bg-primary text-secondary scale-110 shadow-xl shadow-primary/20' : 'border-border text-foreground hover:bg-muted'}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-14 px-6 rounded-2xl border-border text-foreground hover:bg-muted disabled:opacity-30"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8 bg-card" />
          <Skeleton className="h-20 w-full mb-12 rounded-2xl bg-card" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl bg-card" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
