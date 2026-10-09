'use client';
import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, StatCard } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { ProgressRing } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { Check, Clock, CircleDashed, Hourglass, CheckCircle2 } from 'lucide-react';
import type { Workspace } from '@/lib/workspace/types';

const unitLabels: Record<string, string> = { informatique: 'UE Informatique', langues: 'UE Langues & communication', sciences: 'UE Mathématiques & sciences', professionnel: 'UE Projet & gestion' };

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

  if (data.credits.length === 0) return <AppLayout title="Crédits"><EmptyState title="Aucun crédit à suivre." description="Tes crédits ECTS apparaîtront dès que tes matières seront configurées." /></AppLayout>;

  const total = data.credits.reduce((s, c) => s + c.creditsTotal, 0);
  const earned = data.credits.reduce((s, c) => s + c.creditsEarned, 0);
  const pending = data.credits.filter(c => c.status === 'PENDING' || c.status === 'FAILED').reduce((s, c) => s + c.creditsTotal - c.creditsEarned, 0);
    const pct = total ? (earned / total) * 100 : 0;

  function markAcquired(subjectId: string) {
    update((current: Workspace) => ({ ...current, credits: current.credits.map(c => c.subjectId === subjectId ? { ...c, creditsEarned: c.creditsTotal, status: 'ACQUIRED', validatedAt: new Date().toISOString() } : c) }), 'Crédits marqués comme acquis');
  }
  function markPending(subjectId: string) {
    update((current: Workspace) => ({ ...current, credits: current.credits.map(c => c.subjectId === subjectId ? { ...c, creditsEarned: 0, status: 'PENDING', validatedAt: undefined } : c) }), 'Crédits remis en attente');
  }

  return (
    <AppLayout title="Crédits">
      <PageHead eyebrow="ECTS" title="Crédits" description="Suis les crédits acquis, en attente et restants pour ton diplôme." />
      <section className="panel rise" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: 36, alignItems: 'center' }}>
        <div className="ring-large"><ProgressRing value={pct} size={210} stroke={14} label="Crédits acquis"><div style={{ textAlign: 'center' }}><div className="big-number" style={{ fontSize: '3.1rem' }}>{earned}</div><div className="muted small">/ {total} ECTS</div></div></ProgressRing></div>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 }}>
          <StatCard label="Crédits acquis" tone="ok" icon={<CheckCircle2 size={16} />} value={<span className="num">{earned}</span>} />
          <StatCard label="En attente" tone="warn" icon={<Hourglass size={16} />} value={<span className="num">{pending}</span>} />
          <StatCard label="Restants" icon={<CircleDashed size={16} />} value={<span className="num">{Math.max(0, total - earned - pending)}</span>} foot={<>Crédits à valider d’ici la fin du parcours</>} />
        </div>
      </section>
      <section className="stack" style={{ marginTop: 26, gap: 14 }} aria-label="Unités d’enseignement">
        <div className="section-title" style={{ margin: 0 }}><h2>Unités d’enseignement</h2><span className="small muted">Validation par UE</span></div>
        {units.map(unit => (
          <article key={unit.id} className="ue-card">
            <div className="row" style={{ gap: 14, minWidth: 0 }}>
              <span className="stat-icon" style={{ background: unit.state === 'VALIDATED' ? 'var(--ok-soft)' : 'var(--surface-2)', color: unit.state === 'VALIDATED' ? 'var(--ok)' : 'var(--text-2)' }}>{unit.state === 'VALIDATED' ? <Check size={16} /> : <Clock size={16} />}</span>
              <div style={{ minWidth: 0 }}>
                <h3>{unit.label}</h3>
                <p className="small muted">{unit.earned} / {unit.credits} crédits</p>
                <div style={{ maxWidth: 360, marginTop: 8 }}><div className={`progress ${unit.state === 'VALIDATED' ? 'progress-ok' : ''}`} role="progressbar" aria-valuenow={unit.credits ? Math.round((unit.earned / unit.credits) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label={`Progression ${unit.label}`}><span style={{ width: `${unit.credits ? (unit.earned / unit.credits) * 100 : 0}%` }} /></div></div>
              </div>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <span className={`badge ${unit.state === 'VALIDATED' ? 'badge-success' : unit.state === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>{unit.state === 'VALIDATED' ? 'Validée' : unit.state === 'PENDING' ? 'En attente' : 'En cours'}</span>
            </div>
          </article>
        ))}
      </section>
      <section className="panel" style={{ marginTop: 26 }} aria-labelledby="credit-detail">
        <div className="panel-head"><div><h2 id="credit-detail">Détail par matière</h2><p>Valide ou remets en attente les crédits d’une matière.</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Matière</th><th scope="col">Crédits</th><th scope="col">Statut</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
            <tbody>
              {data.credits.map(credit => {
                const subject = data.subjects.find(s => s.id === credit.subjectId);
                const acquired = credit.status === 'ACQUIRED';
                return (
                  <tr key={credit.id}>
                    <td><strong>{subject?.name ?? 'Matière supprimée'}</strong></td>
                    <td className="num">{credit.creditsEarned} / {credit.creditsTotal}</td>
                    <td><span className={`badge ${acquired ? 'badge-success' : credit.status === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>{acquired ? <Check size={12} /> : null}{acquired ? 'Acquis' : credit.status === 'PENDING' ? 'En attente' : 'En cours'}</span></td>
                    <td style={{ textAlign: 'right' }}>{subject && (acquired ? <Button size="sm" variant="ghost" onClick={() => markPending(subject.id)}>Remettre en attente</Button> : <Button size="sm" variant="secondary" onClick={() => markAcquired(subject.id)}>Marquer acquis</Button>)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}
