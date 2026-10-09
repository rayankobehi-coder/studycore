'use client';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { AddAssignmentDialog } from '@/components/forms/planning-dialogs';
import { ConfirmDialog, assessmentTypes } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { countdown, daysUntil, formatDate } from '@/lib/workspace/dates';
import { AlertTriangle, CalendarDays, CheckCircle2, Circle, Clock, Plus, Trash2 } from 'lucide-react';
import type { Assignment } from '@/lib/types';

const EXAM_TYPES = ['EXAMEN', 'PARTIEL', 'EXAMEN_FINAL', 'RATTRAPAGE'];
const priorityLabel = (p: number) => (p >= 4 ? 'Priorité haute' : p >= 3 ? 'Priorité moyenne' : 'Priorité normale');

function Section({ title, items, emptyText, danger, subjects, onToggle, onDelete }: { title: string; items: Assignment[]; emptyText: string; danger?: boolean; subjects: { id: string; name: string }[]; onToggle: (a: Assignment) => void; onDelete: (id: string) => void }) {
  return (
    <section className="as-section" aria-label={title}>
      <div className="as-section-head">
        <h2 style={{ color: danger ? 'var(--danger)' : undefined }}>{danger && <span className="as-dot" aria-hidden="true" />}{title}</h2>
        <span className="tiny muted">{items.length} échéance{items.length > 1 ? 's' : ''}</span>
      </div>
      {items.length === 0 ? <p className="small muted">{emptyText}</p> : items.map(item => {
        const exam = EXAM_TYPES.includes(item.type);
        const done = item.status === 'COMPLETED';
        const late = !done && daysUntil(item.dueDate) < 0;
        const subject = subjects.find(s => s.id === item.subjectId);
        const typeLabel = exam ? 'Examen' : assessmentTypes.find(t => t.value === item.type)?.label ?? 'Devoir';
        return (
          <article key={item.id} className={`as-card ${exam && !done ? 'is-exam' : ''}`} style={{ opacity: done ? 0.6 : 1 }}>
            <div className="as-card-top">
              <div className="as-chips">
                <span className={`badge ${exam ? 'badge-danger' : 'badge-outline'}`}>{typeLabel}</span>
                <span className="badge badge-outline">{priorityLabel(item.priority)}</span>
              </div>
              <span className="as-coeff">Coeff {item.coefficient}</span>
            </div>
            <h3 style={{ textDecoration: done ? 'line-through' : undefined }}>{item.title}</h3>
            <p className="small muted">{subject?.name ?? 'Matière'} • {formatDate(item.dueDate, { weekday: 'long', day: 'numeric', month: 'long' })}{item.estimatedTime ? ` • ~${item.estimatedTime} min` : ''}</p>
            <div className="as-card-foot">
              <span className={`as-countdown ${late || exam ? 'is-danger' : ''}`}>{done ? 'Terminé' : late ? <><AlertTriangle size={14} />En retard</> : <><Clock size={14} />{countdown(item.dueDate)}</>}</span>
              <div className="row" style={{ gap: 6 }}>
                <button type="button" className="button button-secondary button-sm" onClick={() => onToggle(item)} aria-pressed={done}>{done ? <><Circle size={14} />Rouvrir</> : <><CheckCircle2 size={14} />Terminer</>}</button>
                <button type="button" className="icon-button danger" aria-label={`Supprimer ${item.title}`} onClick={() => onDelete(item.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default function AssignmentsPage() {
  const { data, update } = useWorkspace();
  const [addOpen, setAddOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);

  const groups = useMemo(() => {
    const open = data.assignments.filter(a => a.status !== 'COMPLETED' || showDone).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return {
      late: open.filter(a => a.status !== 'COMPLETED' && daysUntil(a.dueDate) < 0),
      today: open.filter(a => daysUntil(a.dueDate) === 0),
      week: open.filter(a => daysUntil(a.dueDate) >= 1 && daysUntil(a.dueDate) <= 7),
      later: open.filter(a => daysUntil(a.dueDate) > 7),
    };
  }, [data.assignments, showDone]);

  function toggle(assignment: Assignment) {
    const done = assignment.status === 'COMPLETED';
    update(current => ({ ...current, assignments: current.assignments.map(a => a.id === assignment.id ? { ...a, status: done ? 'PENDING' : 'COMPLETED' } : a) }), done ? 'Échéance rouverte' : 'Bravo, échéance terminée');
  }
  function remove(id: string) {
    update(current => ({ ...current, assignments: current.assignments.filter(a => a.id !== id) }), 'Échéance supprimée');
  }

  const openExams = data.assignments.filter(a => EXAM_TYPES.includes(a.type) && a.status !== 'COMPLETED' && daysUntil(a.dueDate) >= 0);
  const examCoefficient = openExams.reduce((sum, a) => sum + a.coefficient, 0);
  const deleteTarget = data.assignments.find(a => a.id === toDelete);

  return (
    <AppLayout title="Échéances">
      <div className="as">
        <header className="nm-head">
          <div style={{ minWidth: 0 }}>
            <h1>Échéances</h1>
            <p>Devoirs, projets et examens à venir, classés par urgence.</p>
          </div>
          <div className="nm-head-actions">
            <Button size="sm" onClick={() => setAddOpen(true)}><Plus size={15} />Ajouter</Button>
          </div>
        </header>

        <section className="as-banner" aria-label="Résumé des échéances">
          <span className="as-banner-icon"><AlertTriangle size={18} /></span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <strong>{openExams.length} examen{openExams.length > 1 ? 's' : ''} à venir</strong>
            <p className="small muted">Coefficient cumulé : {examCoefficient} • {groups.today.length} aujourd’hui • {groups.late.length} en retard</p>
          </div>
          <span className="badge badge-brand">{data.assignments.filter(a => a.status !== 'COMPLETED').length} actives</span>
        </section>

        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="button button-ghost button-sm" onClick={() => setShowDone(v => !v)} aria-pressed={showDone}>{showDone ? 'Masquer les terminées' : 'Afficher les terminées'}</button>
        </div>

        {data.assignments.length === 0 ? <EmptyState title="Aucune échéance pour l’instant." description="Ajoute tes devoirs et examens pour ne plus rien oublier." action={<Button onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une échéance</Button>} /> : (
          <div className="as-sections">
            {groups.late.length > 0 && <Section title="En retard" items={groups.late} emptyText="" danger subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />}
            <Section title="Aujourd’hui & urgent" items={groups.today} emptyText="Rien d’urgent aujourd’hui." danger={groups.today.some(a => EXAM_TYPES.includes(a.type))} subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />
            <Section title="Cette semaine" items={groups.week} emptyText="Aucune échéance cette semaine." subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />
            <Section title="Plus tard" items={groups.later} emptyText="Rien de prévu au-delà de 7 jours." subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />
          </div>
        )}
        {data.assignments.length > 0 && <p className="small muted row" style={{ gap: 6 }}><CalendarDays size={14} />Les échéances terminées restent consultables avec « Afficher les terminées ».</p>}
      </div>
      <AddAssignmentDialog open={addOpen} onOpenChange={setAddOpen} />
      <ConfirmDialog open={Boolean(toDelete)} onOpenChange={o => !o && setToDelete(null)} title="Supprimer cette échéance ?" description={`« ${deleteTarget?.title ?? ''} » sera retirée de ta liste.`} confirmLabel="Supprimer" onConfirm={() => toDelete && remove(toDelete)} />
    </AppLayout>
  );
}
