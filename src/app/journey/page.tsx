'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, Grade, ProgressBarInline } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { getSummary } from '@/lib/workspace/selectors';
import { number, formatDate } from '@/lib/workspace/dates';
import { ArrowDown, Check, GraduationCap, Clock, Award } from 'lucide-react';

export default function JourneyPage() {
  const { data } = useWorkspace();
  const semesters = useMemo(() => data.semesters.map(semester => ({ semester, summary: getSummary(data, semester.id) })), [data]);
  const total = getSummary(data, 'all');
  const pct = total.totalCredits ? (total.earnedCredits / total.totalCredits) * 100 : 0;

  return (
    <AppLayout title="Parcours">
      <PageHead eyebrow={data.profile.academicYear} title="Parcours académique" description={`${data.profile.formation} · ${data.profile.institution || 'Établissement non renseigné'}`} />
      <div className="split" style={{ alignItems: 'start' }}>
        <div>
          <div className="timeline">
            {semesters.map(({ semester, summary }, index) => {
              const done = summary.hasGrades && summary.validated === data.subjects.filter(s => s.semesterId === semester.id).length && summary.validated > 0;
              const inProgress = summary.hasGrades && !done;
              const credits = data.credits.filter(c => data.subjects.some(s => s.id === c.subjectId && s.semesterId === semester.id));
              const earned = credits.reduce((s, c) => s + c.creditsEarned, 0);
              const totalCredits = credits.reduce((s, c) => s + c.creditsTotal, 0);
              return (
                <article key={semester.id} className="timeline-item rise" style={{ animationDelay: `${index * 0.08}s` }}>
                  <span className={`timeline-node ${done ? 'is-done' : inProgress ? '' : 'is-todo'}`} aria-hidden="true">{done && <Check size={13} />}</span>
                  <div className="panel" style={{ display: 'grid', gap: 14 }}>
                    <div className="row-between">
                      <div><p className="eyebrow" style={{ marginBottom: 2 }}>{semester.name}</p><h2>{totalCredits} crédits prévus</h2></div>
                      {done ? <span className="badge badge-success"><Check size={13} />Validé</span> : inProgress ? <span className="badge badge-info"><Clock size={13} />En cours</span> : <span className="badge badge-outline">À venir</span>}
                    </div>
                    <div className="row" style={{ gap: 28, flexWrap: 'wrap' }}>
                      <div><p className="tiny muted">Moyenne</p>{summary.hasGrades ? <Grade value={summary.average} size="md" /> : <strong className="faint">—</strong>}</div>
                      <div><p className="tiny muted">Crédits</p><strong className="num">{earned} / {totalCredits}</strong></div>
                      <div><p className="tiny muted">Matières validées</p><strong className="num">{summary.validated} / {data.subjects.filter(s => s.semesterId === semester.id).length}</strong></div>
                    </div>
                    <ProgressBarInline value={totalCredits ? (earned / totalCredits) * 100 : 0} tone={done ? 'ok' : 'brand'} />
                    <Link href={`/subjects?semester=${semester.id}`} className="text-link" style={{ justifySelf: 'start' }}>Voir les matières</Link>
                  </div>
                </article>
              );
            })}
            <article className="timeline-item">
              <span className="timeline-node" aria-hidden="true" style={{ borderColor: 'var(--warn)' }}><Award size={12} color="var(--warn)" /></span>
              <div className="panel" style={{ display: 'grid', gap: 10 }}>
                <p className="eyebrow" style={{ marginBottom: 0 }}>Objectif final</p>
                <h2>{data.profile.formation}</h2>
                <p className="small muted">{total.earnedCredits} crédits sur {total.totalCredits} acquis pour le diplôme visé.</p>
                <ProgressBarInline value={pct} />
              </div>
            </article>
          </div>
        </div>
        <aside className="panel stack" style={{ gap: 16 }} aria-label="Repères">
          <h2>Repères</h2>
          <div className="list">
            {data.events.filter(e => e.type === 'EXAM').slice(0, 1).map(e => <div key={e.id} className="list-item"><span className="stat-icon"><GraduationCap size={16} /></span><div className="list-grow"><div className="list-title">{e.title}</div><div className="tiny muted">{formatDate(e.date)}</div></div></div>)}
            {data.goals.filter(g => g.deadline).map(g => <div key={g.id} className="list-item"><span className="stat-icon"><Clock size={16} /></span><div className="list-grow"><div className="list-title">{g.title}</div><div className="tiny muted">Échéance {formatDate(g.deadline!)}</div></div></div>)}
          </div>
          <p className="small muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><ArrowDown size={15} />Chaque semestre se construit à partir de tes notes et de ta formation.</p>
          <p className="tiny faint">Moyenne générale actuelle : {number(total.average)} / 20.</p>
        </aside>
      </div>
    </AppLayout>
  );
}
