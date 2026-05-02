import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useFilterURL() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setFilters(params);
  }, [searchParams]);

  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('');
  };

  return { filters, updateFilters, clearFilters };
}
