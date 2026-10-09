'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Delta, EvolutionChart, Grade, StatCard, StatusBadge, ProgressBarInline, statusMeta } from '@/components/academic';
import { Segmented } from '@/components/ui/segmented';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/states';
import { getEvolution, getGoalProgress, getRevisionPriorities, getSummary, getUpcomingAssignments } from '@/lib/workspace/selectors';
import { countdown, daysUntil, formatDate, number, parseDate } from '@/lib/workspace/dates';
import { AlertTriangle, ArrowRight, BookOpen, CalendarClock, CheckCircle2, CreditCard, Flame, Lightbulb, Plus, Sparkles, Target, Calculator } from 'lucide-react';

export default function DashboardPage() {
  const { data } = useWorkspace();
  const [range, setRange] = useState<'all' | 'recent'>('all');
  const summary = useMemo(() => getSummary(data), [data]);
  const evolution = useMemo(() => getEvolution(data), [data]);
  const priorities = useMemo(() => getRevisionPriorities(data).slice(0, 3), [data]);
  const upcoming = useMemo(() => getUpcomingAssignments(data).slice(0, 4), [data]);
  const goal = data.goals.find(g => g.id === 'goal-average') ?? data.goals[0];
  const goalState = goal ? getGoalProgress(goal, data) : null;
  const delta = data.previousAverage === null || !summary.hasGrades ? 0 : summary.average - data.previousAverage;
  const creditsPct = summary.totalCredits ? (summary.earnedCredits / summary.totalCredits) * 100 : 0;
  const name = data.profile.firstName || 'toi';

  if (!summary.hasGrades && data.subjects.length === 0) {
    return (
      <AppLayout title="Accueil">
        <EmptyState title={`Bonjour, ${name}.`} description="Commence par ajouter ta première matière. Ton tableau de bord se remplira dès que tes notes seront saisies." action={<Link href="/subjects" className="button button-primary"><Plus size={16} />Ajouter une matière</Link>} />
      </AppLayout>
    );
  }

  const filteredEvolution = range === 'recent' ? evolution.slice(-2) : evolution;
  const validatedCount = summary.results.filter(r => r.status === 'VALIDATED').length;
  const weakest = [...summary.results].filter(r => r.grades.length).sort((a, b) => a.average - b.average)[0];

  return (
    <AppLayout title="Accueil">
      <section className="hero-band rise" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">Bonjour, {name}</p>
          <h1 id="hero-title" style={{ color: '#fff' }}>Voici l’état de ton parcours académique.</h1>
          <p>{summary.hasGrades ? `Ta moyenne est ${number(summary.average)}/20 ${delta >= 0 ? 'et progresse' : 'et recule légèrement'} depuis le dernier semestre. ${weakest ? `${weakest.subjectName} reste le point à travailler.` : ''}` : 'Ajoute tes premières notes pour voir ta moyenne.'}</p>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <Link href="/grades/new" className="button button-lg" style={{ background: '#fff', color: '#312e81' }}><Plus size={17} />Ajouter une note</Link>
            <Link href="/simulator" className="button button-lg" style={{ background: 'rgb(255 255 255 / 0.12)', color: '#fff', border: '1px solid rgb(255 255 255 / 0.3)' }}><Calculator size={17} />Simuler</Link>
          </div>
        </div>
        <div className="hero-score" aria-label={`Moyenne générale ${number(summary.average)} sur 20`}>
          <span>Moyenne générale</span>
          <strong className="num">{number(summary.average)}</strong>
          <span>/ 20</span>
          <div style={{ marginTop: 12 }}>{data.previousAverage !== null && <span className="badge" style={{ background: 'rgb(255 255 255 / 0.14)', color: '#fff', border: 0 }}>{delta >= 0 ? '+' : ''}{number(delta)} depuis le dernier semestre</span>}</div>
        </div>
      </section>

      <section className="stats-grid" style={{ marginTop: 18 }} aria-label="Indicateurs clés">
        <StatCard label="Moyenne générale" icon={<Sparkles size={16} />} value={<span className="num">{number(summary.average)}</span>} unit="/20" foot={<><Delta value={delta} suffix=" depuis le dernier semestre" /></>} />
        <StatCard label="Crédits" icon={<CreditCard size={16} />} value={<span className="num">{summary.earnedCredits}</span>} unit={`/ ${summary.totalCredits}`} foot={<><ProgressBarInline value={creditsPct} /></>} />
        <StatCard label="Matières validées" tone="ok" icon={<CheckCircle2 size={16} />} value={<span className="num">{validatedCount}</span>} unit={`/ ${data.subjects.length}`} foot={<>{validatedCount >= data.subjects.length / 2 ? 'Une belle dynamique' : 'Continue, tu avances'}</>} />
        <StatCard label="Objectif" tone={goalState?.achieved ? 'ok' : 'warn'} icon={<Target size={16} />} value={<span className="num">{number(goal?.targetValue ?? 14)}</span>} unit="/20" foot={<><ProgressBarInline value={goalState?.percent ?? 0} tone={goalState?.achieved ? 'ok' : 'brand'} /></>} />
      </section>

      <div className="dashboard-grid">
        <section className="panel" aria-labelledby="evolution-title">
          <div className="panel-head">
            <div><h2 id="evolution-title">Évolution de la moyenne</h2><p>Chaque point correspond à une date d’évaluation saisie.</p></div>
            <Segmented label="Période" value={range} onChange={setRange} options={[{ value: 'all', label: 'Tout' }, { value: 'recent', label: 'Récent' }]} />
          </div>
          <EvolutionChart points={filteredEvolution.map(p => ({ label: p.label, value: p.value }))} target={goal?.targetValue} />
          <div className="chart-legend"><span><i style={{ background: '#4f46e5' }} />Ta moyenne</span><span><i style={{ background: 'var(--warn)' }} />Objectif {number(goal?.targetValue ?? 14)}</span></div>
        </section>

        <section className="panel" aria-labelledby="situation-title">
          <div className="panel-head"><div><h2 id="situation-title">Situation académique</h2><p>Matières classées par niveau d’attention.</p></div><Link href="/subjects" className="text-link">Voir tout <ArrowRight size={14} /></Link></div>
          <div className="list">
            {[...summary.results].filter(r => r.grades.length).sort((a, b) => a.average - b.average).slice(0, 6).map(result => (
              <Link href={`/subjects/${result.subjectId}`} key={result.subjectId} className="list-item" style={{ padding: '12px 0' }}>
                <span className="color-bar" style={{ background: data.subjects.find(s => s.id === result.subjectId)?.color ?? 'var(--brand)', alignSelf: 'stretch', width: 4, borderRadius: 4 }} />
                <div className="list-grow"><div className="list-title">{result.subjectName}</div><div className="tiny muted">Coeff {result.coefficient} · {result.credits} crédits</div></div>
                <StatusBadge status={result.status} short />
                <Grade value={result.average} size="sm" />
              </Link>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="deadline-title">
          <div className="panel-head"><div><h2 id="deadline-title">Prochaines échéances</h2><p>Examens et devoirs à anticiper.</p></div><Link href="/assignments" className="text-link">Toutes <ArrowRight size={14} /></Link></div>
          <div className="stack" style={{ gap: 10 }}>
            {upcoming.length === 0 && <p className="muted">Aucune échéance à venir. Profite-en pour réviser.</p>}
            {upcoming.map(item => {
              const date = parseDate(item.dueDate);
              const isExam = ['EXAMEN', 'PARTIEL', 'EXAMEN_FINAL', 'RATTRAPAGE'].includes(item.type);
              const subject = data.subjects.find(s => s.id === item.subjectId);
              return (
                <div key={item.id} className={`deadline ${isExam ? 'is-exam' : ''}`}>
                  <div className="date-tile"><b>{date.getDate()}</b><span>{date.toLocaleDateString('fr-FR', { month: 'short' })}</span></div>
                  <div style={{ minWidth: 0 }}><strong style={{ display: 'block' }}>{subject?.name}</strong><span className="small muted">{item.title}</span><span className="tiny muted" style={{ display: 'block' }}>{isExam ? 'Examen' : 'Devoir'} · Coeff {item.coefficient}</span></div>
                  <span className={`badge ${isExam ? 'badge-danger' : 'badge-outline'}`}>{countdown(item.dueDate)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="stack">
          <section className="panel" aria-labelledby="reco-title">
            <div className="recommend">
              <span className="recommend-icon"><Lightbulb size={20} /></span>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>Recommandation</p>
                <h2 id="reco-title" style={{ fontSize: '1.02rem' }}>{priorities.length >= 2 ? `Tes deux matières prioritaires cette semaine sont ${priorities[0].subjectName} et ${priorities[1].subjectName}.` : 'Ajoute des échéances pour recevoir une recommandation.'}</h2>
                <p className="small muted" style={{ marginTop: 6 }}>Basé sur la date de tes évaluations, leur coefficient et ta moyenne actuelle.</p>
                <Link href="/study-planner" className="text-link" style={{ marginTop: 12 }}>Voir mon plan de révision <ArrowRight size={14} /></Link>
              </div>
            </div>
          </section>
          <section className="panel" aria-labelledby="progress-title">
            <div className="panel-head"><div><h2 id="progress-title">Crédits ECTS</h2><p>Progression vers 60 crédits.</p></div></div>
            <div className="row" style={{ gap: 20 }}>
              <ProgressRing value={creditsPct} size={112} stroke={9} label="Crédits acquis"><strong className="num" style={{ fontSize: '1.4rem' }}>{summary.earnedCredits}</strong><div className="tiny muted">/ {summary.totalCredits}</div></ProgressRing>
              <div className="stack" style={{ gap: 8, flex: 1 }}>
                <span className="small muted">Acquis</span><strong>{summary.earnedCredits} crédits</strong>
                <span className="small muted">En attente</span><strong>{summary.pendingCredits} crédits</strong>
              </div>
            </div>
          </section>
          <section className="panel" aria-labelledby="focus-title">
            <h2 id="focus-title" style={{ marginBottom: 14 }}>Aujourd’hui</h2>
            <div className="list">
              {priorities.map((p, i) => (
                <div key={p.subjectId} className="list-item">
                  <span className="stat-icon">{i === 0 ? <Flame size={16} /> : <BookOpen size={16} />}</span>
                  <div className="list-grow"><div className="list-title">{p.subjectName}</div><div className="tiny muted">{p.next ? `${p.next.title} · ${countdown(p.next.dueDate).toLowerCase()}` : 'Aucune échéance proche'}</div></div>
                  <Link href={`/study-planner`} className="button button-ghost button-sm">Réviser</Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      {data.isDemo && <p className="small faint" style={{ marginTop: 22 }}>Données fictives pour la démonstration. Ajoute tes propres notes depuis « Notes & matières ».</p>}
    </AppLayout>
  );
}
