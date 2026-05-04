import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import PropertyTableWrapper from '@/components/dashboard/PropertyTableWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminProperties() {
  let properties = [];
  let error = null;

  try {
    const response = await axiosInstance.get('/properties?limit=100');
    properties = response.data.data || [];
  } catch (err) {
    error = 'Failed to fetch properties';
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 lg:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Property Management</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">Manage <span className="text-primary italic">Properties</span></h1>
        </div>
        <Link href="/dashboard/agent/add-property">
          <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold text-sm lg:text-base">
            <Plus size={18} className="mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-4 lg:p-8">
        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white">All Properties</h2>
            <p className="text-sm text-muted-foreground">{properties.length} properties found</p>
          </div>
        </div>
        <PropertyTableWrapper properties={properties} />
      </div>
    </div>
  );
}
