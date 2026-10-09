import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

const buttonVariants = cva('button', {
  variants: {
    variant: { default: 'button-primary', primary: 'button-primary', outline: 'button-outline', secondary: 'button-secondary', ghost: 'button-ghost', destructive: 'button-danger', link: 'button-link' },
    size: { default: '', sm: 'button-sm', lg: 'button-lg', icon: 'button-icon' },
  }, defaultVariants: { variant: 'default', size: 'default' },
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; loading?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading ? <><LoaderCircle size={16} className="spin" />{children}</> : children}</Comp>;
});
Button.displayName = 'Button';
export { buttonVariants };
