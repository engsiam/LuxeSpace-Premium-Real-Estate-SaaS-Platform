'use client';

import Link from 'next/link';
import { Button } from '@/design-system/components';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Menu, User, LogOut, LayoutDashboard, Globe, X, ChevronRight, Sparkles } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { data: session, status } = useSession();
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-2xl' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-[#C9A74D]/20 transition-transform group-hover:rotate-12">
            <Globe className="text-secondary-foreground w-6 h-6" />
          </div>
          <span className={cn('text-2xl font-black tracking-tighter transition-colors', scrolled ? 'text-foreground' : 'text-white')}>
            LUXE<span className="text-primary">SPACE</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors relative group',
                scrolled ? 'text-foreground' : 'text-white'
              )}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className={cn('p-1 rounded-full border transition-colors', scrolled ? 'border-border bg-card/50' : 'border-white/10 bg-white/5')}>
            <ThemeToggle />
          </div>
         
          {isLoggedIn ? (
            <div className="hidden lg:flex items-center gap-3">
              <button className="inline-flex items-center justify-center rounded-full bg-primary text-secondary-foreground shadow-lg shadow-[#C9A74D]/20 hover:scale-105 transition-all w-10 h-10">
                <User className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <span className={cn('text-sm font-bold', scrolled ? 'text-foreground' : 'text-white')}>
                  {session?.user?.name || 'Account'}
                </span>
                <button 
                  onClick={() => signOut()}
                  className="text-xs text-primary hover:text-foreground transition-colors text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex gap-3">
              <Link href="/login">
                <Button variant="ghost" className={cn('font-bold tracking-widest text-xs px-6', scrolled ? 'text-foreground' : 'text-white')}>
                  LOGIN
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl font-bold tracking-widest text-xs px-8">
                  REGISTER
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'lg:hidden rounded-xl border transition-colors p-2',
              scrolled ? 'text-foreground border-border' : 'text-white border-white/10'
            )}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-2xl">
          <div className="p-8 space-y-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-6 rounded-3xl bg-background/30 border border-border/50 group hover:bg-primary hover:border-primary transition-all duration-300"
                >
                  <span className="text-2xl font-black tracking-tight group-hover:text-secondary-foreground">{link.label}</span>
                  <ChevronRight className="text-primary group-hover:text-secondary-foreground group-hover:translate-x-2 transition-all" />
                </Link>
              </motion.div>
            ))}

            <div className="pt-6 border-t border-border/50">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-16 rounded-2xl font-bold tracking-widest text-xs">
                      LOGIN
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-16 rounded-2xl font-bold tracking-widest text-xs">
                      JOIN NOW
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-16 rounded-2xl font-bold tracking-widest text-xs flex items-center justify-center gap-3">
                    <LayoutDashboard size={20} />
                    <span>GO TO DASHBOARD</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
