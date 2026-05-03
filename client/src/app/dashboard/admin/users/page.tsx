'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/dashboard/UserTable';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types';
import { toast } from 'sonner';
import { Users, ShieldCheck, UserPlus, Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users');
      setUsers(response.data.data || []);
      setError(null);
    } catch (error) {
      setError('Failed to synchronize user directory');
      toast.error('Directory synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <div className="p-10 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 bg-card border border-rose-500/20 p-16 rounded-[3rem] backdrop-blur-3xl">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-rose-500" />
          </div>
          <p className="text-rose-500 font-black uppercase tracking-widest text-sm">{error}</p>
          <Button onClick={fetchUsers} variant="outline" className="rounded-2xl border-white/10 text-white px-10 h-14 font-black uppercase tracking-widest text-xs">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 bg-background min-h-screen pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 w-full">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Governance Console</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
            User <span className="text-primary italic">Directory</span>
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Search identity or digital address..." 
              className="h-14 pl-14 bg-card border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:border-primary transition-all shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-14 px-8 bg-primary text-secondary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Filter className="mr-2" size={18} />
            Filter
          </Button>
        </motion.div>
      </div>

      <div className="w-full">
        <div className="bg-card/40 backdrop-blur-3xl border border-white/5 shadow-3xl rounded-[2.5rem] overflow-hidden p-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <Users size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Active Accounts</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
                  {loading ? 'Analyzing...' : `${users.length} authenticated identities found`}
                </p>
              </div>
            </div>
            
            {loading && (
              <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Syncing Database</span>
              </div>
            )}
          </div>

          <UserTable
            users={filteredUsers}
            loading={loading}
            onEditRole={handleEditRole}
            onDeactivate={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
