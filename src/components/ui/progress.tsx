import * as React from 'react';
import { cn } from '@/lib/utils';

function Progress({ className, value, max = 100, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }) {
  const percentage = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };