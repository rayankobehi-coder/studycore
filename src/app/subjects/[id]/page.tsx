'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { EvolutionChart, Grade, StatusBadge, ProgressBarInline, statusMeta } from '@/components/academic';
import { EditGradeDialog, ConfirmDialog, assessmentTypes } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { getEvolution, getSubjectResults, simulateSubject } from '@/lib/workspace/selectors';
import { countdown, formatDate, number, parseDate } from '@/lib/workspace/dates';
import { ArrowLeft, Calculator, Pencil, Plus, Trash2, Target, TrendingUp, AlertTriangle, CalendarClock, Star } from 'lucide-react';

export default function SubjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { data, update } = useWorkspace();
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const subject = data.subjects.find(s => s.id === id);
  const result = useMemo(() => getSubjectResults(data, 'all').find(r => r.subjectId === id), [data, id]);
  const evolution = useMemo(() => getEvolution(data, id), [data, id]);
  const nextAssignment = data.assignments.filter(a => a.subjectId === id && a.status !== 'COMPLETED').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const simulation = useMemo(() => subject && result?.grades.length ? simulateSubject(data, subject, 12, 4, data.rules.passingGrade) : null, [data, subject, result]);

  if (!subject || !result) {
    return <AppLayout title="Matière"><EmptyState title="Cette matière n’existe plus." description="Elle a peut-être été supprimée. Retourne à la liste de tes matières." action={<Link href="/subjects" className="button button-primary">Voir mes matières</Link>} /></AppLayout>;
  }

  const rows = data.assessments.filter(a => a.subjectId === id).map(a => ({ assessment: a, grade: data.grades.find(g => g.assessmentId === a.id && !g.isSimulated) })).sort((a, b) => a.assessment.date.localeCompare(b.assessment.date));
  const strong = rows.filter(r => r.grade && (r.grade.value / r.grade.scale) * 20 >= 14).map(r => r.assessment.name);
  const weak = rows.filter(r => r.grade && (r.grade.value / r.grade.scale) * 20 < data.rules.passingGrade).map(r => r.assessment.name);
  const meta = statusMeta[result.status];
  const deleteTarget = data.grades.find(g => g.id === deleteId);

  function removeGrade(gradeId: string) {
    const grade = data.grades.find(g => g.id === gradeId);
    update(current => ({ ...current, grades: current.grades.filter(g => g.id !== gradeId), assessments: current.assessments.filter(a => a.id !== grade?.assessmentId) }), 'Note supprimée');
  }

  return (
    <AppLayout title={subject.name}>
      <nav aria-label="Fil d’Ariane" className="small muted" style={{ marginBottom: 16 }}>
        <Link href="/subjects" className="text-link"><ArrowLeft size={14} />Notes & matières</Link>
      </nav>
      <header className="page-head rise" style={{ alignItems: 'center' }}>
        <div className="row" style={{ gap: 18 }}>
          <span style={{ width: 14, height: 56, borderRadius: 8, background: subject.color ?? 'var(--brand)' }} aria-hidden="true" />
          <div>
            <p className="eyebrow">{subject.code} · {data.semesters.find(s => s.id === subject.semesterId)?.name}</p>
            <h1>{subject.name}</h1>
            <div className="row" style={{ gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <StatusBadge status={result.status} />
              <span className="badge badge-outline">Coefficient {subject.coefficient}</span>
              <span className="badge badge-outline">{subject.credits} crédits</span>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <Link href={`/grades/new?subject=${subject.id}`} className="button button-outline"><Plus size={16} />Ajouter une note</Link>
          <Link href={`/simulator?subject=${subject.id}`} className="button button-primary"><Calculator size={16} />Simuler ma prochaine note</Link>
        </div>
      </header>

      <section className="panel rise" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) minmax(0,1fr)', gap: 28, alignItems: 'center' }}>
        <div>
          <p className="stat-label">Moyenne de la matière</p>
          <div className="big-number" style={{ color: meta.hex, marginTop: 10 }}>{result.grades.length ? number(result.average) : '—'}<small>/20</small></div>
          <div style={{ marginTop: 14 }}><ProgressBarInline value={(result.average / 20) * 100} tone={result.status === 'VALIDATED' ? 'ok' : result.status === 'FAILED' ? 'danger' : result.status === 'WARNING' ? 'warn' : 'brand'} /></div>
        </div>
        <div className="stack" style={{ gap: 14 }}>
          <div className="panel-head" style={{ marginBottom: 0 }}><div><h2>Évolution</h2><p>Moyenne cumulée à chaque évaluation.</p></div></div>
          {evolution.length ? <EvolutionChart points={evolution} height={210} /> : <p className="muted">Ajoute une note pour voir la courbe.</p>}
        </div>
      </section>

      <div className="split" style={{ marginTop: 22 }}>
        <section className="panel" aria-labelledby="evals-title">
          <div className="panel-head"><div><h2 id="evals-title">Évaluations</h2><p>{rows.length} évaluation(s) pondérée(s) par leur coefficient.</p></div></div>
          {rows.length === 0 ? <EmptyState compact title="Tu n’as encore aucune note." description="Commence par ajouter ta première évaluation." action={<Link href={`/grades/new?subject=${subject.id}`} className="button button-primary"><Plus size={16} />Ajouter une note</Link>} /> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th scope="col">Évaluation</th><th scope="col">Date</th><th scope="col">Note</th><th scope="col">Coeff.</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {rows.map(({ assessment, grade }) => {
                    const normalized = grade ? (grade.value / grade.scale) * data.rules.gradingScale : 0;
                    return (
                      <tr key={assessment.id}>
                        <td><strong>{assessment.name}</strong><div className="tiny muted">{assessmentTypes.find(t => t.value === assessment.type)?.label}</div></td>
                        <td className="small muted">{formatDate(assessment.date)}</td>
                        <td>{grade ? <Grade value={normalized} size="sm" /> : <span className="muted small">À venir</span>}{grade && grade.scale !== data.rules.gradingScale && <div className="tiny muted">{grade.value}/{grade.scale}</div>}</td>
                        <td className="small">{assessment.coefficient}</td>
                        <td style={{ textAlign: 'right' }}>
                          {grade && <div className="row" style={{ justifyContent: 'flex-end', gap: 2 }}>
                            <button type="button" className="icon-button" aria-label={`Modifier ${assessment.name}`} onClick={() => setEditId(grade.id)}><Pencil size={15} /></button>
                            <button type="button" className="icon-button danger" aria-label={`Supprimer ${assessment.name}`} onClick={() => setDeleteId(grade.id)}><Trash2 size={15} /></button>
                          </div>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="stack">
          <section className="panel" aria-labelledby="analysis-title">
            <h2 id="analysis-title" style={{ marginBottom: 16 }}>Analyse</h2>
            <div className="stack" style={{ gap: 16 }}>
              <div><p className="small" style={{ fontWeight: 650, color: 'var(--ok)', display: 'flex', gap: 8, alignItems: 'center' }}><Star size={16} />Points forts</p><p className="small muted" style={{ marginTop: 6 }}>{strong.length ? strong.join(', ') : 'Pas encore d’évaluation au-dessus de 14/20.'}</p></div>
              <div><p className="small" style={{ fontWeight: 650, color: 'var(--warn)', display: 'flex', gap: 8, alignItems: 'center' }}><AlertTriangle size={16} />Points faibles</p><p className="small muted" style={{ marginTop: 6 }}>{weak.length ? weak.join(', ') : 'Aucune évaluation sous le seuil de validation.'}</p></div>
              <div className="surface-soft" style={{ padding: 14 }}>
                <p className="small" style={{ fontWeight: 650, display: 'flex', gap: 8, alignItems: 'center' }}><CalendarClock size={16} />Prochaine évaluation</p>
                {nextAssignment ? <p className="small muted" style={{ marginTop: 6 }}>{nextAssignment.title} · {formatDate(nextAssignment.dueDate)} · {countdown(nextAssignment.dueDate).toLowerCase()}</p> : <p className="small muted" style={{ marginTop: 6 }}>Aucune date planifiée.</p>}
              </div>
              {simulation && result.grades.length > 0 && (
                <div className="surface-soft" style={{ padding: 14 }}>
                  <p className="small" style={{ fontWeight: 650, display: 'flex', gap: 8, alignItems: 'center' }}><Target size={16} />Pour valider {data.rules.passingGrade}/20</p>
                  <p className="small muted" style={{ marginTop: 6 }}>{simulation.required === null ? 'Ajoute une évaluation pour estimer ce qu’il te faut.' : simulation.feasible ? `Il te faut au minimum ${number(simulation.required)}/20 à ta prochaine évaluation (coefficient 4).` : 'Objectif hors d’atteinte à la prochaine évaluation.'}</p>
                </div>
              )}
              <Link href={`/simulator?subject=${subject.id}`} className="button button-primary">Simuler ma prochaine note</Link>
            </div>
          </section>
          <section className="panel" aria-label="Rappel">
            <div className="row" style={{ gap: 10 }}><TrendingUp size={18} className="muted" /><p className="small muted">La moyenne est calculée à partir des règles de ta formation ({data.profile.formation}). Les résultats sont indicatifs.</p></div>
          </section>
        </div>
      </div>

      <EditGradeDialog open={Boolean(editId)} onOpenChange={open => !open && setEditId(null)} gradeId={editId} subject={subject} />
      <ConfirmDialog open={Boolean(deleteId)} onOpenChange={open => !open && setDeleteId(null)} title="Supprimer cette note ?" description={`La note de « ${rows.find(r => r.grade?.id === deleteId)?.assessment.name ?? ''} » sera retirée du calcul.`} confirmLabel="Supprimer la note" onConfirm={() => deleteId && removeGrade(deleteId)} />
      {deleteTarget && null}
    </AppLayout>
  );
}
