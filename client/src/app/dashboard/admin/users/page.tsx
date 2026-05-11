'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/dashboard/UserTable';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types';
import { toast } from 'sonner';
import { Users, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = response.data.data;
      const meta = response.data.meta;
      
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(meta?.totalPages || 1);
        setTotalItems(meta?.total || data.length);
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      setError(null);
    } catch {
      setError('Failed to synchronize user directory');
      toast.error('Directory synchronization failed');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditRole = async (id: string) => {
    const newRole = prompt('Assign new Privilege Level (ADMIN, AGENT, USER):')?.toUpperCase();
    if (!newRole || !['ADMIN', 'AGENT', 'USER'].includes(newRole)) {
      if (newRole) toast.error('Invalid role assignment');
      return;
    }

    try {
      await axiosInstance.patch(`/users/${id}`, { role: newRole });
      toast.success(`User elevated to ${newRole} status`);
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole as any } : u)));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authorization update failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    try {
      await axiosInstance.patch(`/users/${id}`, {
        isActive: !user.isActive
      });
      setUsers(users.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      ));
      toast.success(user.isActive ? 'Account restricted' : 'Account access restored');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Status modification failed');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-10 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 bg-card border border-rose-500/20 p-8 md:p-16 rounded-2xl lg:rounded-[3rem] backdrop-blur-3xl">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-rose-500" />
          </div>
          <p className="text-rose-500 font-black uppercase tracking-widest text-xs">{error}</p>
          <Button onClick={() => fetchUsers(currentPage)} variant="outline" className="rounded-xl lg:rounded-2xl border-white/10 text-white px-6 lg:px-10 py-3 lg:h-14 font-black uppercase tracking-widest text-xs">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-12 bg-background min-h-screen pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-8 w-full">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Governance Console</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white leading-none">
            User <span className="text-primary italic">Directory</span>
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-[0_0_280px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
            <Input 
              placeholder="Search..." 
              className="h-12 pl-12 bg-card border-white/5 rounded-xl lg:rounded-2xl text-white placeholder:text-white/20 focus:border-primary transition-all shadow-xl text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      <div className="w-full">
        <div className="bg-card/40 backdrop-blur-3xl border border-white/5 shadow-3xl rounded-xl lg:rounded-[2.5rem] overflow-hidden p-4 md:p-6 lg:p-8 relative">
          <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-10">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <Users size={24} className="lg:w-8 lg:h-8" />
              </div>
              <div>
                <h2 className="text-lg lg:text-2xl font-black text-white tracking-tight">Active Accounts</h2>
                <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold">
                  {loading ? 'Analyzing...' : `${totalItems} identities (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>
            </div>
            
            {loading && (
              <div className="flex items-center gap-3 bg-white/5 px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-white/10">
                <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 text-primary animate-spin" />
                <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white/60">Syncing</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <UserTable
              users={filteredUsers}
              loading={loading}
              onEditRole={handleEditRole}
              onDeactivate={handleToggleStatus}
            />
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
    </div>
  );
}