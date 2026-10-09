'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  CalendarDays,
  CheckSquare,
  CircleUserRound,
  CreditCard,
  GraduationCap,
  LayoutGrid,
} from 'lucide-react';

const primaryItems = [
  { href: '/dashboard', label: 'Accueil', icon: LayoutGrid },
  { href: '/subjects', label: 'Notes', icon: GraduationCap },
  { href: '/simulator', label: 'Simulateur', icon: Calculator },
  { href: '/schedule', label: 'Planning', icon: CalendarDays },
  { href: '/profile', label: 'Profil', icon: CircleUserRound },
];

const extraItems = [
  { href: '/assignments', label: 'Échéances', icon: CheckSquare },
  { href: '/credits', label: 'Crédits ECTS', icon: CreditCard },
  { href: '/study-planner', label: 'Révisions', icon: Brain },
  { href: '/analytics', label: 'Performances', icon: BarChart3 },
  { href: '/resources', label: 'Ressources', icon: BookOpen },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="study-sidebar" aria-label="Navigation principale">
        <p className="study-nav-caption">ESPACE ÉTUDIANT</p>
        {[...primaryItems, ...extraItems].map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`study-side-link${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </aside>

      <nav className="study-bottom-nav" aria-label="Navigation mobile">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`study-bottom-link${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
