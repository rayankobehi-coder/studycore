'use client';
import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, StatCard, Delta, EvolutionChart, SubjectBars, DistributionChart, Grade } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { EmptyState } from '@/components/ui/states';
import { getEngine, getEvolution, getSubjectResults, getSummary } from '@/lib/workspace/selectors';
import { number } from '@/lib/workspace/dates';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from '@/components/academic';
import { BarChart3, Trophy, TrendingDown, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { data } = useWorkspace();
  const summary = useMemo(() => getSummary(data), [data]);
  const results = useMemo(() => getSubjectResults(data).filter(r => r.grades.length), [data]);
  const evolution = useMemo(() => getEvolution(data), [data]);
  const best = [...results].sort((a, b) => b.average - a.average)[0];
  const weakest = [...results].sort((a, b) => a.average - b.average)[0];
  const delta = data.previousAverage === null ? 0 : summary.average - data.previousAverage;
  const unitData = useMemo(() => {
    const engine = getEngine(data);
    const map = new Map<string, { name: string; items: { value: number; weight: number }[] }>();
    results.forEach(r => {
      const unitId = data.subjects.find(s => s.id === r.subjectId)?.unitId ?? 'autre';
      const label = { informatique: 'Informatique', langues: 'Langues', sciences: 'Sciences', professionnel: 'Pro & gestion' }[unitId] ?? 'Autres';
      const bucket = map.get(unitId) ?? { name: label, items: [] };
      bucket.items.push({ value: r.average, weight: r.coefficient });
      map.set(unitId, bucket);
    });
    return [...map.values()].map(b => ({ name: b.name, value: engine.weightedAverage(b.items) }));
  }, [data, results]);

  if (!summary.hasGrades) return <AppLayout title="Analytics"><EmptyState title="Pas encore assez de données." description="Ajoute tes premières notes : les analyses se dessinent dès la première évaluation." /></AppLayout>;

  return (
    <AppLayout title="Analytics">
      <PageHead eyebrow="Analyse" title="Mes performances" description="Une lecture calme de ton parcours : où tu progresses, ce qui demande de l’attention." />
      <section className="stats-grid" aria-label="Indicateurs">
        <StatCard label="Moyenne générale" icon={<BarChart3 size={16} />} value={<span className="num">{number(summary.average)}</span>} unit="/20" />
        <StatCard label="Évolution" tone={delta < 0 ? 'danger' : 'ok'} icon={delta < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />} value={<span className="num">{delta >= 0 ? '+' : ''}{number(delta)}</span>} foot={<>depuis le dernier semestre</>} />
        <StatCard label="Meilleure matière" tone="ok" icon={<Trophy size={16} />} value={<span className="num" style={{ fontSize: '1.45rem' }}>{best?.subjectName}</span>} foot={<>{best && <Grade value={best.average} size="sm" />}</>} />
        <StatCard label="Matière la plus faible" tone="warn" value={<span className="num" style={{ fontSize: '1.45rem' }}>{weakest?.subjectName}</span>} foot={<>{weakest && <Grade value={weakest.average} size="sm" />}</>} />
      </section>
      <div className="two-col" style={{ marginTop: 20 }}>
        <section className="panel" aria-labelledby="ev"><div className="panel-head"><div><h2 id="ev">Graphique d’évolution</h2><p>Moyenne cumulée selon les dates d’évaluation.</p></div></div><EvolutionChart points={evolution.map(p => ({ label: p.label, value: p.value }))} target={data.goals.find(g => g.id === 'goal-average')?.targetValue} height={280} /></section>
        <section className="panel" aria-labelledby="dist"><div className="panel-head"><div><h2 id="dist">Répartition des résultats</h2><p>Matières par statut.</p></div></div><DistributionChart results={summary.results} /></section>
      </div>
      <div className="two-col" style={{ marginTop: 20 }}>
        <section className="panel" aria-labelledby="bysub"><div className="panel-head"><div><h2 id="bysub">Par matière</h2><p>Moyenne actuelle de chaque matière.</p></div></div><SubjectBars results={results} height={320} /></section>
        <section className="panel" aria-labelledby="byue"><div className="panel-head"><div><h2 id="byue">Par UE</h2><p>Moyenne pondérée par unité d’enseignement.</p></div></div>
          <div className="chart-box" style={{ height: 320 }} role="img" aria-label={`Moyenne par UE : ${unitData.map(u => `${u.name} ${number(u.value)}`).join(', ')}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-2)', fontSize: 12 }} />
                <YAxis domain={[0, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-2)' }} />
                <Bar dataKey="value" radius={[10, 10, 4, 4]} name="Moyenne" barSize={46}>{unitData.map((u, i) => <Cell key={u.name} fill={['#4f46e5', '#0f9d6b', '#f2b35a', '#7cb8ff'][i % 4]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <p className="tiny faint" style={{ marginTop: 22 }}>Analyses indicatives, calculées à partir des notes saisies. Elles ne constituent pas des résultats officiels.</p>
    </AppLayout>
  );
}
