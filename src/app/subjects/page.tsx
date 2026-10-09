'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatusBadge, statusMeta } from '@/components/academic';
import { AddSubjectDialog, ConfirmDialog } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { EmptyState } from '@/components/ui/states';
import { getSubjectResults, getSummary } from '@/lib/workspace/selectors';
import { number } from '@/lib/workspace/dates';
import { ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { Workspace } from '@/lib/workspace/types';

export default function SubjectsPage() {
  const { data, update } = useWorkspace();
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);
  const summary = useMemo(() => getSummary(data), [data]);
  const results = useMemo(() => getSubjectResults(data).filter(r => r.subjectName.toLowerCase().includes(query.toLowerCase())), [data, query]);
  const subjectToDelete = data.subjects.find(s => s.id === toDelete);
  const unitIds = [...new Set(data.subjects.map(s => s.unitId ?? 'none'))];
  const unitCount = unitIds.length;
  const gradeCount = data.grades.filter(g => !g.isSimulated).length;
  const semesterOptions = [...data.semesters.map(s => ({ value: s.id, label: s.name })), { value: 'all', label: 'Année' }];

  // Subjects grouped by teaching unit, in order of first appearance.
  const groups = unitIds.map((unitId, index) => ({
    key: unitId,
    label: `UE ${index + 1}`,
    rows: results.filter(r => (data.subjects.find(s => s.id === r.subjectId)?.unitId ?? 'none') === unitId),
  })).filter(g => g.rows.length > 0);

  function removeSubject(id: string) {
    update((current: Workspace) => ({
      ...current,
      subjects: current.subjects.filter(s => s.id !== id),
      assessments: current.assessments.filter(a => a.subjectId !== id),
      grades: current.grades.filter(g => g.subjectId !== id),
      credits: current.credits.filter(c => c.subjectId !== id),
      assignments: current.assignments.filter(a => a.subjectId !== id),
      sessions: current.sessions.filter(s => s.subjectId !== id),
      events: current.events.filter(e => e.subjectId !== id),
      resources: current.resources.filter(r => r.subjectId !== id),
    }), 'Matière supprimée');
  }

  return (
    <AppLayout title="Notes & matières">
      <div className="nm">
        <header className="nm-head">
          <div style={{ minWidth: 0 }}>
            <h1>Notes & Moyennes</h1>
            <p>Centralise toutes tes évaluations et suis ta progression.</p>
          </div>
          <div className="nm-head-actions">
            <Link href="/grades/new" className="button button-primary button-sm"><Pencil size={15} />Note</Link>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}><Plus size={15} />Matière</Button>
          </div>
        </header>

        <section className="nm-summary" aria-label="Résumé">
          <span className="dash-kicker">Moyenne générale</span>
          <div className="nm-summary-main">
            <strong className="num">{number(summary.average)}<small> / 20</small></strong>
          </div>
          <div className="nm-summary-meta">
            <span>{gradeCount} évaluations</span>
            <span>{unitCount} unités</span>
            <span>{summary.earnedCredits} / {summary.totalCredits} ECTS</span>
          </div>
        </section>

        <div className="nm-filters">
          <Segmented label="Période" value={data.activeSemesterId} onChange={value => update(c => ({ ...c, activeSemesterId: value }))} options={semesterOptions} />
          <div className="search nm-search">
            <Search size={17} aria-hidden="true" />
            <label htmlFor="subject-search" className="sr-only">Filtrer les matières</label>
            <input id="subject-search" className="input" placeholder="Rechercher une matière…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>

        {data.subjects.length === 0 ? (
          <EmptyState title="Tu n’as encore aucune note." description="Commence par ajouter ta première matière, puis ta première évaluation." action={<Button onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une matière</Button>} />
        ) : (
          <div className="nm-groups">
            {results.length === 0 && <p className="muted">Aucune matière ne correspond à « {query} ».</p>}
            {groups.map(group => (
              <section key={group.key} className="nm-group" aria-label={group.label}>
                <div className="nm-group-head"><h2>{group.label}</h2><span className="tiny muted">{group.rows.reduce((sum, r) => sum + r.coefficient, 0)} coeff</span></div>
                {group.rows.map(result => {
                  const subject = data.subjects.find(s => s.id === result.subjectId)!;
                  const meta = statusMeta[result.status];
                  return (
                    <article key={result.subjectId} className="nm-card" style={{ borderLeftColor: subject.color ?? 'var(--brand)' }}>
                      <div className="nm-card-top">
                        <div style={{ minWidth: 0 }}>
                          <h3>{subject.name}</h3>
                          <span className="small muted">Coeff {subject.coefficient} • {result.grades.length} évaluation{result.grades.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="nm-card-grade">
                          {result.grades.length ? <><strong className="num" style={{ color: meta.hex }}>{number(result.average)}</strong><small>/20</small></> : <span className="muted small">Sans note</span>}
                        </div>
                      </div>
                      <div className="nm-card-bottom">
                        <StatusBadge status={result.status} short />
                        <div className="row" style={{ gap: 4 }}>
                          <Link href={`/subjects/${subject.id}`} className="button button-secondary button-sm">Détail<ChevronRight size={15} /></Link>
                          <button type="button" className="icon-button danger" aria-label={`Supprimer ${subject.name}`} onClick={() => setToDelete(subject.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            ))}
          </div>
        )}
      </div>

      <AddSubjectDialog open={addOpen} onOpenChange={setAddOpen} />
      <ConfirmDialog open={Boolean(toDelete)} onOpenChange={open => !open && setToDelete(null)} title="Supprimer cette matière ?" description={`${subjectToDelete?.name ?? 'Cette matière'} et toutes ses notes seront supprimées. Cette action est définitive sur cet appareil.`} confirmLabel="Supprimer" onConfirm={() => toDelete && removeSubject(toDelete)} />
    </AppLayout>
  );
}
