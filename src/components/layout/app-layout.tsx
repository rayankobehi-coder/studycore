'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown } from 'lucide-react';
import { Sidebar } from './sidebar';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Accueil',
  '/subjects': 'Notes & Moyennes',
  '/simulator': 'Simulateur',
  '/credits': 'Crédits ECTS',
  '/schedule': 'Emploi du temps',
  '/assignments': 'Planning — Échéances & Devoirs',
  '/study-planner': 'Planning — Plan de révisions',
  '/analytics': 'Analytics & performances',
  '/resources': 'Ressources',
  '/profile': 'Profil',
  '/onboarding': 'Mon parcours',
  '/pathway': 'Mon parcours académique',
};

function HeaderSectionTitle() {
  const pathname = usePathname();
  const title = routeTitles[pathname] ?? (pathname?.startsWith('/subjects/') ? 'Détail matière' : 'StudyCore');
  return <span className="study-brand-section">{title}</span>;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="study-app">
      <header className="study-header">
        <div className="study-brand">
          <Image
            src="/images/logo.png"
            alt="Logo StudyCore"
            width={48}
            height={48}
            priority
            className="study-brand-logo"
          />
          <div className="study-brand-copy">
            <span className="study-brand-name">STUDYCORE</span>
            <Suspense fallback={<span className="study-brand-section">StudyCore</span>}>
              <HeaderSectionTitle />
            </Suspense>
          </div>
        </div>
        <div className="study-header-actions">
          <button className="study-icon-button" type="button" aria-label="Notifications">
            <Bell size={19} />
            <span className="notification-dot" />
          </button>
          <button className="study-avatar" type="button" aria-label="Ouvrir le profil">
            R
            <ChevronDown className="avatar-chevron" size={12} />
          </button>
        </div>
      </header>

      <div className="study-workspace">
        <Suspense fallback={<aside className="study-sidebar" aria-label="Navigation principale" />}>
          <Sidebar />
        </Suspense>
        <main className="study-main">
          <div className="study-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
