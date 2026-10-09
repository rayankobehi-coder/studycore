'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, Grade, ProgressBarInline, StatusBadge } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Input, Select } from '@/components/ui/fields';
import { EmptyState } from '@/components/ui/states';
import { getEngine, getSubjectResults, getSummary, simulateSubject } from '@/lib/workspace/selectors';
import { number } from '@/lib/workspace/dates';
import { ArrowLeft, Target } from 'lucide-react';

export default function SemesterSimulatorPage() {
  const { data } = useWorkspace();
  const [objective, setObjective] = useState(14);
  const [coefficient, setCoefficient] = useState(4);
  const summary = useMemo(() => getSummary(data), [data]);
  const results = useMemo(() => getSubjectResults(data).filter(r => r.grades.length > 0), [data]);
  const engine = getEngine(data);

  // For each subject, the average it must reach so that the whole semester hits the objective (others unchanged).
  const totalWeight = results.reduce((sum, r) => sum + r.coefficient, 0);
  const weightedTotal = results.reduce((sum, r) => sum + r.average * r.coefficient, 0);
  const scenarios = [
    { id: 'minimum', label: 'Minimum', offset: 0, text: 'Atteindre juste l’objectif.' },
    { id: 'realiste', label: 'Réaliste', offset: 0.5, text: 'Un petit plus, à ta portée.' },
    { id: 'ambition', label: 'Ambition', offset: 1, text: 'Viser haut, en travaillant fort.' },
  ];

  const plans = scenarios.map(scenario => {
    const target = objective + scenario.offset;
    const rows = results.map(result => {
      // Required average for this subject so that the weighted semester average reaches the target.
      const neededTotal = target * totalWeight - (weightedTotal - result.average * result.coefficient);
      const neededAverage = neededTotal / result.coefficient;
      const sim = simulateSubject(data, data.subjects.find(s => s.id === result.subjectId)!, 20, coefficient, neededAverage);
      const needed = neededAverage <= result.average ? result.average : sim.required;
      return { result, needed, reached: result.average >= neededAverage };
    });
    const feasible = rows.every(r => r.needed !== null && r.needed <= data.rules.gradingScale);
    return { ...scenario, target, rows, feasible };
  });

  if (data.subjects.length === 0) return <AppLayout title="Objectif semestre"><EmptyState title="Aucune matière pour l’instant." description="Ajoute des matières et leurs notes pour estimer ton objectif." action={<Link href="/subjects" className="button button-primary">Ajouter une matière</Link>} /></AppLayout>;

  return (
    <AppLayout title="Objectif semestre">
      <Link href="/simulator" className="text-link" style={{ marginBottom: 14 }}><ArrowLeft size={14} />Simulateur</Link>
      <PageHead eyebrow="Simulation globale" title="Objectif semestre" description="Vois ce qu’il te faut obtenir dans chaque matière pour atteindre ton objectif de moyenne." />
      <div className="split">
        <section className="panel stack" style={{ gap: 20 }} aria-labelledby="progress-title">
          <div className="row-between"><h2 id="progress-title">Ta progression</h2><span className="badge badge-brand">{data.semesters.find(s => s.id === data.activeSemesterId)?.name ?? 'Toute l’année'}</span></div>
          <div className="row" style={{ alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
            <div><p className="small muted">Moyenne actuelle</p><Grade value={summary.average} size="lg" /></div>
            <div><p className="small muted">Objectif</p><span className="big-number" style={{ fontSize: '2.2rem' }}>{number(objective)}<small>/20</small></span></div>
          </div>
          <ProgressBarInline value={(summary.average / objective) * 100} tone={summary.average >= objective ? 'ok' : 'brand'} />
          <div className="form-grid">
            <Input label="Objectif de moyenne" type="number" min="0" max="20" step="0.5" value={objective} onChange={e => setObjective(Math.min(20, Math.max(0, Number(e.target.value) || 0)))} />
            <Select label="Coefficient de la prochaine évaluation" value={String(coefficient)} onChange={e => setCoefficient(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}</Select>
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <h3>Pour atteindre {number(objective)}</h3>
            {plans[0].rows.map(({ result, needed, reached }) => (
              <div key={result.subjectId} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <div className="row" style={{ gap: 10 }}><span className="dot" style={{ background: data.subjects.find(s => s.id === result.subjectId)?.color }} /><span>{result.subjectName}</span></div>
                {reached ? <span className="badge badge-success">Déjà atteint</span> : needed !== null && needed <= 20 ? <strong className="num">{number(needed)} min.</strong> : <span className="badge badge-danger">Hors d’atteinte</span>}
              </div>
            ))}
          </div>
        </section>
        <section className="stack" aria-label="Scénarios" style={{ gap: 14 }}>
          {plans.map(plan => (
            <article key={plan.id} className={`scenario ${plan.id === 'realiste' ? 'is-highlight' : ''}`}>
              <div className="row-between"><span className="eyebrow" style={{ marginBottom: 0 }}>{plan.label}</span>{plan.feasible ? <span className="badge badge-success">Faisable</span> : <span className="badge badge-warning">Exigeant</span>}</div>
              <strong className="num">{number(plan.target)}<span className="small faint"> / 20</span></strong>
              <p className="small muted">{plan.text}</p>
              <div className="stack" style={{ gap: 6 }}>
                {plan.rows.map(r => (
                  <div key={r.result.subjectId} className="row-between small">
                    <span>{r.result.subjectName}</span>
                    <span className="num" style={{ fontWeight: 650 }}>{r.reached ? '✓' : r.needed !== null && r.needed <= 20 ? `${number(r.needed)}` : '—'}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
          <p className="tiny faint">Estimations indicatives : elles supposent que tes autres matières ne changent pas. Aucune note réelle n’est modifiée.</p>
          <p className="tiny faint">Matières : {results.map(r => <StatusBadge key={r.subjectId} status={r.status} short />).length} suivies.</p>
        </section>
      </div>
    </AppLayout>
  );
}
