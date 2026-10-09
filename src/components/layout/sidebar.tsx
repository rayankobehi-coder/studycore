'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, Calculator, Route, CreditCard, CalendarDays, ClipboardList, Brain, Target, BarChart3, BookOpen, Bell, Settings, UserRound, Cloud, CloudOff, RefreshCw, HelpCircle } from 'lucide-react';
import { Brand } from '@/components/brand/brand';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { getNotifications } from '@/lib/workspace/selectors';

export const mainNav = [
  { href: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { href: '/subjects', label: 'Notes & matières', icon: GraduationCap },
  { href: '/simulator', label: 'Simulateur', icon: Calculator },
  { href: '/journey', label: 'Parcours', icon: Route },
  { href: '/credits', label: 'Crédits', icon: CreditCard },
  { href: '/schedule', label: 'Planning', icon: CalendarDays },
  { href: '/assignments', label: 'Échéances', icon: ClipboardList },
  { href: '/study-planner', label: 'Révisions', icon: Brain },
  { href: '/goals', label: 'Objectifs', icon: Target },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/resources', label: 'Ressources', icon: BookOpen },
];
export const footerNav = [
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Paramètres', icon: Settings },
  { href: '/profile', label: 'Profil', icon: UserRound },
  { href: '/aide', label: 'Aide', icon: HelpCircle },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const { data, syncStatus } = useWorkspace();
  const unread = getNotifications(data).filter(n => !n.read).length;
  const syncLabel = { loading: 'Chargement', local: 'Sauvegardé sur cet appareil', syncing: 'Synchronisation…', synced: 'Synchronisé', error: 'Sauvegarde à vérifier' }[syncStatus];
  const SyncIcon = syncStatus === 'error' ? CloudOff : syncStatus === 'syncing' ? RefreshCw : Cloud;
  return (
    <aside className="sidebar" aria-label="Navigation principale">
      <div className="sidebar-head"><Brand /></div>
      <nav className="nav" aria-label="Modules">
        <p className="sidebar-section">Mon espace</p>
        {mainNav.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="nav-link" aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              <Icon size={19} strokeWidth={1.9} />{item.label}
            </Link>
          );
        })}
      </nav>
      <nav className="nav" aria-label="Compte">
        <p className="sidebar-section">Compte</p>
        {footerNav.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="nav-link" aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              <Icon size={19} strokeWidth={1.9} />{item.label}
              {item.href === '/notifications' && unread > 0 && <span className="nav-badge" aria-label={`${unread} non lues`}>{unread}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        <span className={`sync-pill sync-${syncStatus}`} role="status"><span className="sync-dot" /><SyncIcon size={14} />{syncLabel}</span>
        {data.isDemo && <span className="badge badge-warning" style={{ justifySelf: 'start' }}>Données fictives</span>}
      </div>
    </aside>
  );
}
