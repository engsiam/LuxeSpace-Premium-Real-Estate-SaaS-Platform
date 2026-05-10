'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/useDashboardStore';
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
  ChevronRight,
  Wallet,
  X,
  Menu
} from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  role: string;
  onLogout: () => void;
}

export default function DashboardSidebar({ role, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useDashboardStore();

  const adminItems: SidebarItem[] = [
    { href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { href: '/dashboard/admin/properties', label: 'Manage Estates', icon: <Building2 size={20} /> },
    { href: '/dashboard/admin/users', label: 'Elite Network', icon: <Users size={20} /> },
    { href: '/dashboard/admin/bookings', label: 'Transactions', icon: <Calendar size={20} /> },
    { href: '/dashboard/admin/blogs', label: 'Journal Manager', icon: <FileText size={20} /> },
    { href: '/dashboard/admin/transactions', label: 'Financial Audit', icon: <Wallet size={20} /> },
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
    { href: '/dashboard/user/transactions', label: 'Transactions', icon: <Wallet size={20} /> },
    { href: '/dashboard/user/wishlist', label: 'Collection', icon: <Heart size={20} /> },
    { href: '/dashboard/user/profile', label: 'Identity', icon: <UserCircle size={20} /> },
  ];

  const items = role === 'ADMIN' ? adminItems : role === 'AGENT' ? agentItems : userItems;

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const SidebarContent = () => (
    <>
      {/* <div className="p-4 lg:p-6 mb-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(201,167,77,0.4)] transition-transform group-hover:rotate-12 duration-500">
            <Globe className="text-secondary-foreground w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              LUXE<span className="text-primary">SPACE</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-1 opacity-80">
              Concierge
            </span>
          </div>
        </Link>
      </div> */}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 border-b border-border/50 pb-2">
            {role} Hub
          </p>
        </div>
        
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-between h-12 px-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary text-secondary-foreground shadow-[0_15px_30px_-5px_rgba(201,167,77,0.2)] font-black' 
                    : 'hover:bg-primary/10 hover:text-primary font-bold text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-secondary-foreground' : 'text-primary/60 group-hover:text-primary'} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="tracking-tight text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto bg-background/10">
        <button
          onClick={() => {
            onLogout();
            setMobileMenuOpen(false);
          }}
          className="w-full flex items-center gap-3 h-12 px-4 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-500 font-black transition-all group"
        >
          <div className="p-2 bg-red-500/10 rounded-lg group-hover:scale-110 transition-transform">
            <LogOut size={18} />
          </div>
          <span className="text-sm tracking-tight uppercase">Log Out</span>
        </button>
      
        <div className="mt-4 flex items-center justify-center gap-2 grayscale opacity-40">
          <Globe size={12} className="text-white" />
          <span className="text-xs font-black uppercase tracking-widest text-white">
            LuxeSpace v2.0
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button - Fixed Position */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-card/95 backdrop-blur-md border border-border rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-primary hover:text-secondary-foreground transition-all"
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[280px] h-full bg-card/98 backdrop-blur-3xl border-r border-border flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Globe className="text-secondary-foreground w-4 h-4" />
                  </div>
                  <span className="text-lg font-black tracking-tighter text-white">
                    LUXE<span className="text-primary">SPACE</span>
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-white">
                  <X size={20} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-80 bg-card/50 backdrop-blur-3xl border-r border-border h-screen sticky top-0 flex-col z-50 shadow-2xl">
        <SidebarContent />
      </aside>
    </>
  );
}