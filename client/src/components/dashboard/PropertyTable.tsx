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
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
        <Home className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-sm">No properties found in your portfolio</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14">Property Details</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14">Type & Features</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14 text-center">Price</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14 text-center">Status</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-14 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id} className="border-white/5 hover:bg-white/2 transition-colors">
              <TableCell className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-xl overflow-hidden border border-white/10 relative flex-shrink-0">
                    {property.images?.[0] ? (
                      <Image 
                        src={property.images[0]} 
                        alt="" 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Home className="text-muted-foreground h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-black tracking-tight leading-none mb-1.5">{property.title}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <span>{property.city}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase rounded-md">{property.type}</Badge>
                  <div className="flex gap-3 text-[10px] text-muted-foreground font-bold">
                    <span className="flex items-center gap-1.5"><BedDouble size={12} className="text-white/40" /> {property.bhk} BHK</span>
                    <span className="flex items-center gap-1.5"><Ruler size={12} className="text-white/40" /> {property.size} sqft</span>
                    {property.amenities && property.amenities.length > 0 && (
                      <span className="flex items-center gap-1.5 text-primary"><Sparkles size={12} /> {property.amenities.length} Features</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <p className="text-white font-black tracking-tight">৳{property.price.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Total Valuation</p>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border-0 ${
                    property.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]'
                      : property.status === 'BOOKED'
                      ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]'
                      : 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/10 hover:text-primary transition-all">
                      <Eye size={18} />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/agent/edit-property/${property.id}`}>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-secondary-foreground transition-all">
                      <PencilLine size={18} />
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                      onClick={() => onDelete(property.id)}
                    >
                      <Trash2 size={18} />
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
