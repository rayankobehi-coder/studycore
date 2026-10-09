'use client';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Grade, StatusBadge, ChartTooltip } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Select, Input } from '@/components/ui/fields';
import { EmptyState } from '@/components/ui/states';
import { getSubjectResults, simulateSubject } from '@/lib/workspace/selectors';
import { formatDate, number } from '@/lib/workspace/dates';
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Minus, Plus, RotateCcw, Target } from 'lucide-react';

const presets = [10, 12, 14, 15];

export default function SimulatorPage() {
  return <Suspense fallback={null}><Simulator /></Suspense>;
}

function Simulator() {
  const { data } = useWorkspace();
  const searchParams = useSearchParams();
  const requested = searchParams.get('subject');
  const [chosenSubject, setChosenSubject] = useState<string | null>(null);
  const [examGrade, setExamGrade] = useState(16);
  const [coefficient, setCoefficient] = useState(4);
  const [objective, setObjective] = useState(10);

  const validRequest = requested && data.subjects.some(s => s.id === requested) ? requested : null;
  const subjectId = chosenSubject ?? validRequest ?? data.subjects[0]?.id ?? '';

  const subject = data.subjects.find(s => s.id === subjectId);
  const results = useMemo(() => getSubjectResults(data, 'all'), [data]);
  const current = results.find(r => r.subjectId === subjectId);
  const simulation = useMemo(() => subject ? simulateSubject(data, subject, examGrade, coefficient, objective) : null, [data, subject, examGrade, coefficient, objective]);
  const curve = useMemo(() => subject ? Array.from({ length: 8 }, (_, i) => 6 + i * 2).map(grade => ({ grade, final: simulateSubject(data, subject, grade, coefficient, objective).average })) : [], [data, subject, coefficient, objective]);

  if (data.subjects.length === 0) return <AppLayout title="Simulateur"><EmptyState title="Aucune matière à simuler." description="Ajoute une matière et quelques notes pour tester différents scénarios." action={<Link href="/subjects" className="button button-primary">Ajouter une matière</Link>} /></AppLayout>;

  const delta = current?.grades.length && simulation ? simulation.average - current.average : 0;
  const required = simulation?.required ?? null;
  const reachable = required !== null && required <= data.rules.gradingScale;
  const clamp = (value: number) => Math.min(20, Math.max(0, value));

  return (
    <AppLayout title="Simulateur">
      <div className="sim">
        <header className="nm-head">
          <div style={{ minWidth: 0 }}>
            <h1>Simulateur</h1>
            <p>Teste différents scénarios sans modifier tes vraies notes.</p>
          </div>
          <span className="badge badge-brand">Mode simulation</span>
        </header>

        <nav className="sim-tabs" aria-label="Type de simulation">
          <span className="sim-tab is-active" aria-current="page">Par matière</span>
          <Link href="/simulator/semester" className="sim-tab">Objectif semestre</Link>
        </nav>

        <section className="sim-card" aria-label="Matière ciblée">
          <div className="nm-card-top">
            <div style={{ minWidth: 0, flex: 1 }}>
              <span className="dash-kicker">Matière ciblée</span>
              <div style={{ marginTop: 6 }}>
                <Select label="Matière" value={subjectId} onChange={e => setChosenSubject(e.target.value)}>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
              </div>
            </div>
            <span className="as-coeff">Coeff {subject?.coefficient}</span>
          </div>
          <div className="row-between" style={{ marginTop: 10 }}>
            <span className="small muted">Moyenne actuelle enregistrée</span>
            {current?.grades.length ? <Grade value={current.average} size="sm" /> : <span className="muted small">Pas encore de note</span>}
          </div>
          {current && <div className="row" style={{ gap: 8, marginTop: 8 }}><StatusBadge status={current.status} /><span className="small muted">{current.credits} crédits</span></div>}
          <div className="sim-list">
            {data.assessments.filter(a => a.subjectId === subjectId).map(a => {
              const g = data.grades.find(x => x.assessmentId === a.id);
              return (
                <div key={a.id} className="sim-list-row">
                  <span style={{ minWidth: 0 }}>{a.name}<span className="tiny muted" style={{ display: 'block' }}>{formatDate(a.date)} · coeff. {a.coefficient}</span></span>
                  <strong className="num">{g ? `${number(g.value)}/${g.scale}` : '—'}</strong>
                </div>
              );
            })}
          </div>
          <Link href={`/subjects/${subjectId}`} className="text-link small" style={{ marginTop: 12 }}>Ouvrir la matière <ArrowRight size={14} /></Link>
        </section>

        <section className="sim-card" aria-labelledby="sim-title">
          <div className="nm-card-top">
            <div><span className="dash-kicker">Simulation en direct</span><h2 id="sim-title" style={{ marginTop: 6 }}>Examen final</h2></div>
            <span className="badge badge-outline">Pondération {coefficient}</span>
          </div>

          <div className="sim-hero">
            <span className="small muted">Note d’épreuve projetée</span>
            <strong className="num">{number(examGrade)}<small> / 20</small></strong>
            <div className="sim-stepper">
              <button type="button" className="icon-button" aria-label="Diminuer la note" onClick={() => setExamGrade(v => clamp(v - 0.5))}><Minus size={16} /></button>
              <input type="range" min="0" max="20" step="0.25" value={examGrade} aria-label="Note à l’examen" onChange={e => setExamGrade(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--brand)' }} />
              <button type="button" className="icon-button" aria-label="Augmenter la note" onClick={() => setExamGrade(v => clamp(v + 0.5))}><Plus size={16} /></button>
            </div>
          </div>

          <div className="form-grid">
            <Input label="Note à l’examen (0 à 20)" type="number" min="0" max="20" step="0.25" value={examGrade} onChange={e => setExamGrade(clamp(Number(e.target.value) || 0))} />
            <Select label="Coefficient de l’examen" value={String(coefficient)} onChange={e => setCoefficient(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>

          {simulation && (
            <div className="sim-results">
              <div><span className="tiny muted">Moyenne matière</span><strong className="num">{number(simulation.average)}<small> / 20</small></strong>{current?.grades.length ? <span className={`delta ${delta < 0 ? 'down' : ''}`}>{delta >= 0 ? '+' : ''}{number(delta)} pts</span> : null}</div>
              <div><span className="tiny muted">Note visée</span><strong className="num">{number(objective)}<small> / 20</small></strong><span className="tiny muted">seuil de validation {number(data.rules.passingGrade)}</span></div>
            </div>
          )}

          <div>
            <div className="row-between" style={{ marginBottom: 6 }}><h3>Projection de la moyenne finale</h3><span className="tiny muted">seuil {number(data.rules.passingGrade)}/20</span></div>
            <div className="chart-box" style={{ height: 220 }} role="img" aria-label={`Courbe : ${curve.map(p => `${p.grade} donne ${number(p.final)}`).join(', ')}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve} margin={{ top: 14, right: 16, bottom: 0, left: -16 }}>
                  <defs><linearGradient id="sim" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} /><stop offset="100%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 6" />
                  <XAxis dataKey="grade" ticks={[6, 8, 10, 12, 14, 16, 18, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                  <YAxis domain={[0, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="final" name="Moyenne finale" stroke="#4f46e5" strokeWidth={2.6} fill="url(#sim)" />
                  {simulation && <ReferenceDot x={examGrade} y={simulation.average} r={6} fill="#4f46e5" stroke="#fff" strokeWidth={2} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="sim-card" aria-labelledby="calc-title">
          <div className="nm-card-top">
            <div><span className="dash-kicker">Calculateur d’objectif</span><h2 id="calc-title" style={{ marginTop: 6 }}>Combien me faut-il ?</h2></div>
          </div>
          <div className="sim-presets" role="group" aria-label="Objectifs rapides">
            {presets.map(value => <button type="button" key={value} className={`sim-preset ${objective === value ? 'is-active' : ''}`} aria-pressed={objective === value} onClick={() => setObjective(value)}>{value}/20</button>)}
          </div>
          <Input label="Objectif sur la matière" type="number" min="0" max="20" step="0.5" value={objective} onChange={e => setObjective(clamp(Number(e.target.value) || 0))} />
          <div className="sim-required">
            <span className="small muted">Pour atteindre {number(objective)} / 20</span>
            <p>{required === null ? 'Ajoute une évaluation pour estimer la note nécessaire.' : reachable ? <>Note minimale requise : <strong className="num">{number(required)} / 20</strong></> : <>Objectif hors d’atteinte avec cette évaluation (il faudrait {number(required)} / 20).</>}</p>
            <span className="tiny muted">Estimation indicative, une seule évaluation de coefficient {coefficient} reste à venir.</span>
          </div>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="button button-ghost button-sm" onClick={() => { setExamGrade(16); setCoefficient(4); setObjective(10); }}><RotateCcw size={15} />Réinitialiser les valeurs</button>
            <Link href="/simulator/semester" className="button button-secondary button-sm"><Target size={15} />Objectif semestre</Link>
          </div>
        </section>

        <p className="tiny faint">Mode simulation : rien n’est enregistré. Les résultats ne sont pas officiels.</p>
      </div>
    </AppLayout>
  );
}
