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
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 lg:h-20 w-full rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl lg:rounded-[2rem] border border-white/5 overflow-hidden bg-background/30 backdrop-blur-md min-w-[600px]">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-16 pl-4 lg:pl-8">Identity</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-16 hidden sm:table-cell">Contact</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-16">Privilege</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-16 text-center">Status</TableHead>
            <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 lg:h-16 text-right pr-4 lg:pr-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/5 hover:bg-white/2 transition-all group">
              <TableCell className="py-4 lg:py-6 pl-4 lg:pl-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-lg lg:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black group-hover:scale-110 transition-transform text-sm lg:text-base">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-black tracking-tight leading-none mb-1 text-sm lg:text-base">{user.name}</p>
                    <div className="hidden lg:flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={10} className="text-primary/40" />
                      <span>Joined {new Date(user.createdAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-2 text-white/70 font-medium text-sm">
                  <Mail size={12} className="text-primary/40" />
                  <span className="truncate max-w-[150px]">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`px-2 lg:px-3 py-1 rounded-lg text-[9px] lg:text-xs font-black uppercase tracking-wider border-2 ${
                    user.role === 'ADMIN' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                      : user.role === 'AGENT'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`rounded-full px-2 lg:px-4 py-1 text-[9px] lg:text-xs font-black uppercase tracking-wider border-0 ${
                    user.isActive
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {user.isActive ? 'Active' : 'Deactivated'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl hover:bg-white/10 transition-all">
                      <MoreVertical size={14} className="lg:w-[18px] lg:h-[18px] text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 lg:w-56 bg-card border-border rounded-xl lg:rounded-2xl p-1.5 lg:p-2 shadow-2xl">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Controls</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem 
                        onClick={() => onEditRole(user.id)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all text-sm"
                      >
                        <UserCog size={16} />
                        <span className="font-bold">Modify Role</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeactivate(user.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
                          user.isActive 
                            ? 'hover:bg-rose-500/10 hover:text-rose-500' 
                            : 'hover:bg-emerald-500/10 hover:text-emerald-500'
                        }`}
                      >
                        {user.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                        <span className="font-bold">{user.isActive ? 'Deactivate' : 'Reactivate'}</span>
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