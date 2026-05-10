'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Menu,
  LogOut,
  LayoutDashboard,
  Globe,
  X,
  ChevronRight,
  Sparkles,
  Building,
  User,
} from 'lucide-react';

import {
  useState,
  useEffect,
} from 'react';

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

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { useChatStore } from '@/store/useChatStore';

import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';

export default function Navbar() {

  const router = useRouter();

  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { logout, hydrate } = useAuthStore();

  const {
    toggleChat,
  } = useChatStore();

  // HYDRATION FIX
  const [mounted, setMounted] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
    hydrate();
  }, []);

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );

  }, []);

  // PREVENT HYDRATION MISMATCH
  if (!mounted) {
    return (
      <div className="h-[72px]" />
    );
  }

  const userRole =
    user?.role || 'USER';

  const avatarUrl =
    user?.avatar || '';

  const navLinks = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/explore',
      label: 'Explore',
    },
    {
      href: '/blog',
      label: 'Blog',
    },
    {
      href: '/about',
      label: 'About',
    },
    {
      href: '/contact',
      label: 'Contact',
    },
  ];

  const getDashboardLink = () => {

    if (userRole === 'ADMIN') {
      return '/dashboard/admin';
    }

    if (userRole === 'AGENT') {
      return '/dashboard/agent';
    }

    return '/dashboard/user';
  };

  const handleLogout = async () => {
    await logout();
    await hydrate();
    router.push('/login');
  };

  return (
    <nav
      suppressHydrationWarning
      className={cn(
        `
          fixed
          top-0
          left-0
          right-0
          z-[100]

          transition-all
          duration-300
        `,
        scrolled
          ? `
            bg-background/90
            backdrop-blur-md
            border-b
            border-border/50
            py-2
          `
          : `
            bg-transparent
            py-3
          `
      )}
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-2

          flex
          items-center
          justify-between
        "
      >

        {/* LOGO */}
        <Link
          href="/"
          className="
            flex
            items-center
            gap-1.5
            group
            shrink-0
            z-50
          "
        >

          <div
            className="
              w-8
              h-8
              bg-primary
              rounded-lg

              flex
              items-center
              justify-center

              shadow-md
            "
          >

            <Globe
              className="
                text-secondary-foreground
                w-4
                h-4
              "
            />
          </div>

          <span
            className={cn(
              `
                text-lg
                font-black
                tracking-tighter
              `,
              scrolled
                ? 'text-foreground'
                : 'text-white'
            )}
          >
            LUXE
            <span className="text-primary">
              SPACE
            </span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div
          className="
            hidden
            lg:flex
            items-center
            justify-center

            absolute
            left-1/2
            -translate-x-1/2
          "
        >

          {navLinks.map((link) => (

            <Link
              key={link.href}
              href={link.href}
              className={cn(
                `
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]

                  hover:text-primary
                  transition-colors

                  relative
                  group
                  px-3
                `,
                scrolled
                  ? 'text-foreground'
                  : 'text-white'
              )}
            >

              {link.label}

              <span
                className="
                  absolute
                  -bottom-1
                  left-1/2
                  -translate-x-1/2

                  w-0
                  h-0.5

                  bg-primary

                  transition-all
                  group-hover:w-full
                "
              />
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            flex
            items-center
            gap-2
            shrink-0
          "
        >

          {/* AI BUTTON */}
          <button
            onClick={toggleChat}
            className={cn(
              `
                hidden
                sm:flex

                items-center
                gap-2

                h-9
                px-3

                rounded-lg
                border

                transition-all
                group
                relative
                overflow-hidden
                shrink-0
              `,
              scrolled
                ? `
                  bg-primary
                  border-primary
                  text-secondary-foreground
                  hover:bg-primary/90
                `
                : `
                  bg-primary/20
                  border-primary/40
                  text-white
                  hover:bg-primary/30
                `
            )}
          >

            <Bot
              size={16}
              className="
                group-hover:rotate-12
                transition-transform
              "
            />

            <span
              className="
                hidden
                md:inline

                text-[10px]
                font-black
                uppercase
                tracking-widest
              "
            >
              Ask AI
            </span>
          </button>

          {/* THEME */}
          <div
            className={cn(
              `
                p-0.5
               
                transition-colors
              `,
              scrolled
                ? `
                  border-border
                  bg-card/50
                `
                : `
                  border-white/10
                  bg-white/5
                `
            )}
          >
            <ThemeToggle />
          </div>

          {/* DESKTOP AUTH */}
          <div
            className="
              hidden
              lg:flex
              items-center
              gap-4
            "
          >

            {isAuthenticated ? (

              <DropdownMenu>

                <DropdownMenuTrigger className="outline-none">

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      px-3
                      py-2

                      rounded-full

                      bg-white/5
                      border
                      border-white/10

                      hover:bg-white/10
                      transition-all

                      group
                      cursor-pointer
                    "
                  >

                    <Avatar
                      className="
                        w-10
                        h-10
                        border-2
                        border-primary/20
                      "
                    >

                      <AvatarImage
                        src={avatarUrl}
                      />

                      <AvatarFallback
                        className="
                          bg-primary
                          text-secondary-foreground
                          font-black
                        "
                      >
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className="
                        flex
                        flex-col
                        items-start
                      "
                    >

                      <span
                        className={cn(
                          `
                            text-xs
                            font-black
                            tracking-tight
                            leading-none
                            mb-1
                          `,
                          scrolled
                            ? 'text-foreground'
                            : 'text-white'
                        )}
                      >
                        {user?.name?.split(' ')[0]}
                      </span>

                      <span
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-widest
                          text-primary
                          leading-none
                        "
                      >
                        {userRole}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="
                    w-64
                    mt-4
                    p-3

                    bg-card
                    border-border

                    rounded-[1.5rem]
                    shadow-3xl
                  "
                >

                  <DropdownMenuGroup>

                    <DropdownMenuLabel
                      className="
                        px-4
                        py-3
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-black
                          text-foreground
                        "
                      >
                        {user?.name}
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                          font-medium
                        "
                      >
                        {user?.email}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator
                      className="
                        bg-border/50
                        my-2
                      "
                    />

                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          getDashboardLink()
                        )
                      }
                    >

                      <LayoutDashboard size={18} />

                      <span
                        className="
                          font-bold
                          text-sm
                        "
                      >
                        Dashboard
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="
                        flex
                        items-center
                        gap-3

                        px-4
                        py-3

                        rounded-xl
                        cursor-pointer

                        text-rose-500

                        hover:bg-rose-500/10
                        hover:text-rose-600

                        transition-colors
                      "
                    >

                      <LogOut size={18} />

                      <span
                        className="
                          font-bold
                          text-sm
                        "
                      >
                        Sign Out
                      </span>
                    </DropdownMenuItem>

                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

            ) : (

              <>
                <Link href="/login">

                  <button
                    className={cn(
                      `
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.2em]

                        hover:text-primary
                        transition-colors
                      `,
                      scrolled
                        ? 'text-foreground'
                        : 'text-white'
                    )}
                  >
                    Sign In
                  </button>
                </Link>

                <Link href="/register">

                  <Button
                    className="
                      h-12
                      px-8
                      rounded-xl

                      font-black
                      text-[10px]
                      uppercase
                      tracking-[0.2em]

                      shadow-lg
                      shadow-primary/20
                    "
                  >
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className={cn(
              `
                lg:hidden

                rounded-md
                border

                transition-colors
                p-1.5
                z-50
              `,
              scrolled
                ? `
                  text-foreground
                  border-border
                `
                : `
                  text-white
                  border-white/10
                `
            )}
          >

            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function Bot({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {

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
      className={className}
    >

      <path d="M12 8a4 4 0 1 0-4 4v2h8v-2" />
      <path d="M8 12a4 4 0 0 0 8 0" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
      <path d="M10 2h4" />
      <path d="M8.5 2a2.5 2.5 0 0 0 0 5" />
      <path d="M15.5 2a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}