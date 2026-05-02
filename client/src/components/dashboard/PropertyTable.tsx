'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import Link from 'next/link';

interface PropertyTableProps {
  properties: Property[];
  loading: boolean;
  onDelete?: (id: string) => void;
}

export default function PropertyTable({
  properties,
  loading,
  onDelete,
}: PropertyTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">{property.title}</TableCell>
            <TableCell>৳{property.price.toLocaleString()}</TableCell>
            <TableCell>
              <Badge
                className={
                  property.status === 'AVAILABLE'
                    ? 'bg-green-500'
                    : property.status === 'BOOKED'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }
              >
                {property.status}
              </Badge>
            </TableCell>
            <TableCell>{property.agent.name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/properties/${property.id}`}>
                  <button className="px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors">
                    View
                  </button>
                </Link>
                {onDelete && (
                  <button 
                    className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium transition-colors"
                    onClick={() => onDelete(property.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
