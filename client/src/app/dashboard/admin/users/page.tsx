'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/dashboard/UserTable';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types';
import { toast } from 'sonner';
import { Users, ShieldCheck } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data.data || []);
        setError(null);
      } catch (error) {
        setError('Failed to fetch users');
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEditRole = async (id: string) => {
    const newRole = prompt('Enter new role (ADMIN, AGENT, USER):');
    if (!newRole) return;

    try {
      await axiosInstance.patch(`/users/${id}`, { role: newRole });
      toast.success('Role updated successfully');
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole as any } : u)));
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const user = users.find((u) => u.id === id);
      await axiosInstance.patch(`/users/${id}`, {
        isActive: !user?.isActive
      });
      setUsers(users.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

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
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">User Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Manage <span className="text-primary italic">Users</span></h1>
        </div>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Users</h2>
            <p className="text-sm text-muted-foreground">{users.length} users found</p>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-background" />
            ))}
          </div>
        ) : (
          <UserTable
            users={users}
            loading={false}
            onEditRole={handleEditRole}
            onDeactivate={handleToggleStatus}
          />
        )}
      </div>
    </div>
  );
}
