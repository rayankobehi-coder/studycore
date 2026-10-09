'use client';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, Grade, StatusBadge } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Select, Input } from '@/components/ui/fields';
import { Segmented } from '@/components/ui/segmented';
import { EmptyState } from '@/components/ui/states';
import { getSubjectResults, simulateSubject } from '@/lib/workspace/selectors';
import { formatDate, number } from '@/lib/workspace/dates';
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from '@/components/academic';
import { ArrowRight, Calculator, Target, RotateCcw, FlaskConical } from 'lucide-react';

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
  const [mode, setMode] = useState<'exam' | 'objective'>('exam');

  const validRequest = requested && data.subjects.some(s => s.id === requested) ? requested : null;
  const subjectId = chosenSubject ?? validRequest ?? data.subjects[0]?.id ?? '';
  const setSubjectId = setChosenSubject;

  const subject = data.subjects.find(s => s.id === subjectId);
  const results = useMemo(() => getSubjectResults(data, 'all'), [data]);
  const current = results.find(r => r.subjectId === subjectId);
  const simulation = useMemo(() => subject ? simulateSubject(data, subject, examGrade, coefficient, objective) : null, [data, subject, examGrade, coefficient, objective]);
  const curve = useMemo(() => subject ? Array.from({ length: 8 }, (_, i) => 6 + i * 2).map(grade => ({ grade, final: simulateSubject(data, subject, grade, coefficient, objective).average })) : [], [data, subject, coefficient, objective]);

  if (data.subjects.length === 0) return <AppLayout title="Simulateur"><EmptyState title="Aucune matière à simuler." description="Ajoute une matière et quelques notes pour tester différents scénarios." action={<Link href="/subjects" className="button button-primary">Ajouter une matière</Link>} /></AppLayout>;

  const delta = current?.grades.length && simulation ? simulation.average - current.average : 0;
  const required = simulation?.required ?? null;
  const reachable = required !== null && required <= data.rules.gradingScale;

  return (
    <AppLayout title="Simulateur">
      <PageHead eyebrow="Simulation" title="Simulateur" description="Teste différents scénarios sans modifier tes vraies notes." actions={<button type="button" className="button button-ghost" onClick={() => { setExamGrade(16); setCoefficient(4); setObjective(10); }}><RotateCcw size={16} />Réinitialiser</button>} />
      <div className="row-between" style={{ marginBottom: 20 }}>
        <Segmented label="Mode" value={mode} onChange={setMode} options={[{ value: 'exam', label: 'Note future' }, { value: 'objective', label: 'Combien me faut-il ?' }]} />
        <div className="row small muted"><FlaskConical size={16} />Mode simulation : rien n’est enregistré</div>
      </div>
      <div className="split">
        <section className="panel stack" aria-labelledby="current-title" style={{ gap: 18 }}>
          <div className="row-between"><h2 id="current-title">Notes actuelles</h2><span className="badge badge-brand">Réel</span></div>
          <Select label="Matière" value={subjectId} onChange={e => setSubjectId(e.target.value)}>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
          {current && (
            <div className="surface-soft" style={{ padding: 20, display: 'grid', gap: 10 }}>
              <span className="small muted">Moyenne actuelle</span>
              {current.grades.length ? <Grade value={current.average} size="lg" /> : <span className="muted">Pas encore de note</span>}
              <div className="row" style={{ gap: 8 }}><StatusBadge status={current.status} /><span className="small muted">coeff. {current.coefficient}</span></div>
            </div>
          )}
          <div className="list">
            {data.assessments.filter(a => a.subjectId === subjectId).map(a => {
              const g = data.grades.find(x => x.assessmentId === a.id);
              return (
                <div key={a.id} className="list-item" style={{ padding: '10px 0' }}>
                  <div className="list-grow"><div className="list-title" style={{ fontSize: '0.9rem' }}>{a.name}</div><div className="tiny muted">{formatDate(a.date)} · coeff. {a.coefficient}</div></div>
                  <strong className="num">{g ? `${number(g.value, g.scale === 20 ? 2 : 2)}/${g.scale}` : '—'}</strong>
                </div>
              );
            })}
          </div>
          <Link href={`/subjects/${subjectId}`} className="text-link">Ouvrir la matière <ArrowRight size={14} /></Link>
          <Link href="/simulator/semester" className="button button-outline"><Target size={16} />Objectif semestre</Link>
        </section>

        <section className="panel stack" aria-labelledby="sim-title" style={{ gap: 20 }}>
          <div className="row-between"><h2 id="sim-title">Simulation</h2><span className="badge badge-outline">Fictif</span></div>
          {mode === 'exam' ? (
            <>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="exam-grade">Note à l’examen</label>
                  <div className="row" style={{ gap: 12 }}>
                    <input id="exam-grade" type="range" min="0" max="20" step="0.25" value={examGrade} onChange={e => setExamGrade(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--brand)' }} />
                    <Input label="" aria-label="Note simulée" type="number" min="0" max="20" step="0.25" value={examGrade} onChange={e => setExamGrade(Math.min(20, Math.max(0, Number(e.target.value) || 0)))} style={{ width: 96 }} />
                  </div>
                </div>
                <Select label="Coefficient de l’examen" value={String(coefficient)} onChange={e => setCoefficient(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              {simulation && (
                <div className="result-band">
                  <span className="small muted">Résultat simulé</span>
                  <div className="row" style={{ alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                    <span className="big-number" style={{ fontSize: '3.4rem' }}>{number(simulation.average)}<small>/20</small></span>
                    {current?.grades.length ? <span className={`delta ${delta < 0 ? 'down' : ''}`}>{delta >= 0 ? '+' : ''}{number(delta)} vs actuel</span> : null}
                  </div>
                  <span className="small muted">Estimation indicative appliquant les règles de ta formation.</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="form-grid">
                <Input label="Objectif sur la matière" type="number" min="0" max="20" step="0.5" value={objective} onChange={e => setObjective(Math.min(20, Math.max(0, Number(e.target.value) || 0)))} />
                <Select label="Coefficient de l’évaluation" value={String(coefficient)} onChange={e => setCoefficient(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="result-band">
                <span className="small muted">Pour atteindre {number(objective)} / 20</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 650, letterSpacing: '-0.02em' }}>
                  {required === null ? 'Ajoute une évaluation pour estimer la note nécessaire.' : reachable ? `Tu dois obtenir au minimum ${number(required)} / 20.` : `Objectif hors d’atteinte avec cette évaluation (il faudrait ${number(required)} / 20).`}
                </p>
                <span className="small muted">Estimation : une seule évaluation de coefficient {coefficient} reste à venir.</span>
              </div>
            </>
          )}
          <div>
            <div className="row-between" style={{ marginBottom: 6 }}><h3>Note examen → moyenne finale</h3><span className="tiny muted">matière {subject?.name}</span></div>
            <div className="chart-box" style={{ height: 230 }} role="img" aria-label={`Courbe : ${curve.map(p => `${p.grade} donne ${number(p.final)}`).join(', ')}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve} margin={{ top: 14, right: 16, bottom: 0, left: -16 }}>
                  <defs><linearGradient id="sim" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} /><stop offset="100%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 6" />
                  <XAxis dataKey="grade" ticks={[6, 8, 10, 12, 14, 16, 18, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                  <YAxis domain={[0, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="final" name="Moyenne finale" stroke="#4f46e5" strokeWidth={2.6} fill="url(#sim)" />
                  {mode === 'exam' && simulation && <ReferenceDot x={examGrade} y={simulation.average} r={6} fill="#4f46e5" stroke="#fff" strokeWidth={2} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="tiny faint">Le graphique suppose que la note de l’évaluation est ta seule inconnue. Les résultats ne sont pas officiels.</p>
        </section>
      </div>
    </AppLayout>
  );
}
