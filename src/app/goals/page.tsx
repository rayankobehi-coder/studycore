'use client';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, ProgressBarInline } from '@/components/academic';
import { AddGoalDialog } from '@/components/forms/planning-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { getGoalProgress } from '@/lib/workspace/selectors';
import { countdown, formatDate, number } from '@/lib/workspace/dates';
import { CalendarClock, ChevronDown, ChevronUp, Plus, Target, Trash2, CheckCircle2, GraduationCap, TrendingUp, Archive } from 'lucide-react';
import type { AcademicGoal } from '@/lib/workspace/types';

const icons = { OVERALL: TrendingUp, CREDITS: GraduationCap, SUBJECT_GRADE: Target } as const;

export default function GoalsPage() {
  const { data, update } = useWorkspace();
  const [addOpen, setAddOpen] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const items = useMemo(() => data.goals.map(goal => ({ goal, state: getGoalProgress(goal, data) })), [data]);

  function setStatus(id: string, status: AcademicGoal['status']) {
    update(current => ({ ...current, goals: current.goals.map(g => g.id === id ? { ...g, status, updatedAt: new Date().toISOString() } : g) }), status === 'ABANDONED' ? 'Objectif mis de côté' : 'Objectif réactivé');
  }
  function remove(id: string) {
    update(current => ({ ...current, goals: current.goals.filter(g => g.id !== id) }), 'Objectif supprimé');
  }

  return (
    <AppLayout title="Objectifs">
      <PageHead eyebrow="Objectifs" title="Mes objectifs" description="Une cible claire, une progression mesurée, une échéance visible." actions={<Button onClick={() => setAddOpen(true)}><Plus size={16} />Nouvel objectif</Button>} />
      {items.length === 0 ? <EmptyState title="Aucun objectif pour l’instant." description="Fixe-toi une cible : une moyenne, des crédits ou une matière à améliorer." action={<Button onClick={() => setAddOpen(true)}><Plus size={16} />Créer un objectif</Button>} /> : (
        <div className="stack" style={{ gap: 16 }}>
          {items.map(({ goal, state }) => {
            const Icon = icons[goal.type as keyof typeof icons] ?? Target;
            const isOpen = open === goal.id;
            const label = state.achieved ? 'Atteint' : goal.status === 'ABANDONED' ? 'Mis de côté' : goal.deadline && countdown(goal.deadline).startsWith('En retard') ? 'En retard' : 'En cours';
            const badge = state.achieved ? 'badge-success' : label === 'En retard' ? 'badge-danger' : goal.status === 'ABANDONED' ? 'badge-outline' : 'badge-info';
            const unit = goal.type === 'CREDITS' ? 'crédits' : '/20';
            return (
              <article key={goal.id} className="goal-card rise">
                <div className="goal-head">
                  <div className="row" style={{ gap: 14, minWidth: 0 }}>
                    <span className="stat-icon" style={{ width: 44, height: 44 }}><Icon size={20} /></span>
                    <div style={{ minWidth: 0 }}>
                      <h2 style={{ fontSize: '1.08rem' }}>{goal.title}</h2>
                      <div className="goal-meta" style={{ marginTop: 4 }}>
                        <span>Cible : {number(goal.targetValue, goal.type === 'CREDITS' ? 0 : 2)} {unit}</span>
                        {goal.deadline && <span className="row" style={{ gap: 6 }}><CalendarClock size={14} />{formatDate(goal.deadline, { day: 'numeric', month: 'long' })} · {countdown(goal.deadline).toLowerCase()}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${badge}`}>{state.achieved && <CheckCircle2 size={12} />}{label}</span>
                </div>
                <div className="row-between" style={{ gap: 14, flexWrap: 'nowrap' }}>
                  <div style={{ flex: 1 }}><ProgressBarInline value={state.percent} tone={state.achieved ? 'ok' : label === 'En retard' ? 'danger' : 'brand'} /></div>
                  <strong className="num" style={{ fontSize: '1.4rem', letterSpacing: '-0.04em' }}>{Math.round(state.percent)}%</strong>
                </div>
                <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
                  <span className="small muted">Actuel : {goal.type === 'CREDITS' ? `${number(state.current, 0)} crédits` : `${number(state.current)}/20`}</span>
                  <div className="row" style={{ gap: 6 }}>
                    <Button variant="outline" size="sm" onClick={() => setOpen(isOpen ? null : goal.id)} aria-expanded={isOpen}>{isOpen ? <><ChevronUp size={14} />Réduire</> : <><ChevronDown size={14} />Détail</>}</Button>
                    <button type="button" className="icon-button" aria-label="Mettre de côté" onClick={() => setStatus(goal.id, goal.status === 'ABANDONED' ? 'ACTIVE' : 'ABANDONED')}><Archive size={16} /></button>
                    <button type="button" className="icon-button danger" aria-label="Supprimer l’objectif" onClick={() => remove(goal.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                {isOpen && (
                  <div className="surface-soft" style={{ padding: 16, display: 'grid', gap: 8 }}>
                    <p className="small"><strong>Ce qui reste :</strong> {state.achieved ? 'rien, objectif atteint.' : goal.type === 'CREDITS' ? `${Math.max(0, goal.targetValue - state.current)} crédits à valider.` : `${number(Math.max(0, goal.targetValue - state.current))} point(s) pour atteindre la cible.`}</p>
                    <p className="small muted">Pour progresser, ouvre le simulateur pour estimer la note nécessaire à ta prochaine évaluation.</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      <AddGoalDialog open={addOpen} onOpenChange={setAddOpen} />
    </AppLayout>
  );
}
