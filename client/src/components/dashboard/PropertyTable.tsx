'use client';

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
import { Property } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Trash2, Home, Ruler, BedDouble, Sparkles, PencilLine } from 'lucide-react';

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
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 lg:h-20 w-full rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 lg:py-20 bg-white/5 rounded-xl lg:rounded-[2rem] border border-dashed border-white/10">
        <Home className="mx-auto text-muted-foreground mb-4 opacity-20 lg:w-12 lg:h-12" size={36} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs lg:text-sm">No properties found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl lg:rounded-2xl border border-white/5 overflow-hidden min-w-[600px]">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-14 px-4">Property</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-14 hidden sm:table-cell">Features</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-14 text-center hidden md:table-cell">Price</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-14 text-center">Status</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-14 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id} className="border-white/5 hover:bg-white/2 transition-colors">
              <TableCell className="py-4 lg:py-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 lg:w-16 h-10 lg:h-12 rounded-lg lg:rounded-xl overflow-hidden border border-white/10 relative flex-shrink-0">
                    {property.images?.[0] ? (
                      <Image 
                        src={property.images[0]} 
                        alt="" 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Home className="text-muted-foreground w-3 h-3 lg:w-4 lg:h-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-black tracking-tight leading-none mb-1 text-sm truncate max-w-[150px] lg:max-w-none">{property.title}</p>
                    <div className="flex items-center gap-1 lg:gap-2 text-muted-foreground text-[9px] lg:text-[10px] font-bold uppercase tracking-wider">
                      <span>{property.city}</span>
                      <span className="hidden lg:inline w-1 h-1 bg-white/20 rounded-full" />
                      <span className="hidden lg:inline">{property.location}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="space-y-1 lg:space-y-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] lg:text-[9px] font-black uppercase rounded-md px-1.5 py-0.5">{property.type}</Badge>
                  <div className="flex gap-2 lg:gap-3 text-[9px] lg:text-[10px] text-muted-foreground font-bold">
                    <span className="flex items-center gap-1"><BedDouble size={10} className="text-white/40" /> {property.bhk}</span>
                    <span className="flex items-center gap-1 hidden sm:inline"><Ruler size={10} className="text-white/40" /> {property.size}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <p className="text-white font-black tracking-tight text-sm">৳{property.price.toLocaleString()}</p>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`rounded-full px-2 lg:px-4 py-0.5 text-[8px] lg:text-[9px] font-black uppercase tracking-wider border-0 ${
                    property.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : property.status === 'BOOKED'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 lg:gap-2">
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl hover:bg-white/10 hover:text-primary transition-all">
                      <Eye size={14} className="lg:w-[18px] lg:h-[18px]" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/agent/edit-property/${property.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-secondary-foreground transition-all">
                      <PencilLine size={14} className="lg:w-[18px] lg:h-[18px]" />
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                      onClick={() => onDelete(property.id)}
                    >
                      <Trash2 size={14} className="lg:w-[18px] lg:h-[18px]" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}