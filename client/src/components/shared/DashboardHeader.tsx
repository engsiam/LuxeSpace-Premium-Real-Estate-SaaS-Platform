'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuthStore, useIsHydrated } from '@/store/useAuthStore';

export default function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const isHydrated = useIsHydrated();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userImage = user.avatar || '';

  const getDashboardLink = () => {
    const role = user?.role || 'USER';
    if (role === 'ADMIN') return '/dashboard/admin';
    if (role === 'AGENT') return '/dashboard/agent';
    return '/dashboard/user';
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex-1">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-primary text-secondary-foreground font-black text-xs">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-bold leading-none">{user?.name?.split(' ')[0]}</span>
                <span className="text-[10px] text-muted-foreground leading-none capitalize">{user?.role}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <p className="text-sm font-bold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`${getDashboardLink()}/profile`)}>
                  <UserIcon size={16} />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-rose-500 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}