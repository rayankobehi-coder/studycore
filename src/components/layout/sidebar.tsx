'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  GraduationCap,
  Calculator,
  CreditCard,
  Calendar,
  ClipboardList,
  Brain,
  BarChart3,
  BookOpen,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Notes & Matières', icon: GraduationCap },
  { href: '/simulator', label: 'Simulateur', icon: Calculator },
  { href: '/credits', label: 'Crédits', icon: CreditCard },
  { href: '/schedule', label: 'Emploi du temps', icon: Calendar },
  { href: '/assignments', label: 'Devoirs & Examens', icon: ClipboardList },
  { href: '/study-planner', label: 'Révisions', icon: Brain },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/resources', label: 'Ressources', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-lg">STUDYCORE</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Profil' : undefined}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Profil</span>}
        </Link>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}