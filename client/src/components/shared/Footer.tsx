'use client';

import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-card text-foreground pt-24 pb-12 px-4 relative overflow-hidden border-t border-border/50">
      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Brand */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-[#C9A74D]/20 transition-transform group-hover:rotate-12">
              <Globe className="text-secondary-foreground w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground">
              LUXE<span className="text-primary">SPACE</span>
            </span>
          </Link>
          <p className="text-muted-foreground leading-relaxed font-medium text-lg">
            Redefining luxury living in Bangladesh. We provide a seamless, technology-driven experience for the elite real estate market.
          </p>
          <div className="flex gap-4">
            {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-secondary-foreground hover:border-primary] transition-all duration-300 shadow-sm">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:pl-8">
          <h3 className="text-xl font-black mb-10 relative inline-block text-foreground uppercase tracking-widest text-xs">
            Quick Links
            <span className="absolute -bottom-3 left-0 w-8 h-1 bg-primary rounded-full" />
          </h3>
          <ul className="space-y-5">
            {[
              { label: 'Home', href: '/' },
              { label: 'Explore Properties', href: '/explore' },
              { label: 'About Us', href: '/about' },
              { label: 'Latest Blogs', href: '/blog' },
              { label: 'Contact Us', href: '/contact' }
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-3 group font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Property Types */}
        <div className="lg:pl-8">
          <h3 className="text-xl font-black mb-10 relative inline-block text-foreground uppercase tracking-widest text-xs">
            Property Types
            <span className="absolute -bottom-3 left-0 w-8 h-1 bg-primary rounded-full" />
          </h3>
          <ul className="space-y-5">
            {[
              { label: 'Luxury Apartments', type: 'Luxury Apartment' },
              { label: 'Commercial Spaces', type: 'Commercial Space' },
              { label: 'Residential Villas', type: 'Villa' },
              { label: 'Premium Penthouses', type: 'Penthouse' }
            ].map((link) => (
              <li key={link.label}>
                <Link href={`/explore?type=${encodeURIComponent(link.type)}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-3 group font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Concierge Info */}
        <div className="lg:pl-8">
          <h3 className="text-xl font-black mb-10 relative inline-block text-foreground uppercase tracking-widest text-xs">
            Concierge Info
            <span className="absolute -bottom-3 left-0 w-8 h-1 bg-primary rounded-full" />
          </h3>
          <ul className="space-y-8">
            <li className="flex gap-5">
              <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0 text-primary shadow-sm">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Our HQ</p>
                <p className="text-foreground font-bold">Gulshan-2, Dhaka</p>
              </div>
            </li>
            <li className="flex gap-5">
              <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0 text-primary shadow-sm">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Direct Line</p>
                <p className="text-foreground font-bold">+880 123 456 789</p>
              </div>
            </li>
            <li className="flex gap-5">
              <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0 text-primary shadow-sm">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-foreground font-bold">info@luxespace.com</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-muted-foreground text-sm font-bold">
          © {new Date().getFullYear()} LUXESPACE. All rights reserved.
        </p>
        <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
