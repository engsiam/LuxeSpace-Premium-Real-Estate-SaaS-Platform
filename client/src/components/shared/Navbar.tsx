'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, User, LogOut, LayoutDashboard, Globe, X, ChevronRight, Sparkles, Settings, Home, Bot } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
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
import { useChatStore } from '@/store/useChatStore';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoggedIn = status === 'authenticated';
  const userRole = session?.user?.role || 'USER';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/dashboard/admin';
    if (userRole === 'AGENT') return '/dashboard/agent';
    return '/dashboard/user';
  };

  const { toggleChat } = useChatStore();

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        scrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border/50 py-2' 
          : 'bg-transparent py-3'
      )}
    >
      <div className="max-w-7xl mx-auto px-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 group shrink-0 z-50">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <Globe className="text-secondary-foreground w-4 h-4" />
          </div>
          <span className={cn('text-lg font-black tracking-tighter', scrolled ? 'text-foreground' : 'text-white')}>
            LUXE<span className="text-primary">SPACE</span>
          </span>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors relative group px-3',
                scrolled ? 'text-foreground' : 'text-white'
              )}
            >
              {link.label}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={toggleChat}
            className={cn(
              'hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border transition-all group relative overflow-hidden shrink-0',
              scrolled 
                ? 'bg-primary border-primary text-secondary-foreground hover:bg-primary/90' 
                : 'bg-primary/20 border-primary/40 text-white hover:bg-primary/30'
            )}
          >
            <Bot size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Ask AI</span>
            <div className="hidden lg:flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded-md text-[8px] border border-white/10 group-hover:bg-white/20 transition-colors ml-1">
              <span className="opacity-60">CTRL</span>
              <span className="font-black text-white">K</span>
            </div>
          </button>

          <div className={cn('p-0.5 rounded-full border transition-colors', scrolled ? 'border-border bg-card/50' : 'border-white/10 bg-white/5')}>
            <ThemeToggle />
          </div>
         
          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src={session?.user?.avatar || session?.user?.image || ''} />
                      <AvatarFallback className="bg-primary text-secondary-foreground font-black">
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className={cn('text-xs font-black tracking-tight leading-none mb-1', scrolled ? 'text-foreground' : 'text-white')}>
                        {session?.user?.name?.split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">
                        {userRole}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-4 p-3 bg-card border-border rounded-[1.5rem] shadow-3xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-4 py-3">
                      <p className="text-sm font-black text-foreground">{session?.user?.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{session?.user?.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
                    <LayoutDashboard size={18} />
                    <span className="font-bold text-sm">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`${getDashboardLink()}/profile`)}>
                    <User size={18} />
                    <span className="font-bold text-sm">My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="font-bold text-sm">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <button className={cn('text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors', scrolled ? 'text-foreground' : 'text-white')}>
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <Button className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'lg:hidden rounded-md border transition-colors p-1.5 z-50',
              scrolled ? 'text-foreground border-border' : 'text-white border-white/10'
            )}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 z-[90] bg-card border-b border-border shadow-xl overflow-y-auto max-h-[calc(100vh-60px)]"
          >
            <div className="p-3 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-background/30 border border-border/50 group hover:bg-primary hover:border-primary transition-all"
                  >
                    <span className="text-base font-bold group-hover:text-secondary-foreground">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}

              <div className="pt-2 border-t border-border/50">
                {status === 'loading' ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : !isLoggedIn ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full h-10 rounded-lg font-bold text-xs uppercase">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full h-10 rounded-lg font-bold text-xs uppercase">
                        Join Now
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full h-10 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2">
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        toggleChat();
                      }}
                      className="w-full h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-xs uppercase flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      <span>Ask AI</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => signOut()}
                      className="w-full h-10 rounded-lg font-bold text-xs uppercase text-rose-500 border-rose-500/20"
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Loader2({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
