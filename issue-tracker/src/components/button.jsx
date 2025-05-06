import React from 'react';
import { tv } from 'tailwind-variants';
import { cn } from '@/lib/utils'; // Create this util if not already available

// Define variants using tailwind-variants
const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  variants: {
    variant: {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'bg-transparent hover:bg-gray-100',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

// Component
const Button = ({ className, variant, size, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};

export { Button, buttonVariants };
