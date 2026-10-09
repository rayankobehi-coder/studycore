'use client';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, StatCard } from '@/components/academic';
import { AddAssignmentDialog } from '@/components/forms/planning-dialogs';
import { ConfirmDialog, assessmentTypes } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { countdown, daysUntil, formatDate, parseDate } from '@/lib/workspace/dates';
import { AlertTriangle, CalendarDays, CheckCircle2, Circle, Clock, Plus, Trash2, Flame } from 'lucide-react';
import type { Assignment } from '@/lib/types';

const EXAM_TYPES = ['EXAMEN', 'PARTIEL', 'EXAMEN_FINAL', 'RATTRAPAGE'];
const priorityLabel = (p: number) => (p >= 4 ? 'Priorité haute' : p >= 3 ? 'Priorité moyenne' : 'Priorité basse');

function Section({ title, items, emptyText, tone, subjects, onToggle, onDelete }: { title: string; items: Assignment[]; emptyText: string; tone?: 'danger'; subjects: { id: string; name: string }[]; onToggle: (a: Assignment) => void; onDelete: (id: string) => void }) {
  return (
    <section className="stack" style={{ gap: 12, marginTop: 28 }} aria-label={title}>
      <div className="row" style={{ gap: 10 }}>
        <h2 style={{ color: tone === 'danger' ? 'var(--danger)' : undefined }}>{title}</h2>
        <span className="badge badge-outline">{items.length}</span>
      </div>
      {items.length === 0 ? <p className="small muted">{emptyText}</p> : items.map(item => {
        const exam = EXAM_TYPES.includes(item.type);
        const done = item.status === 'COMPLETED';
        const late = !done && daysUntil(item.dueDate) < 0;
        const subject = subjects.find(s => s.id === item.subjectId);
        const date = parseDate(item.dueDate);
        return (
          <article key={item.id} className={`deadline rise ${exam && !done ? 'is-exam' : ''}`} style={{ opacity: done ? 0.6 : 1 }}>
            <div className="date-tile" style={exam && !done ? undefined : undefined}><b>{date.getDate()}</b><span>{date.toLocaleDateString('fr-FR', { month: 'short' })}</span></div>
            <div style={{ minWidth: 0, display: 'grid', gap: 6 }}>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {exam ? <span className="badge badge-danger">🔴 Examen</span> : <span className="badge badge-outline">{assessmentTypes.find(t => t.value === item.type)?.label ?? 'Devoir'}</span>}
                <span className="badge badge-brand">{priorityLabel(item.priority)}</span>
              </div>
              <strong style={{ textDecoration: done ? 'line-through' : undefined }}>{item.title}</strong>
              <span className="small muted">{subject?.name ?? 'Matière'} · {formatDate(item.dueDate, { weekday: 'long', day: 'numeric', month: 'long' })} · Coeff. {item.coefficient}{item.estimatedTime ? ` · ~${item.estimatedTime} min` : ''}</span>
            </div>
            <div className="row" style={{ gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <span className={`badge ${late ? 'badge-danger' : exam ? 'badge-danger' : 'badge-outline'}`}>{done ? 'Terminé' : late ? <><AlertTriangle size={12} />En retard</> : countdown(item.dueDate)}</span>
              <button type="button" className="button button-secondary button-sm" onClick={() => onToggle(item)} aria-pressed={done}>{done ? <><Circle size={14} />Rouvrir</> : <><CheckCircle2 size={14} />Terminer</>}</button>
              <button type="button" className="icon-button danger" aria-label={`Supprimer ${item.title}`} onClick={() => onDelete(item.id)}><Trash2 size={15} /></button>
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
      done: data.assignments.filter(a => a.status === 'COMPLETED'),
    };
  }, [data.assignments, showDone]);

  function toggle(assignment: Assignment) {
    const done = assignment.status === 'COMPLETED';
    update(current => ({ ...current, assignments: current.assignments.map(a => a.id === assignment.id ? { ...a, status: done ? 'PENDING' : 'COMPLETED' } : a) }), done ? 'Échéance rouverte' : 'Bravo, échéance terminée');
  }
  function remove(id: string) {
    update(current => ({ ...current, assignments: current.assignments.filter(a => a.id !== id) }), 'Échéance supprimée');
  }

  const upcomingExams = data.assignments.filter(a => EXAM_TYPES.includes(a.type) && a.status !== 'COMPLETED' && daysUntil(a.dueDate) >= 0).length;
  const deleteTarget = data.assignments.find(a => a.id === toDelete);

  return (
    <AppLayout title="Devoirs & examens">
      <PageHead eyebrow="Échéances" title="Devoirs & examens" description="Ce qui arrive, classé par urgence. Les examens sont mis en évidence." actions={<><button type="button" className="button button-ghost" onClick={() => setShowDone(v => !v)} aria-pressed={showDone}>{showDone ? 'Masquer les terminées' : 'Afficher les terminées'}</button><Button onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une échéance</Button></>} />
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }} aria-label="Résumé des échéances">
        <StatCard label="Aujourd’hui" tone="warn" icon={<Flame size={16} />} value={<span className="num">{groups.today.length}</span>} foot={<>{groups.late.length} en retard</>} />
        <StatCard label="Cette semaine" icon={<CalendarDays size={16} />} value={<span className="num">{groups.week.length}</span>} />
        <StatCard label="Examens à venir" tone="danger" icon={<Clock size={16} />} value={<span className="num">{upcomingExams}</span>} />
      </section>
      {data.assignments.length === 0 ? <div style={{ marginTop: 26 }}><EmptyState title="Aucune échéance pour l’instant." description="Ajoute tes devoirs et examens pour ne plus rien oublier." action={<Button onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une échéance</Button>} /></div> : (
        <>
          {groups.late.length > 0 && <Section title="En retard" items={groups.late} emptyText="" tone="danger" subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />}
          <Section title="Aujourd’hui" items={groups.today} emptyText="Rien d’urgent aujourd’hui." subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />
          <Section title="Cette semaine" items={groups.week} emptyText="Aucune échéance cette semaine." subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />
          <Section title="Plus tard" items={groups.later} emptyText="Rien de prévu au-delà de 7 jours." subjects={data.subjects} onToggle={toggle} onDelete={setToDelete} />
        </>
      )}
      <AddAssignmentDialog open={addOpen} onOpenChange={setAddOpen} />
      <ConfirmDialog open={Boolean(toDelete)} onOpenChange={o => !o && setToDelete(null)} title="Supprimer cette échéance ?" description={`« ${deleteTarget?.title ?? ''} » sera retirée de ta liste.`} confirmLabel="Supprimer" onConfirm={() => toDelete && remove(toDelete)} />
    </AppLayout>
  );
}
