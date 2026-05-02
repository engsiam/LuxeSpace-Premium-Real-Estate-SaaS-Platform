'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  PlusCircle,
  Heart,
  UserCircle,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import type { User } from '@/types';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const adminItems: SidebarItem[] = [
    { href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { href: '/dashboard/admin/properties', label: 'Manage Estates', icon: <Building2 size={20} /> },
    { href: '/dashboard/admin/users', label: 'Elite Network', icon: <Users size={20} /> },
    { href: '/dashboard/admin/bookings', label: 'Transactions', icon: <Calendar size={20} /> },
    { href: '/dashboard/admin/blogs', label: 'Journal Manager', icon: <FileText size={20} /> },
    { href: '/dashboard/admin/messages', label: 'Inquiries', icon: <MessageSquare size={20} /> },
    { href: '/dashboard/admin/settings', label: 'Global Config', icon: <Settings size={20} /> },
  ];

  const agentItems: SidebarItem[] = [
    { href: '/dashboard/agent', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { href: '/dashboard/agent/my-properties', label: 'My Portfolio', icon: <Building2 size={20} /> },
    { href: '/dashboard/agent/add-property', label: 'Add Residence', icon: <PlusCircle size={20} /> },
    { href: '/dashboard/agent/profile', label: 'Identity', icon: <UserCircle size={20} /> },
  ];

  const userItems: SidebarItem[] = [
    { href: '/dashboard/user', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { href: '/dashboard/user/my-bookings', label: 'My Sanctuary', icon: <Calendar size={20} /> },
    { href: '/dashboard/user/wishlist', label: 'Collection', icon: <Heart size={20} /> },
    { href: '/dashboard/user/profile', label: 'Identity', icon: <UserCircle size={20} /> },
  ];

  const items = role === 'ADMIN' ? adminItems : role === 'AGENT' ? agentItems : userItems;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    signOut({ callbackUrl: '/' });
  };

  return (
    <aside className="w-80 bg-card/50 backdrop-blur-3xl border-r border-border h-screen sticky top-0 flex flex-col z-50 shadow-2xl">
      {/* Brand Header */}
      <div className="p-10 mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(201,167,77,0.4)] transition-transform group-hover:rotate-12 duration-500">
            <Globe className="text-secondary-foreground w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white leading-none">
              LUXE<span className="text-primary">SPACE</span>
            </span>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-primary mt-1 opacity-80">
              Concierge Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar" data-lenis-prevent>
        <div className="px-4 mb-6">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/40 border-b border-border/50 pb-2">
            {role} Interface
          </p>
        </div>
        
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-between h-14 px-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-primary text-secondary-foreground shadow-[0_15px_30px_-5px_rgba(201,167,77,0.2)] font-black' 
                      : 'hover:bg-primary/10 hover:text-primary font-bold text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`${isActive ? 'text-secondary-foreground' : 'text-primary/60 group-hover:text-primary'} transition-colors`}>
                      {item.icon}
                    </div>
                    <span className="tracking-tight text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="relative z-10" />}
                  
                  {/* Active highlight bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeBar"
                      className="absolute left-0 top-0 w-1 h-full bg-background"
                    />
                  )}
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-8 border-t border-border mt-auto bg-background/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 h-14 px-6 rounded-2xl text-red-500 hover:bg-red-500/10 hover:text-red-500 font-black transition-all group"
        >
          <div className="p-2 bg-red-500/10 rounded-lg group-hover:scale-110 transition-transform">
            <LogOut size={20} />
          </div>
          <span className="text-sm tracking-tight uppercase">Term Session</span>
        </button>
      
        <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-40">
          <Globe size={12} className="text-white" />
          <span className="text-xs font-black uppercase tracking-widest text-white">
            LuxeSpace v2.0
          </span>
        </div>
      </div>
    </aside>
  );
}
