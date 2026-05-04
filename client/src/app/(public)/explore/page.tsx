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
import { Search, SlidersHorizontal, X, Funnel, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cities = ['All Cities', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'];
const propertyTypes = ['All Types', 'Luxury Apartment', 'Penthouse', 'Commercial Space', 'Villa'];
const sortOptions = [
  { value: '', label: 'Sort By' },
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`/properties?searchTerm=${encodeURIComponent(debouncedSearch)}&limit=5&fields=title,city`);
        const props: Array<{title: string; city: string}> = response.data.data || [];
        const titles = props.map(p => p.title);
        const cities = props.map(p => p.city);
        const uniqueSuggestions = [...new Set([...titles, ...cities])].slice(0, 6);
        setSuggestions(uniqueSuggestions as string[]);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

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
    <div className="bg-background min-h-screen pt-20 pb-12">
      {/* Search & Header Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="space-y-4 mb-8">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Marketplace</span>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">Explore <span className="text-primary italic">Signature</span> Properties</h1>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xl">
            Discover the most prestigious real estate listings across Bangladesh.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-card p-3 rounded-2xl border border-border flex flex-col gap-3 relative">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
              <Input
                placeholder="Search by location, property name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-12 bg-secondary border-border rounded-xl pl-11 pr-10 text-foreground text-sm w-full"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter & Sort Buttons */}
            <div className="flex gap-2 flex-1 md:flex-none">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 flex-1 md:flex-none px-4 rounded-xl border-border flex items-center justify-center gap-2 text-sm font-bold ${showFilters ? 'bg-primary text-secondary border-primary' : 'text-foreground'}`}
              >
                <Funnel size={16} />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-secondary text-primary rounded-full flex items-center justify-center text-xs font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              <Select value={sortBy} onValueChange={(val) => setSortBy(val || '')}>
                <SelectTrigger className="h-12 px-4 rounded-xl border-border bg-card text-foreground text-sm font-bold w-full md:w-44">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-foreground focus:bg-primary/10 cursor-pointer h-12">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Live Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors"
                >
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span className="text-foreground text-sm font-medium truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Filters Tags */}
          {(city || type || minPrice || maxPrice) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
              {city && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setCity('')}>
                  {city}
                  <X size={12} />
                </span>
              )}
              {type && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setType('')}>
                  {type}
                  <X size={12} />
                </span>
              )}
              {minPrice && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setMinPrice('')}>
                  ৳{Number(minPrice).toLocaleString()}+
                  <X size={12} />
                </span>
              )}
              {maxPrice && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer" onClick={() => setMaxPrice('')}>
                  ৳{Number(maxPrice).toLocaleString()}
                  <X size={12} />
                </span>
              )}
              <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground text-xs font-bold hover:text-foreground h-auto py-1 px-2">
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 mb-8">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-7xl mx-4 mb-8"
            >
              <div className="bg-card p-5 rounded-2xl border border-border grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">City</label>
                  <Select value={city} onValueChange={(val: string | null) => setCity(val || '')}>
                    <SelectTrigger className="h-12 bg-secondary border-border rounded-xl text-foreground text-sm">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {cities.map((c) => (
                        <SelectItem key={c} value={c === 'All Cities' ? '' : c} className="text-foreground focus:bg-primary/10">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Type</label>
                  <Select value={type} onValueChange={(val: string | null) => setType(val || '')}>
                    <SelectTrigger className="h-12 bg-secondary border-border rounded-xl text-foreground text-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {propertyTypes.map((t) => (
                        <SelectItem key={t} value={t === 'All Types' ? '' : t} className="text-foreground focus:bg-primary/10">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Min Price</label>
                  <Input
                    placeholder="Min (BDT)"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl text-foreground px-4 font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1">Max Price</label>
                  <Input
                    placeholder="Max (BDT)"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl text-foreground px-4 font-bold text-sm"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl bg-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-10 px-4 rounded-xl border-border text-foreground hover:bg-muted disabled:opacity-30 text-sm font-bold"
                >
                  Prev
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm ${currentPage === page ? 'bg-primary text-secondary' : 'border-border text-foreground hover:bg-muted'}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-10 px-4 rounded-xl border-border text-foreground hover:bg-muted disabled:opacity-30 text-sm font-bold"
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
