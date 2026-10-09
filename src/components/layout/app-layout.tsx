'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Bell, LayoutDashboard, GraduationCap, Calculator, CalendarDays, UserRound, Search, Sun, Moon, Monitor, LogOut, Play } from 'lucide-react';
import { Sidebar, isActive } from './sidebar';
import { BrandMark, Avatar } from '@/components/brand/brand';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { PageSkeleton } from '@/components/ui/states';
import { getNotifications } from '@/lib/workspace/selectors';
import type { Theme } from '@/lib/workspace/types';

const mobileNav = [
  { href: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { href: '/subjects', label: 'Notes', icon: GraduationCap },
  { href: '/simulator', label: 'Simulateur', icon: Calculator },
  { href: '/schedule', label: 'Planning', icon: CalendarDays },
  { href: '/profile', label: 'Profil', icon: UserRound },
];
const themeCycle: Theme[] = ['light', 'dark', 'system'];
const themeIcon = { light: Sun, dark: Moon, system: Monitor };
const themeLabel = { light: 'Clair', dark: 'Sombre', system: 'Système' };

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, loaded, theme, setTheme, syncStatus, syncError, signOut, retrySync } = useWorkspace();
  // The menu belongs to the page it was opened on: navigating away closes it without an effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const [query, setQuery] = useState('');
  const unread = getNotifications(data).filter(n => !n.read).length;
  const ThemeIcon = themeIcon[theme];

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    router.push(`/resources?q=${encodeURIComponent(query.trim())}`);
  }

  function nextTheme() {
    setTheme(themeCycle[(themeCycle.indexOf(theme) + 1) % themeCycle.length]);
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <header className="topbar">
          <Link href="/dashboard" className="mobile-brand" aria-label="Accueil STUDYCORE"><BrandMark size={32} /></Link>
          <span className="topbar-title" aria-hidden="true">{title}</span>
          <form className="search" role="search" onSubmit={submitSearch}>
            <Search size={17} aria-hidden="true" />
            <label htmlFor="global-search" className="sr-only">Rechercher un cours, une fiche, un sujet</label>
            <input id="global-search" className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un cours, une fiche, un sujet…" />
          </form>
          <div className="topbar-actions">
            <button type="button" className="icon-button" onClick={nextTheme} aria-label={`Thème : ${themeLabel[theme]}. Changer`} title={`Thème : ${themeLabel[theme]}`}>
              <ThemeIcon size={18} />
            </button>
            <Link href="/notifications" className="icon-button relative" aria-label={`Notifications${unread ? `, ${unread} non lues` : ''}`}>
              <Bell size={18} />
              {unread > 0 && <span className="notif-count" aria-hidden="true">{unread}</span>}
            </Link>
            <div className="relative">
              <button type="button" className="avatar-button" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuPath(menuOpen ? null : pathname)} aria-label="Menu du profil">
                <Avatar firstName={data.profile.firstName} lastName={data.profile.lastName} />
              </button>
              {menuOpen && (
                <div className="menu-card" role="menu">
                  <div style={{ padding: '8px 12px 10px' }}>
                    <strong>{data.profile.firstName} {data.profile.lastName}</strong>
                    <p className="tiny muted">{data.profile.formation}</p>
                  </div>
                  <Link href="/profile" role="menuitem"><UserRound size={16} />Mon profil</Link>
                  <Link href="/settings" role="menuitem"><Monitor size={16} />Paramètres</Link>
                  {data.isDemo && <Link href="/onboarding" role="menuitem"><Play size={16} />Configurer mon profil</Link>}
                  <button type="button" role="menuitem" className="danger" onClick={signOut}><LogOut size={16} />Se déconnecter</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content" id="main">
          {syncStatus === 'error' && syncError && (
            <div className="alert alert-warning" style={{ marginBottom: 20 }} role="alert">
              <span style={{ flex: 1 }}>{syncError}</span>
              <button className="button button-outline button-sm" onClick={retrySync}>Réessayer</button>
            </div>
          )}
          {!loaded ? <PageSkeleton /> : children}
        </main>
      </div>
      <nav className="bottom-nav" aria-label="Navigation mobile">
        {mobileNav.map(item => {
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}><Icon size={20} />{item.label}</Link>;
        })}
      </nav>
    </div>
  );
}

