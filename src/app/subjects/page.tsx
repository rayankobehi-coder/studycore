'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, StatCard, Grade, StatusBadge, ProgressBarInline } from '@/components/academic';
import { AddSubjectDialog, ConfirmDialog } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/fields';
import { EmptyState } from '@/components/ui/states';
import { getSubjectResults, getSummary } from '@/lib/workspace/selectors';
import { number } from '@/lib/workspace/dates';
import { CheckCircle2, CreditCard, Plus, Search, Trash2, ChevronRight, Sigma, Pencil } from 'lucide-react';
import type { Workspace } from '@/lib/workspace/types';

export default function SubjectsPage() {
  const { data, update } = useWorkspace();
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);
  const summary = useMemo(() => getSummary(data), [data]);
  const results = useMemo(() => getSubjectResults(data).filter(r => r.subjectName.toLowerCase().includes(query.toLowerCase())), [data, query]);
  const subjectToDelete = data.subjects.find(s => s.id === toDelete);

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
      <PageHead
        eyebrow="Notes"
        title="Notes & matières"
        description="Centralise toutes tes évaluations et suis ta progression matière par matière."
        actions={<><Link href="/grades/new" className="button button-outline"><Pencil size={16} />Ajouter une note</Link><Button onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une matière</Button></>}
      />

      <section className="stats-grid" aria-label="Résumé">
        <StatCard label="Moyenne générale" icon={<Sigma size={16} />} value={<span className="num">{number(summary.average)}</span>} unit="/20" />
        <StatCard label="Matières validées" tone="ok" icon={<CheckCircle2 size={16} />} value={<span className="num">{summary.validated}</span>} unit={`/ ${data.subjects.length}`} />
        <StatCard label="Crédits obtenus" icon={<CreditCard size={16} />} value={<span className="num">{summary.earnedCredits}</span>} unit={`/ ${summary.totalCredits}`} foot={<ProgressBarInline value={summary.totalCredits ? (summary.earnedCredits / summary.totalCredits) * 100 : 0} />} />
        <StatCard label="Évaluations saisies" value={<span className="num">{data.grades.length}</span>} foot={<>{data.subjects.length} matières suivies</>} />
      </section>

      <div className="row-between" style={{ margin: '30px 0 16px', gap: 12 }}>
        <div className="search" style={{ maxWidth: 360 }}>
          <Search size={17} aria-hidden="true" />
          <label htmlFor="subject-search" className="sr-only">Filtrer les matières</label>
          <input id="subject-search" className="input" placeholder="Filtrer les matières…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div style={{ width: 240 }}>
          <Select label="Semestre" className="" value={data.activeSemesterId} onChange={e => update(c => ({ ...c, activeSemesterId: e.target.value }))}>
            <option value="all">Toute l’année</option>
            {data.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>
      </div>

      {data.subjects.length === 0 ? (
        <EmptyState title="Tu n’as encore aucune note." description="Commence par ajouter ta première matière, puis ta première évaluation." action={<Button onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une matière</Button>} />
      ) : (
        <div className="stack" style={{ gap: 14 }}>
          {results.length === 0 && <p className="muted">Aucune matière ne correspond à « {query} ».</p>}
          {results.map(result => {
            const subject = data.subjects.find(s => s.id === result.subjectId)!;
            return (
              <article key={result.subjectId} className="panel rise" style={{ display: 'grid', gridTemplateColumns: '6px minmax(0,1fr) auto', gap: 20, alignItems: 'center', padding: '20px 22px 20px 0' }}>
                <span style={{ alignSelf: 'stretch', background: subject.color ?? 'var(--brand)', borderRadius: '0 6px 6px 0' }} aria-hidden="true" />
                <div style={{ minWidth: 0, display: 'grid', gap: 10 }}>
                  <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
                    <h2 style={{ fontSize: '1.08rem' }}>{subject.name}</h2>
                    <span className="badge badge-outline">{subject.code}</span>
                    <StatusBadge status={result.status} />
                  </div>
                  <div className="row small muted" style={{ gap: 18, flexWrap: 'wrap' }}>
                    <span>Coefficient {subject.coefficient}</span><span>{subject.credits} crédits</span><span>{result.grades.length} évaluation(s)</span>
                  </div>
                  <div style={{ maxWidth: 420 }}>{result.grades.length ? <ProgressBarInline value={(result.average / 20) * 100} tone={result.status === 'VALIDATED' ? 'ok' : result.status === 'FAILED' ? 'danger' : result.status === 'WARNING' ? 'warn' : 'brand'} /> : <span className="tiny muted">Aucune note pour l’instant</span>}</div>
                </div>
                <div className="row" style={{ gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>{result.grades.length ? <Grade value={result.average} size="md" /> : <span className="muted small">Sans note</span>}</div>
                  <div className="row" style={{ gap: 4 }}>
                    <Link href={`/subjects/${subject.id}`} className="button button-secondary button-sm">Détail<ChevronRight size={15} /></Link>
                    <button type="button" className="icon-button danger" aria-label={`Supprimer ${subject.name}`} onClick={() => setToDelete(subject.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AddSubjectDialog open={addOpen} onOpenChange={setAddOpen} />
      <ConfirmDialog open={Boolean(toDelete)} onOpenChange={open => !open && setToDelete(null)} title="Supprimer cette matière ?" description={`${subjectToDelete?.name ?? 'Cette matière'} et toutes ses notes seront supprimées. Cette action est définitive sur cet appareil.`} confirmLabel="Supprimer" onConfirm={() => toDelete && removeSubject(toDelete)} />
    </AppLayout>
  );
}
