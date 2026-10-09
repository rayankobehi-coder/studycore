'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, StatusBadge, ProgressBarInline } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, Input } from '@/components/ui/fields';
import { EmptyState } from '@/components/ui/states';
import { getRevisionPriorities } from '@/lib/workspace/selectors';
import { countdown, dateKey, minutes, timeFromMinutes, uid, number } from '@/lib/workspace/dates';
import { Brain, Check, Clock, Coffee, Plus, Sparkles, Target, Undo2, Timer, HelpCircle } from 'lucide-react';
import type { Workspace } from '@/lib/workspace/types';

function level(score: number) {
  if (score >= 22) return { label: 'Priorité haute', badge: 'badge-danger', minutes: 90 };
  if (score >= 14) return { label: 'Priorité moyenne', badge: 'badge-warning', minutes: 60 };
  return { label: 'Priorité faible', badge: 'badge-success', minutes: 30 };
}

export default function StudyPlannerPage() {
  const { data, update } = useWorkspace();
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ subjectId: '', start: '18:00', duration: '60' });
  const priorities = useMemo(() => getRevisionPriorities(data), [data]);
  const today = dateKey();
  const sessions = useMemo(() => data.sessions.filter(s => s.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime)), [data.sessions, today]);
  const done = sessions.filter(s => s.completed).length;

  // Timeline: sessions interleaved with the real gaps, which are shown as breaks.
  type Entry = { kind: 'session'; item: (typeof sessions)[number] } | { kind: 'break'; start: string; end: string };
  const timeline: Entry[] = sessions.flatMap((session, index): Entry[] => {
    const previous = sessions[index - 1];
    const gap = previous ? minutes(session.startTime) - minutes(previous.endTime) : 0;
    const items: Entry[] = [];
    if (previous && gap >= 10) items.push({ kind: 'break', start: previous.endTime, end: session.startTime });
    items.push({ kind: 'session', item: session });
    return items;
  });

  function generatePlan() {
    const top = priorities.filter(p => p.coefficient > 0).slice(0, 2);
    if (top.length === 0) return;
    update((current: Workspace) => {
      const kept = current.sessions.filter(s => !(s.date === today && !s.completed && s.id.startsWith('auto-')));
      let cursor = 18 * 60;
      const created = top.map((p, i) => {
        const dur = level(p.score).minutes;
        const start = cursor;
        cursor += dur + 15;
        return { id: `auto-${uid()}`, studentId: 'me', subjectId: p.subjectId, date: today, startTime: timeFromMinutes(start), endTime: timeFromMinutes(start + dur), duration: dur, completed: false, notes: i === 0 ? 'Priorité 1 · ' + (p.next?.title ?? 'Révision générale') : 'Priorité 2 · ' + (p.next?.title ?? 'Révision générale') };
      });
      return { ...current, sessions: [...kept, ...created] };
    }, 'Plan du jour généré selon tes priorités');
  }

  function toggle(id: string) {
    update(current => ({ ...current, sessions: current.sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s) }), undefined);
  }

  function addSession() {
    const duration = Number(draft.duration);
    if (!draft.subjectId) return;
    const start = minutes(draft.start);
    const ok = update(current => ({ ...current, sessions: [...current.sessions, { id: uid(), studentId: 'me', subjectId: draft.subjectId, date: today, startTime: draft.start, endTime: timeFromMinutes(start + duration), duration, completed: false }] }), 'Session ajoutée à ton plan');
    if (ok) setAddOpen(false);
  }

  const subjectName = (id: string) => data.subjects.find(s => s.id === id)?.name ?? 'Matière';

  return (
    <AppLayout title="Révisions">
      <PageHead eyebrow="Révisions" title="Mon plan de révision" description="Un plan qui met en premier ce qui compte le plus cette semaine : échéance proche, coefficient et niveau actuel." actions={<><Button variant="outline" onClick={() => setAddOpen(true)}><Plus size={16} />Ajouter une session</Button><Button onClick={generatePlan} disabled={priorities.length === 0}><Sparkles size={16} />Générer un plan</Button></>} />

      {data.subjects.length === 0 ? <EmptyState title="Pas encore de révisions à planifier." description="Ajoute des matières et des échéances pour que STUDYCORE établisse tes priorités." action={<Link href="/subjects" className="button button-primary">Ajouter une matière</Link>} /> : (
        <div className="split" style={{ alignItems: 'start' }}>
          <section className="stack" style={{ gap: 14 }} aria-label="Priorités">
            {priorities.map((p, index) => {
              const lvl = level(p.score);
              return (
                <article key={p.subjectId} className={`panel rise ${index === 0 ? 'is-priority' : ''}`} style={{ display: 'grid', gap: 12, borderColor: index === 0 ? 'var(--danger-line)' : undefined }}>
                  <div className="row-between">
                    <div className="row" style={{ gap: 10 }}><span className="dot" style={{ background: data.subjects.find(s => s.id === p.subjectId)?.color }} /><h2>{p.subjectName}</h2></div>
                    <span className={`badge ${lvl.badge}`}>{lvl.label}</span>
                  </div>
                  <div className="row small muted" style={{ gap: 16, flexWrap: 'wrap' }}>
                    <span className="row" style={{ gap: 6 }}><Clock size={15} />{Math.floor(lvl.minutes / 60) ? `${Math.floor(lvl.minutes / 60)} h${lvl.minutes % 60 ? String(lvl.minutes % 60).padStart(2, '0') : ''}` : `${lvl.minutes} min`}</span>
                    <span>{p.next ? `${p.next.title} · ${countdown(p.next.dueDate).toLowerCase()}` : 'Aucune échéance proche'}</span>
                    <span>Moyenne {number(p.average)}/20 · coeff. {p.coefficient}</span>
                  </div>
                  <div className="row-between" style={{ flexWrap: 'wrap' }}>
                    <StatusBadge status={p.status} short />
                    <Link href={`/subjects/${p.subjectId}`} className="text-link">Voir la matière</Link>
                  </div>
                </article>
              );
            })}
            {priorities.length === 0 && <p className="muted">Aucune priorité calculée.</p>}
            <p className="tiny faint row" style={{ gap: 6 }}><HelpCircle size={14} />Les priorités sont des suggestions de révision. Elles ne modifient ni tes notes ni tes crédits.</p>
          </section>

          <section className="panel" aria-labelledby="today-title">
            <div className="panel-head">
              <div><h2 id="today-title">Aujourd’hui</h2><p>{sessions.length ? `${done} / ${sessions.length} sessions terminées` : 'Aucune session prévue'}</p></div>
              <span className="badge badge-brand">{new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span>
            </div>
            {sessions.length > 0 && <div style={{ marginBottom: 18 }}><ProgressBarInline value={(done / sessions.length) * 100} tone={done === sessions.length ? 'ok' : 'brand'} /></div>}
            {sessions.length === 0 ? (
              <EmptyState compact title="Ton plan est vide" description="Génère un plan automatique à partir de tes priorités, ou ajoute une session à la main." action={<Button onClick={generatePlan}><Sparkles size={16} />Générer un plan</Button>} />
            ) : (
              <ol className="stack" style={{ gap: 10, listStyle: 'none', padding: 0, margin: 0 }} aria-label="Chronologie du jour">
                {timeline.map((entry, i) => entry.kind === 'break' ? (
                  <li key={`b-${i}`} className="session session-break" style={{ gridTemplateColumns: '110px minmax(0,1fr)' }}>
                    <span className="session-time">{entry.start}–{entry.end}</span>
                    <span className="row small muted" style={{ gap: 8 }}><Coffee size={15} />Pause</span>
                  </li>
                ) : (
                  <li key={entry.item.id} className={`session ${entry.item.completed ? 'is-done' : ''}`}>
                    <span className="session-time">{entry.item.startTime}–{entry.item.endTime}</span>
                    <div style={{ minWidth: 0 }}>
                      <strong>{subjectName(entry.item.subjectId)}</strong>
                      <div className="tiny muted">{entry.item.notes ?? `${entry.item.duration} min de révision`}</div>
                    </div>
                    <button type="button" className={`button button-sm ${entry.item.completed ? 'button-secondary' : 'button-primary'}`} onClick={() => toggle(entry.item.id)} aria-pressed={entry.item.completed}>
                      {entry.item.completed ? <><Undo2 size={14} />Rouvrir</> : <><Check size={14} />Terminer</>}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <div className="surface-soft row" style={{ marginTop: 18, padding: 14, gap: 10 }}>
              <Timer size={18} className="muted" />
              <span className="small muted">Méthode : 25 min de travail actif, 5 min de pause. Les sessions se terminent d’un clic.</span>
            </div>
          </section>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen} title="Ajouter une session" description="Planifie un créneau de révision pour aujourd’hui.">
        <form className="stack" style={{ gap: 16 }} onSubmit={e => { e.preventDefault(); addSession(); }}>
          <Select label="Matière" value={draft.subjectId || data.subjects[0]?.id} onChange={e => setDraft(d => ({ ...d, subjectId: e.target.value }))}>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
          <div className="form-grid">
            <Input label="Heure de début" type="time" value={draft.start} onChange={e => setDraft(d => ({ ...d, start: e.target.value }))} />
            <Select label="Durée" value={draft.duration} onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))}><option value="30">30 min</option><option value="45">45 min</option><option value="60">1 h</option><option value="90">1 h 30</option></Select>
          </div>
          <div className="dialog-actions"><Button variant="ghost" type="button" onClick={() => setAddOpen(false)}>Annuler</Button><Button type="submit"><Target size={16} />Ajouter</Button></div>
        </form>
      </Dialog>
    </AppLayout>
  );
}
