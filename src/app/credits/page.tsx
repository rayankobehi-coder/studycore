'use client';
import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { ProgressRing } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { Check, Clock, CheckCircle2 } from 'lucide-react';
import type { Workspace } from '@/lib/workspace/types';

const unitLabels: Record<string, string> = { informatique: 'Informatique fondamentale', langues: 'Langues & communication', sciences: 'Mathématiques & sciences', professionnel: 'Projet & gestion' };

export default function CreditsPage() {
  const { data, update } = useWorkspace();
  const units = useMemo(() => {
    const groups = new Map<string, { id: string; label: string; credits: number; earned: number; statuses: string[] }>();
    data.credits.forEach(credit => {
      const key = credit.unitId ?? 'autre';
      const group = groups.get(key) ?? { id: key, label: unitLabels[key] ?? 'Autres UE', credits: 0, earned: 0, statuses: [] };
      group.credits += credit.creditsTotal; group.earned += credit.creditsEarned; group.statuses.push(credit.status);
      groups.set(key, group);
    });
    return [...groups.values()].map(group => {
      const state = group.statuses.every(s => s === 'ACQUIRED') ? 'VALIDATED' : group.statuses.some(s => s === 'PENDING' || s === 'FAILED') ? 'PENDING' : 'IN_PROGRESS';
      return { ...group, state };
    });
  }, [data.credits]);

  if (data.credits.length === 0) return <AppLayout title="Crédits ECTS"><EmptyState title="Aucun crédit à suivre." description="Tes crédits ECTS apparaîtront dès que tes matières seront configurées." /></AppLayout>;

  const total = data.credits.reduce((s, c) => s + c.creditsTotal, 0);
  const earned = data.credits.reduce((s, c) => s + c.creditsEarned, 0);
  const pending = data.credits.filter(c => c.status === 'PENDING' || c.status === 'FAILED').reduce((s, c) => s + c.creditsTotal - c.creditsEarned, 0);
  const remaining = Math.max(0, total - earned - pending);
  const pct = total ? (earned / total) * 100 : 0;

  function markAcquired(subjectId: string) {
    update((current: Workspace) => ({ ...current, credits: current.credits.map(c => c.subjectId === subjectId ? { ...c, creditsEarned: c.creditsTotal, status: 'ACQUIRED', validatedAt: new Date().toISOString() } : c) }), 'Crédits marqués comme acquis');
  }
  function markPending(subjectId: string) {
    update((current: Workspace) => ({ ...current, credits: current.credits.map(c => c.subjectId === subjectId ? { ...c, creditsEarned: 0, status: 'PENDING', validatedAt: undefined } : c) }), 'Crédits remis en attente');
  }

  return (
    <AppLayout title="Crédits ECTS">
      <div className="cr">
        <header style={{ minWidth: 0 }}>
          <span className="dash-chip"><i aria-hidden="true" />Système européen ECTS</span>
          <h1 style={{ marginTop: 10 }}>Crédits ECTS</h1>
          <p className="small muted" style={{ marginTop: 4 }}>Comptabilité de tes crédits européens, pour l’obtention du diplôme. Indicatif, non officiel.</p>
        </header>

        <section className="cr-ring" aria-label="Progression des crédits">
          <ProgressRing value={pct} size={190} stroke={13} label="Crédits acquis">
            <div style={{ textAlign: 'center' }}><div className="num" style={{ fontSize: '2.4rem', fontWeight: 760, letterSpacing: '-0.04em' }}>{earned}</div><div className="small muted">/ {total} ECTS validés</div></div>
          </ProgressRing>
          <div className="cr-mini">
            <div><span className="dot" style={{ background: 'var(--ok)' }} />Acquis<strong className="num" style={{ color: 'var(--ok)' }}>{earned}</strong></div>
            <div><span className="dot" style={{ background: 'var(--warn)' }} />En attente<strong className="num" style={{ color: 'var(--warn)' }}>{pending}</strong></div>
            <div><span className="dot" style={{ background: 'var(--text-3)' }} />Restants<strong className="num">{remaining}</strong></div>
          </div>
        </section>

        <section className="cr-units" aria-label="Unités d’enseignement">
          <div className="nm-group-head"><h2>Unités d’enseignement</h2><span className="tiny muted">{units.length} UE</span></div>
          {units.map(unit => {
            const rows = data.credits.filter(c => (c.unitId ?? 'autre') === unit.id);
            const validated = unit.state === 'VALIDATED';
            return (
              <article key={unit.id} className="cr-ue">
                <div className="cr-ue-top">
                  <div style={{ minWidth: 0 }}>
                    <span className="tiny muted">{unit.credits} ECTS</span>
                    <h3>{unit.label}</h3>
                  </div>
                  <span className={`badge ${validated ? 'badge-success' : unit.state === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>{validated ? <><Check size={12} />Validée</> : unit.state === 'PENDING' ? <><Clock size={12} />En attente</> : 'En cours'}</span>
                </div>
                <div className="progress" role="progressbar" aria-valuenow={unit.credits ? Math.round((unit.earned / unit.credits) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label={`Progression ${unit.label}`}><span style={{ width: `${unit.credits ? (unit.earned / unit.credits) * 100 : 0}%` }} /></div>
                <p className="small muted">{unit.earned} / {unit.credits} crédits acquis</p>
                <div className="cr-rows">
                  {rows.map(credit => {
                    const subject = data.subjects.find(s => s.id === credit.subjectId);
                    const acquired = credit.status === 'ACQUIRED';
                    return (
                      <div key={credit.id} className="cr-row">
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <strong style={{ display: 'block' }}>{subject?.name ?? 'Matière supprimée'}</strong>
                          <span className="tiny muted">{credit.creditsEarned} / {credit.creditsTotal} ECTS • {acquired ? 'Acquis' : credit.status === 'PENDING' ? 'En attente' : 'En cours'}</span>
                        </div>
                        {subject && (acquired
                          ? <Button size="sm" variant="ghost" onClick={() => markPending(subject.id)}>Remettre en attente</Button>
                          : <Button size="sm" variant="secondary" onClick={() => markAcquired(subject.id)}><CheckCircle2 size={14} />Marquer acquis</Button>)}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppLayout>
  );
}
