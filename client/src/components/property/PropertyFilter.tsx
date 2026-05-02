'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PropertyFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
}

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'];
const propertyTypes = ['Luxury Apartment', 'Penthouse', 'Commercial Space', 'Villa'];

export default function PropertyFilter({
  searchTerm,
  onSearchChange,
  city,
  onCityChange,
  type,
  onTypeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: PropertyFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
      <Input
        placeholder="Search properties..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md::col-span-2"
      />

      <Select value={city} onValueChange={(val) => onCityChange(val || '')}>
        <SelectTrigger>
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Cities</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(val) => onTypeChange(val || '')}>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          {propertyTypes.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Min Price"
        type="number"
        value={minPrice}
        onChange={(e) => onMinPriceChange(e.target.value)}
      />

      <Input
        placeholder="Max Price"
        type="number"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(e.target.value)}
      />
    </div>
  );
}
