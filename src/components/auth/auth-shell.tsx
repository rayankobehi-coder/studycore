'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Brand } from '@/components/brand/brand';
import { ShieldCheck, LineChart, CalendarDays } from 'lucide-react';

export function AuthShell({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <div className="auth-shell">
      <aside className="auth-art" aria-hidden="true">
        <Brand inverse href="/" />
        <div>
          <p className="eyebrow" style={{ color: '#c7c4ff' }}>Ton centre de contrôle académique</p>
          <h2>Comprends tes notes. Maîtrise ton parcours.</h2>
          <p>Moyennes, crédits, examens et révisions réunis dans un espace calme, précis et toujours à jour.</p>
          <div className="stack" style={{ gap: 12, marginTop: 34 }}>
            <span className="row small" style={{ color: 'rgb(255 255 255 / 0.85)' }}><LineChart size={18} />Calculs fidèles au règlement de ton établissement</span>
            <span className="row small" style={{ color: 'rgb(255 255 255 / 0.85)' }}><CalendarDays size={18} />Examens et échéances toujours visibles</span>
            <span className="row small" style={{ color: 'rgb(255 255 255 / 0.85)' }}><ShieldCheck size={18} />Tes données restent privées</span>
          </div>
        </div>
      </aside>
      <main className="auth-panel">
        <div className="auth-card rise">
          <Link href="/" className="small muted" style={{ justifySelf: 'start' }}>← Retour à l’accueil</Link>
          <div>
            <h1>{title}</h1>
            <p className="lead">{lead}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
