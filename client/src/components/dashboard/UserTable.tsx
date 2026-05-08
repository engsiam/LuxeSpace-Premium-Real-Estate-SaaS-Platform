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
import { User } from '@/types';
import { 
  ShieldCheck, 
  User as UserIcon, 
  ShieldAlert, 
  Power, 
  PowerOff, 
  Mail, 
  Calendar,
  MoreVertical,
  UserCog
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEditRole: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export default function UserTable({
  users,
  loading,
  onEditRole,
  onDeactivate,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/5 overflow-hidden bg-background/30 backdrop-blur-md">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-16 pl-8">Identity</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-16">Contact</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-16">Privilege</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-16 text-center">Account Status</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-16 text-right pr-8">Management</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/5 hover:bg-white/2 transition-all group">
              <TableCell className="py-6 pl-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black group-hover:scale-110 transition-transform">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-black tracking-tight leading-none mb-1.5">{user.name}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={12} className="text-primary/40" />
                      <span>Joined {new Date(user.createdAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-white/70 font-medium">
                  <Mail size={14} className="text-primary/40" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border-2 ${
                    user.role === 'ADMIN' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                      : user.role === 'AGENT'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}
                >
                  <span className="mr-1.5">
                    {user.role === 'ADMIN' ? '◈' : user.role === 'AGENT' ? '◇' : '○'}
                  </span>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-0 ${
                    user.isActive
                      ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {user.isActive ? 'Active' : 'Deactivated'}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-8">
                <DropdownMenu>
                  {/* @ts-expect-error - asChild prop for Slot component */}
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/10 transition-all">
                      <MoreVertical size={18} className="text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Controls</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem 
                        onClick={() => onEditRole(user.id)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <UserCog size={18} />
                        <span className="font-bold text-sm">Modify Role</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeactivate(user.id)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                          user.isActive 
                            ? 'hover:bg-rose-500/10 hover:text-rose-500' 
                            : 'hover:bg-emerald-500/10 hover:text-emerald-500'
                        }`}
                      >
                        {user.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                        <span className="font-bold text-sm">{user.isActive ? 'Deactivate Account' : 'Reactivate Account'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
