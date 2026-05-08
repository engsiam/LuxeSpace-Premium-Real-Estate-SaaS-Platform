// design-system/components.tsx
// STANDARDIZED COMPONENTS - FROM ZERO

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { MapPin, BedDouble, Maximize2 } from 'lucide-react';

// ==================== CONTAINER ===================
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}

// ==================== SECTION ===================
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 lg:py-16', className)}>
      <Container>{children}</Container>
    </section>
  );
}

// ==================== HEADING ===================
interface HeadingProps {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

const headingStyles = {
  1: 'text-4xl md:text-5xl font-bold tracking-tight',
  2: 'text-2xl md:text-3xl font-semibold tracking-tight',
  3: 'text-xl font-medium',
} as const;

export function Heading({ level, children, className }: HeadingProps) {
  const Component = `h${level}` as any;
  return <Component className={cn(headingStyles[level], className)}>{children}</Component>;
}

// ==================== BUTTON ===================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  href?: string;
}

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A74D] disabled:pointer-events-none disabled:opacity-50';

const buttonVariants = {
  default: 'bg-primary text-secondary-foreground hover:bg-primary/80',
  outline: 'border border-border bg-transparent hover:bg-card text-muted-foreground hover:text-foreground',
  ghost: 'hover:bg-card text-muted-foreground hover:text-foreground',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
};

const buttonSizes = {
  sm: 'h-8 px-4 text-sm',
  default: 'h-10 px-6 text-base',
  lg: 'h-12 px-8 text-lg',
};

export function Button({ variant = 'default', size = 'default', className, children, href, ...props }: ButtonProps) {
  const classes = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return <button className={classes} {...props}>{children}</button>;
}

// ==================== GRID ===================
interface GridProps {
  children?: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export function Grid({ children, className, cols = 3 }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  } as const;

  return (
    <div className={cn('grid gap-6 items-stretch', gridCols[cols], className)}>
      {children}
    </div>
  );
}

// ==================== PROPERTY CARD (REBUILT FROM ZERO) ===================
interface PropertyCardProps {
  title: string;
  price: number;
  city: string;
  bhk: number;
  size: number;
  status?: string;
  images?: string[];
  id: string;
  className?: string;
}

export function PropertyCard({ 
  title, price, city, bhk, size, status = 'AVAILABLE', images, id, className 
}: PropertyCardProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  return (
    <Link href={`/properties/${id}`} className={cn('flex flex-col h-full', className)}>
      <div className="overflow-hidden flex flex-col h-full bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group">
        {/* Image - Fixed 16:9 Ratio */}
        <div className="relative aspect-video overflow-hidden shrink-0">
          {images?.[0] ? (
            <img 
              src={images[0]} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-card flex items-center justify-center">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">No Image</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary/90 text-secondary-foreground font-medium px-3 py-1 rounded-lg uppercase tracking-widest text-xs">
              {status}
            </span>
          </div>
        </div>

        {/* Content - Same Padding Everywhere */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 flex-grow">
            {/* Location */}
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={14} />
              <span className="text-xs font-medium uppercase tracking-[0.3em]">{city}</span>
            </div>

            {/* Title - 2 Lines Max */}
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {title}
            </h3>

            {/* Features */}
            <div className="flex items-center gap-6 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <BedDouble size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{bhk} BHK</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{size} sqft</span>
              </div>
            </div>
          </div>

          {/* Price - Pushed to bottom */}
          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Asking Price</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ==================== INPUT ===================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input
        className={cn(
          'w-full h-10 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
