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
import { User } from '@/types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEditRole?: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

export default function UserTable({
  users,
  loading,
  onEditRole,
  onDeactivate,
}: UserTableProps) {
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
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                className={
                  user.role === 'ADMIN'
                    ? 'bg-red-500'
                    : user.role === 'AGENT'
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {onEditRole && (
                  <button 
                    className="px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors"
                    onClick={() => onEditRole(user.id)}
                  >
                    Edit Role
                  </button>
                )}
                {onDeactivate && (
                  <button 
                    className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium transition-colors"
                    onClick={() => onDeactivate(user.id)}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
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
