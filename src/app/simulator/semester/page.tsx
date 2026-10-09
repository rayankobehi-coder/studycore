'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Grade, ProgressBarInline, StatusBadge } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Input, Select } from '@/components/ui/fields';
import { EmptyState } from '@/components/ui/states';
import { getSubjectResults, getSummary, simulateSubject } from '@/lib/workspace/selectors';
import { number } from '@/lib/workspace/dates';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SemesterSimulatorPage() {
  const { data } = useWorkspace();
  const [objective, setObjective] = useState(14);
  const [coefficient, setCoefficient] = useState(4);
  const [scenarioId, setScenarioId] = useState<'minimum' | 'realiste' | 'ambition'>('realiste');
  const summary = useMemo(() => getSummary(data), [data]);
  const results = useMemo(() => getSubjectResults(data).filter(r => r.grades.length > 0), [data]);

  // For each subject, the average it must reach so that the whole semester hits the objective (others unchanged).
  const totalWeight = results.reduce((sum, r) => sum + r.coefficient, 0);
  const weightedTotal = results.reduce((sum, r) => sum + r.average * r.coefficient, 0);
  const scenarios = [
    { id: 'minimum' as const, label: 'Minimum', offset: 0, text: 'Atteindre juste l’objectif.' },
    { id: 'realiste' as const, label: 'Réaliste', offset: 0.5, text: 'Un petit plus, à ta portée.' },
    { id: 'ambition' as const, label: 'Ambition', offset: 1, text: 'Viser haut, en travaillant fort.' },
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

  const selected = plans.find(p => p.id === scenarioId) ?? plans[1];
  const semesterName = data.semesters.find(s => s.id === data.activeSemesterId)?.name ?? 'Toute l’année';

  return (
    <AppLayout title="Objectif semestre">
      <div className="sim">
        <header className="nm-head">
          <div style={{ minWidth: 0 }}>
            <Link href="/simulator" className="text-link small"><ArrowLeft size={14} />Simulateur</Link>
            <h1 style={{ marginTop: 8 }}>Objectif semestre</h1>
            <p>Ce qu’il te faut obtenir dans chaque matière pour atteindre ton objectif.</p>
          </div>
          <span className="badge badge-brand">{semesterName}</span>
        </header>

        <nav className="sim-tabs" aria-label="Type de simulation">
          <Link href="/simulator" className="sim-tab">Par matière</Link>
          <span className="sim-tab is-active" aria-current="page">Objectif semestre</span>
        </nav>

        <section className="sim-card" aria-labelledby="progress-title">
          <span className="dash-kicker" id="progress-title">Projection</span>
          <div className="row-between" style={{ alignItems: 'flex-end', gap: 12 }}>
            <div><span className="small muted">Moyenne actuelle</span><div><Grade value={summary.average} size="lg" /></div></div>
            <div style={{ textAlign: 'right' }}><span className="small muted">Objectif visé</span><div className="num" style={{ fontSize: '1.8rem', fontWeight: 760 }}>{number(objective)}<small style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}> / 20</small></div></div>
          </div>
          <ProgressBarInline value={(summary.average / objective) * 100} tone={summary.average >= objective ? 'ok' : 'brand'} />
          <div className="form-grid">
            <Input label="Objectif de moyenne" type="number" min="0" max="20" step="0.5" value={objective} onChange={e => setObjective(Math.min(20, Math.max(0, Number(e.target.value) || 0)))} />
            <Select label="Coefficient de la prochaine évaluation" value={String(coefficient)} onChange={e => setCoefficient(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}</Select>
          </div>
        </section>

        <section className="sim-scenarios" aria-label="Scénarios">
          {plans.map(plan => (
            <button type="button" key={plan.id} className={`sim-scenario ${plan.id === scenarioId ? 'is-active' : ''}`} aria-pressed={plan.id === scenarioId} onClick={() => setScenarioId(plan.id)}>
              <span className="tiny muted" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{plan.label}</span>
              <strong className="num">{number(plan.target)}</strong>
              <span className={`tiny ${plan.feasible ? 'ok-text' : 'warn-text'}`}>{plan.feasible ? 'Faisable' : 'Exigeant'}</span>
            </button>
          ))}
        </section>

        <section className="sim-card" aria-labelledby="need-title">
          <div className="nm-card-top">
            <div><h2 id="need-title">Notes requises par matière</h2><p className="small muted">Scénario {selected.label.toLowerCase()} : {selected.text}</p></div>
          </div>
          <div className="sim-needs">
            {selected.rows.map(({ result, needed, reached }) => {
              const subject = data.subjects.find(s => s.id === result.subjectId);
              return (
                <div key={result.subjectId} className="sim-need" style={{ borderLeftColor: subject?.color ?? 'var(--brand)' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong style={{ display: 'block' }}>{result.subjectName}</strong>
                    <span className="small muted">Coeff {result.coefficient} • moyenne actuelle {number(result.average)} / 20</span>
                    <div style={{ marginTop: 8 }}><StatusBadge status={result.status} short /></div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    {reached
                      ? <span className="ok-text" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}><CheckCircle2 size={16} />Déjà atteint</span>
                      : needed !== null && needed <= 20
                        ? <><strong className="num" style={{ fontSize: '1.4rem', letterSpacing: '-0.03em' }}>{number(needed)}</strong><span className="small muted"> / 20</span></>
                        : <span className="warn-text" style={{ fontWeight: 700 }}>Hors d’atteinte</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <p className="tiny faint">Estimations indicatives : elles supposent que tes autres matières ne changent pas. Aucune note réelle n’est modifiée. Les résultats ne sont pas officiels.</p>
      </div>
    </AppLayout>
  );
}
