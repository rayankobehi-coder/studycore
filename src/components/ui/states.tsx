import { ArrowRight, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './button';
export function EmptyState({ title = 'Un nouvel espace à remplir.', description = 'Tes données apparaîtront ici dès que tu commenceras.', action, compact = false }: { title?: string; description?: string; action?: ReactNode; compact?: boolean }) {
  return <div className={`empty-state ${compact ? 'empty-compact' : ''}`}><div className="empty-symbol"><Inbox size={28} strokeWidth={1.4} /></div><h2>{title}</h2><p>{description}</p>{action}</div>;
}
export function PageSkeleton() { return <div className="page-skeleton" role="status" aria-label="Chargement de ton espace"><span className="sr-only">Chargement en cours…</span><div className="skeleton skeleton-title" /><div className="skeleton skeleton-subtitle" /><div className="stats-grid">{[1, 2, 3, 4].map(i => <div className="skeleton skeleton-stat" key={i} />)}</div><div className="dashboard-grid"><div className="skeleton skeleton-chart" /><div className="skeleton skeleton-chart" /></div></div>; }
export function ErrorState({ title = 'Une petite interruption.', description = 'Impossible de charger cet espace pour le moment.', onRetry }: { title?: string; description?: string; onRetry?: () => void }) { return <div className="empty-state"><div className="empty-symbol error-symbol"><AlertTriangle size={28} /></div><h2>{title}</h2><p>{description}</p>{onRetry && <Button onClick={onRetry}><RefreshCw size={16} />Réessayer</Button>}</div>; }
export function Alert({ variant = 'info', children }: { variant?: 'info' | 'success' | 'warning' | 'danger'; children: ReactNode }) { return <div className={`alert alert-${variant}`} role={variant === 'danger' ? 'alert' : 'status'}>{children}</div>; }
export function TextLink({ children, href }: { children: ReactNode; href: string }) { return <a className="text-link" href={href}>{children}<ArrowRight size={14} /></a>; }
