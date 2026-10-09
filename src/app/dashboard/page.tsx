'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Delta, EvolutionChart, Grade, StatusBadge } from '@/components/academic';
import { Segmented } from '@/components/ui/segmented';
import { EmptyState } from '@/components/ui/states';
import { getEvolution, getGoalProgress, getRevisionPriorities, getSummary, getUpcomingAssignments } from '@/lib/workspace/selectors';
import { countdown, number, parseDate } from '@/lib/workspace/dates';
import { ArrowRight, CalendarClock, Lightbulb, Plus, Target, Calculator } from 'lucide-react';

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
  const semester = data.semesters.find(s => s.id === data.activeSemesterId);
  const target = goal?.targetValue ?? 14;

  if (!summary.hasGrades && data.subjects.length === 0) {
    return (
      <AppLayout title="Accueil">
        <EmptyState title={`Bonjour, ${name}.`} description="Commence par ajouter ta première matière. Ton tableau de bord se remplira dès que tes notes seront saisies." action={<Link href="/subjects" className="button button-primary"><Plus size={16} />Ajouter une matière</Link>} />
      </AppLayout>
    );
  }

  const filteredEvolution = range === 'recent' ? evolution.slice(-2) : evolution;
  const validatedCount = summary.results.filter(r => r.status === 'VALIDATED').length;
  const subjectCount = data.subjects.length || 1;
  const validatedPct = (validatedCount / subjectCount) * 100;
  const weakest = [...summary.results].filter(r => r.grades.length).sort((a, b) => a.average - b.average)[0];
  const recommendation = priorities.length >= 2
    ? <>Tes deux matières cibles sont <strong>{priorities[0].subjectName}</strong> et <strong>{priorities[1].subjectName}</strong>{priorities[0].next ? ` (${countdown(priorities[0].next.dueDate).toLowerCase()})` : ''}.</>
    : 'Ajoute des échéances pour recevoir une recommandation.';

  return (
    <AppLayout title="Accueil">
      <div className="dash">
        <section className="dash-head rise" aria-labelledby="hero-title">
          <div style={{ minWidth: 0 }}>
            <span className="dash-chip"><i aria-hidden="true" />{data.profile.formation}</span>
            <h1 id="hero-title">Bonjour, {name}</h1>
            <p>Voici l’état de ton parcours académique en temps réel.</p>
          </div>
          {semester && <span className="dash-semester">{semester.name}</span>}
        </section>

        <section className="dash-card dash-hero" aria-label={`Moyenne générale ${number(summary.average)} sur 20`}>
          <div>
            <span className="dash-kicker">Moyenne générale</span>
            <div className="dash-big num">{number(summary.average)}<small>/ 20</small></div>
            <p className="small muted" style={{ marginTop: 10 }}>
              {summary.hasGrades ? `${delta >= 0 ? 'Progression constante' : 'Légère baisse'}${data.previousAverage !== null ? ' depuis le dernier semestre' : ''}. ${weakest ? `${weakest.subjectName} reste le point à travailler.` : ''}` : 'Ajoute tes premières notes pour voir ta moyenne.'}
            </p>
          </div>
          {data.previousAverage !== null && <Delta value={delta} suffix=" pts" />}
        </section>

        <section className="dash-stats" aria-label="Indicateurs clés">
          <div className="dash-stat">
            <span className="dash-kicker">Crédits ECTS</span>
            <strong className="num">{summary.earnedCredits}<small>/{summary.totalCredits}</small></strong>
            <div className="dash-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, creditsPct)}%` }} /></div>
          </div>
          <div className="dash-stat">
            <span className="dash-kicker">Validées</span>
            <strong className="num">{validatedCount}<small>/{data.subjects.length}</small></strong>
            <div className="dash-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, validatedPct)}%`, background: 'var(--ok)' }} /></div>
          </div>
          <div className="dash-stat">
            <span className="dash-kicker">Objectif</span>
            <strong className="num">{number(target)}</strong>
            <div className="dash-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, goalState?.percent ?? 0)}%`, background: goalState?.achieved ? 'var(--ok)' : 'var(--warn)' }} /></div>
          </div>
        </section>

        <section className="dash-callout" aria-labelledby="reco-title">
          <span className="dash-callout-icon"><Lightbulb size={18} /></span>
          <div style={{ minWidth: 0 }}>
            <p className="eyebrow" id="reco-title" style={{ marginBottom: 4 }}>Priorité académique de la semaine</p>
            <p className="small" style={{ color: 'var(--text)' }}>{recommendation}</p>
            <Link href="/study-planner" className="text-link small" style={{ marginTop: 8 }}>Voir mon plan de révision <ArrowRight size={14} /></Link>
          </div>
        </section>

        <section className="dash-card" aria-labelledby="evolution-title">
          <div className="dash-section-head">
            <div style={{ minWidth: 0 }}>
              <h2 id="evolution-title">Évolution des notes</h2>
              <p className="small muted">Une valeur par date d’évaluation saisie.</p>
            </div>
            <Segmented label="Période" value={range} onChange={setRange} options={[{ value: 'all', label: 'Tout' }, { value: 'recent', label: 'Récent' }]} />
          </div>
          <EvolutionChart points={filteredEvolution.map(p => ({ label: p.label, value: p.value }))} target={goal?.targetValue} />
          <div className="chart-legend"><span><i style={{ background: '#4f46e5' }} />Ta moyenne</span><span><i style={{ background: 'var(--warn)' }} />Objectif {number(target)}</span></div>
        </section>

        <div className="dash-two">
          <section aria-labelledby="deadline-title">
            <div className="dash-section-head">
              <h2 id="deadline-title">Prochaines échéances</h2>
              <Link href="/assignments" className="text-link small">Voir le planning <ArrowRight size={14} /></Link>
            </div>
            <div className="stack" style={{ gap: 10, marginTop: 12 }}>
              {upcoming.length === 0 && <p className="muted small">Aucune échéance à venir. Profite-en pour réviser.</p>}
              {upcoming.map(item => {
                const date = parseDate(item.dueDate);
                const isExam = ['EXAMEN', 'PARTIEL', 'EXAMEN_FINAL', 'RATTRAPAGE'].includes(item.type);
                const subject = data.subjects.find(s => s.id === item.subjectId);
                return (
                  <div key={item.id} className="dash-row">
                    <span className={`dash-row-icon ${isExam ? 'is-danger' : ''}`}><CalendarClock size={17} /></span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ display: 'block' }}>{subject?.name}</strong>
                      <span className="small muted">{item.title} · {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · Coeff {item.coefficient}</span>
                    </div>
                    <span className={`badge ${isExam ? 'badge-danger' : 'badge-outline'}`}>{countdown(item.dueDate)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="subjects-title">
            <div className="dash-section-head">
              <div>
                <h2 id="subjects-title">Matières & performances</h2>
                <p className="small muted">Synthèse par matière, la plus fragile en premier.</p>
              </div>
              <Link href="/subjects" className="text-link small">Toutes <ArrowRight size={14} /></Link>
            </div>
            <div className="stack" style={{ gap: 10, marginTop: 12 }}>
              {summary.results.filter(r => r.grades.length).sort((a, b) => a.average - b.average).slice(0, 6).map(result => (
                <Link href={`/subjects/${result.subjectId}`} key={result.subjectId} className="dash-row">
                  <span className="color-bar" style={{ background: data.subjects.find(s => s.id === result.subjectId)?.color ?? 'var(--brand)', alignSelf: 'stretch', width: 4, borderRadius: 4 }} aria-hidden="true" />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong style={{ display: 'block' }}>{result.subjectName}</strong>
                    <span className="small muted">Coefficient {result.coefficient} • {result.credits} crédits</span>
                  </div>
                  <div className="dash-row-end">
                    <Grade value={result.average} size="sm" />
                    <StatusBadge status={result.status} short />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="dash-cta" aria-labelledby="boost-title">
          <span className="dash-callout-icon" style={{ background: 'rgb(255 255 255 / 0.16)', color: '#fff' }}><Target size={18} /></span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 id="boost-title" style={{ color: '#fff', fontSize: '1rem' }}>Besoin d’un coup de boost ?</h2>
            <p className="small" style={{ color: 'rgb(255 255 255 / 0.82)' }}>Simule l’impact d’une note sur ta moyenne générale.</p>
          </div>
          <Link href="/simulator" className="button button-sm" style={{ background: '#fff', color: '#312e81' }}><Calculator size={15} />Simuler</Link>
        </section>

        {data.isDemo && <p className="small faint" style={{ textAlign: 'center' }}>Données fictives pour la démonstration. Ajoute tes propres notes depuis « Notes & matières ».</p>}
      </div>
    </AppLayout>
  );
}
