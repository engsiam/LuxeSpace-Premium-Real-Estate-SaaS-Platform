// Global wildcard module declaration
declare module '@hookform/resolvers/zod' {
  import * as z from 'zod';
  export function zodResolver<T extends z.ZodType>(schema: T, schemaOptions?: any, options?: any): any;
}

declare module '@hookform/resolvers' {
  import * as z from 'zod';
  export function zodResolver<T extends z.ZodType>(schema: T, schemaOptions?: any, options?: any): any;
}

// Radix UI DropdownMenu components with asChild
declare module '@radix-ui/react-dropdown-menu' {
  import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
  
  interface DropdownMenuProps {
    children?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    dir?: 'ltr' | 'rtl';
  }
  
  interface DropdownMenuTriggerProps extends ComponentPropsWithRef<'div'> {
    asChild?: boolean;
    disabled?: boolean;
  }
  
  export const DropdownMenu: (props: DropdownMenuProps) => ReactNode;
  export const DropdownMenuTrigger: (props: DropdownMenuTriggerProps) => ReactNode;
  export const DropdownMenuContent: any;
  export const DropdownMenuLabel: any;
  export const DropdownMenuSeparator: any;
  export const DropdownMenuItem: any;
}