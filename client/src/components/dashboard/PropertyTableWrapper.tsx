'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PropertyTable from './PropertyTable';
import { Property } from '@/types';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';

interface PropertyTableWrapperProps {
  properties: Property[];
}

export default function PropertyTableWrapper({ properties }: PropertyTableWrapperProps) {
  const [propertyList, setPropertyList] = useState<Property[]>(properties);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await axiosInstance.delete(`/properties/${id}`);
      setPropertyList(propertyList.filter((p) => p.id !== id));
      toast.success('Property deleted successfully');
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <PropertyTable properties={propertyList} loading={false} onDelete={handleDelete} />
      </CardContent>
    </Card>
  );
}
