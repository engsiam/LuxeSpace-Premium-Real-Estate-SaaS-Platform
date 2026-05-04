'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon, LayoutDashboard, Globe } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const { user: storedUser } = useUserStore();

  if (!session) return null;

  const userInitial = session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';
  const userImage = storedUser?.avatar || session.user?.avatar || '';

  const getDashboardLink = () => {
    const role = session.user?.role || 'USER';
    if (role === 'ADMIN') return '/dashboard/admin';
    if (role === 'AGENT') return '/dashboard/agent';
    return '/dashboard/user';
  };

  return (
    <div className="absolute top-4 right-4 lg:top-6 lg:right-10 z-50 flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
          <Avatar className="h-full w-full rounded-full border-2 border-background shadow-lg">
            <AvatarImage src={userImage} alt={session.user?.name || 'User'} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-black text-sm lg:text-lg">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 lg:w-56 bg-card border-border/50 shadow-2xl rounded-2xl mt-2" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-3 lg:p-4 border-b border-border/50 bg-background/30">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-black text-white leading-none tracking-tight">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground font-medium truncate">{session.user?.email}</p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem 
            className="p-3 cursor-pointer rounded-xl m-1 transition-colors font-bold"
            onClick={() => router.push(`${getDashboardLink()}/profile`)}
          >
            <UserIcon className="mr-3 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="p-3 cursor-pointer rounded-xl m-1 transition-colors font-bold"
            onClick={() => router.push(getDashboardLink())}
          >
            <LayoutDashboard className="mr-3 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="p-3 cursor-pointer rounded-xl m-1 transition-colors font-bold"
            onClick={() => router.push('/')}
          >
            <Globe className="mr-3 h-4 w-4" />
            <span>View Site</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem 
            className="p-3 text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer rounded-xl m-1 transition-colors font-bold"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}