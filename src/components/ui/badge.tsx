import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
type Variant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'brand';
export function Badge({ variant = 'default', className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) { return <span className={cn('badge', `badge-${variant}`, className)} {...props} />; }
