'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers } from 'lucide-react';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limit?: number;
  totalItems?: number;
  siblingCount?: number;
  showPageInfo?: boolean;
  showLimitSelector?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onLimitChange,
  limit = 10,
  totalItems = 0,
  siblingCount = 1,
  showPageInfo = true,
  showLimitSelector = true
}: PaginationProps) {
  if (totalPages <= 1 && !showLimitSelector) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = siblingCount;
    
    if (totalPages <= 7 + delta * 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > delta + 2) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);
      
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="flex items-center gap-4 order-2 sm:order-1">
        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Show</span>
            <Select
              value={limit.toString()}
              onValueChange={(val) => val && onLimitChange(parseInt(val))}
            >
              <SelectTrigger className="h-8 w-16 bg-background/50 border-border/50 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {[5, 10, 15, 20, 25, 50].map((l) => (
                  <SelectItem key={l} value={l.toString()} className="text-xs">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground hidden sm:inline">per page</span>
          </div>
        )}

        {showPageInfo && totalItems > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing <span className="text-white font-medium">{startItem}-{endItem}</span> of{' '}
            <span className="text-white font-medium">{totalItems}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 rounded-lg hover:bg-white/10 disabled:opacity-30 hidden sm:flex"
        >
          <ChevronsLeft size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 md:h-9 md:w-9 rounded-lg hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft size={16} className="md:w-[18px] md:h-[18px]" />
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 md:h-9 md:w-9 rounded-lg font-medium text-xs md:text-sm transition-all ${
                  page === currentPage 
                    ? 'bg-primary text-secondary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20' 
                    : 'hover:bg-white/10 text-muted-foreground hover:text-white'
                }`}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-1 text-muted-foreground/50">...</span>
            )
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 md:h-9 md:w-9 rounded-lg hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 rounded-lg hover:bg-white/10 disabled:opacity-30 hidden sm:flex"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
}