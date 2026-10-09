import type { ReactNode } from "react";
import { cn } from '@/lib/utils';
export function Progress({ value = 0, className, label = 'Progression' }: { value?: number; className?: string; label?: string }) {
  const progress = Math.min(100, Math.max(0, value));
  return <div className={cn('progress', className)} role="progressbar" aria-label={label} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>;
}
export function ProgressRing({ value, size = 138, stroke = 9, children, label = 'Progression' }: { value: number; size?: number; stroke?: number; children?: ReactNode; label?: string }) {
  const radius = (size - stroke) / 2; const circumference = 2 * Math.PI * radius;
  return <div className="progress-ring" style={{ width: size, height: size }} role="img" aria-label={`${label} : ${Math.round(value)} %`}><svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true"><circle className="ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} /><circle className="ring-value" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - Math.min(100, Math.max(0, value)) / 100)} /></svg><div className="ring-content">{children}</div></div>;
}
