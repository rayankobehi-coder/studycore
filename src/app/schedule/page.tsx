'use client';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Segmented } from '@/components/ui/segmented';
import { Button } from '@/components/ui/button';
import { AddEventDialog } from '@/components/forms/planning-dialogs';
import { getCalendarEvents } from '@/lib/workspace/selectors';
import { addDays, dateKey, minutes, mondayOf, parseDate, formatDate } from '@/lib/workspace/dates';
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import type { ScheduleEvent } from '@/lib/types';

type View = 'day' | 'week' | 'month';
const START_HOUR = 8;
const END_HOUR = 20;
const PX_PER_MIN = 1;
const eventClass: Record<ScheduleEvent['type'], string> = { COURSE: 'event-course', EXAM: 'event-exam', REVISION: 'event-revision', PERSONAL: 'event-personal', ASSIGNMENT: 'event-assignment' };
const eventLabel: Record<ScheduleEvent['type'], string> = { COURSE: 'Cours', EXAM: 'Examen', REVISION: 'Révision', PERSONAL: 'Personnel', ASSIGNMENT: 'Échéance' };

export default function SchedulePage() {
  const { data } = useWorkspace();
  const [view, setView] = useState<View>('week');
  const [anchor, setAnchor] = useState(dateKey());
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);
  const events = useMemo(() => getCalendarEvents(data), [data]);
  const anchorDate = parseDate(anchor);
  const weekStart = mondayOf(anchorDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayEvents = events.filter(e => e.date === anchor);

  function shift(direction: number) {
    const step = view === 'day' ? 1 : view === 'week' ? 7 : 30;
    setAnchor(dateKey(addDays(anchor, step * direction)));
  }
  const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const gridStart = mondayOf(monthStart);
  const monthDays = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const title = view === 'month' ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(anchorDate) : view === 'week' ? `Semaine du ${formatDate(weekStart, { day: 'numeric', month: 'long' })}` : formatDate(anchor, { weekday: 'long', day: 'numeric', month: 'long' });

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  function EventBlock({ event, compact = false }: { event: ScheduleEvent; compact?: boolean }) {
    const top = (minutes(event.startTime) - START_HOUR * 60) * PX_PER_MIN;
    const height = Math.max(34, (minutes(event.endTime) - minutes(event.startTime)) * PX_PER_MIN - 4);
    return (
      <button type="button" className={`event ${eventClass[event.type]}`} style={compact ? undefined : { top, height }} onClick={() => setSelected(event)} aria-label={`${event.title}, ${eventLabel[event.type]}, ${event.startTime} à ${event.endTime}${event.room ? `, salle ${event.room}` : ''}`}>
        <strong>{event.title}</strong>
        <small>{event.startTime} – {event.endTime}{event.room ? ` · ${event.room}` : ''}</small>
      </button>
    );
  }

  return (
    <AppLayout title="Planning">
      <PageHead eyebrow="Calendrier" title="Emploi du temps" description="Cours, examens et révisions au même endroit. Les examens sont signalés par une trame rouge." actions={<Button onClick={() => setAddOpen(true)}><CalendarPlus size={16} />Ajouter un événement</Button>} />
      <div className="row-between" style={{ marginBottom: 18, gap: 12 }}>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="icon-button" onClick={() => shift(-1)} aria-label="Précédent"><ChevronLeft size={18} /></button>
          <button type="button" className="button button-outline button-sm" onClick={() => setAnchor(dateKey())}>Aujourd’hui</button>
          <button type="button" className="icon-button" onClick={() => shift(1)} aria-label="Suivant"><ChevronRight size={18} /></button>
          <h2 style={{ marginLeft: 8, textTransform: 'capitalize' }}>{title}</h2>
        </div>
        <Segmented label="Vue du planning" value={view} onChange={setView} options={[{ value: 'day', label: 'Jour' }, { value: 'week', label: 'Semaine' }, { value: 'month', label: 'Mois' }]} />
      </div>
      <div className="row" style={{ gap: 18, marginBottom: 14, flexWrap: 'wrap' }}>
        {(['COURSE', 'EXAM', 'REVISION', 'PERSONAL'] as ScheduleEvent['type'][]).map(type => <span key={type} className="legend-chip"><i className={eventClass[type]} />{eventLabel[type]}</span>)}
      </div>

      {view === 'week' && (
        <div className="week" role="table" aria-label={`Semaine du ${formatDate(weekStart)}`}>
          <div className="week-head" role="row">
            <div role="columnheader" aria-label="Heure" style={{ background: 'var(--surface-2)' }} />
            {days.map(day => {
              const isToday = dateKey(day) === dateKey();
              return <div key={dateKey(day)} role="columnheader" className={isToday ? 'is-today' : ''}><span className="tiny">{new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(day)}</span><b className="num">{day.getDate()}</b></div>;
            })}
          </div>
          <div className="week-hours" role="rowgroup" style={{ gridColumn: 1, gridRow: 2 }} aria-hidden="true">
            {hours.map(h => <span key={h} style={{ height: 60 }}>{String(h).padStart(2, '0')}:00</span>)}
          </div>
          {days.map(day => {
            const key = dateKey(day);
            const dayItems = events.filter(e => e.date === key);
            return (
              <div key={key} className="week-col" role="cell" style={{ height: (END_HOUR - START_HOUR) * 60 * PX_PER_MIN }} aria-label={`${formatDate(day, { weekday: 'long', day: 'numeric' })} : ${dayItems.length} événement(s)`}>
                {dayItems.map(event => <EventBlock key={event.id} event={event} />)}
              </div>
            );
          })}
        </div>
      )}

      {view === 'month' && (
        <div className="month" role="grid" aria-label={title}>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => <div key={d} className="tiny" style={{ minHeight: 'auto', padding: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', background: 'var(--surface-2)' }}>{d}</div>)}
          {monthDays.map(day => {
            const key = dateKey(day);
            const items = events.filter(e => e.date === key);
            const muted = day.getMonth() !== anchorDate.getMonth();
            const hasExam = items.some(i => i.type === 'EXAM');
            return (
              <button type="button" key={key} className={`${muted ? 'is-muted' : ''} ${items.length ? 'has-event' : ''} ${key === dateKey() ? 'is-today' : ''}`} style={{ textAlign: 'left', border: 0, cursor: 'pointer' }} onClick={() => { setAnchor(key); setView('day'); }} aria-label={`${formatDate(day, { day: 'numeric', month: 'long' })}, ${items.length} événement(s)`}>
                <b className="num">{day.getDate()}</b>
                {items.slice(0, 3).map(item => <span key={item.id} className={`month-event ${item.type === 'EXAM' ? 'exam' : ''}`}>{item.startTime} {item.title}</span>)}
                {items.length > 3 && <span className="tiny muted">+{items.length - 3}</span>}
                {hasExam && <span className="tiny" style={{ color: 'var(--danger)', fontWeight: 700 }}>Examen</span>}
              </button>
            );
          })}
        </div>
      )}

      {view === 'day' && (
        <div className="split" style={{ gridTemplateColumns: 'minmax(0,1fr) 320px' }}>
          <section className="day-list" aria-label="Programme du jour">
            {dayEvents.length === 0 && <div className="empty-state empty-compact"><p>Rien de prévu ce jour-là. Un bon moment pour réviser.</p></div>}
            {dayEvents.map(event => (
              <button type="button" key={event.id} className="day-item" style={{ borderLeftColor: event.type === 'EXAM' ? 'var(--danger)' : 'var(--brand)', textAlign: 'left', cursor: 'pointer' }} onClick={() => setSelected(event)}>
                <span className="session-time num">{event.startTime}<br /><span className="faint">{event.endTime}</span></span>
                <span style={{ minWidth: 0 }}><strong style={{ display: 'block' }}>{event.title}</strong><span className="small muted">{event.description ?? eventLabel[event.type]}</span></span>
                <span className={`badge ${event.type === 'EXAM' ? 'badge-danger' : 'badge-outline'}`}>{eventLabel[event.type]}</span>
              </button>
            ))}
          </section>
          <aside className="panel stack" style={{ gap: 12 }}>
            <h2>Le jour en un coup d’œil</h2>
            <p className="small muted">{dayEvents.length} événement(s) · {dayEvents.filter(e => e.type === 'EXAM').length} examen(s)</p>
            <p className="small muted">Les événements sont synchronisés avec tes échéances et tes sessions de révision.</p>
          </aside>
        </div>
      )}

      {selected && (
        <div className="panel" style={{ marginTop: 18, display: 'grid', gap: 10 }} role="status" aria-live="polite">
          <div className="row-between"><strong>{selected.title}</strong><button className="button button-ghost button-sm" onClick={() => setSelected(null)}>Fermer</button></div>
          <div className="row small muted" style={{ gap: 16, flexWrap: 'wrap' }}><span className="row" style={{ gap: 6 }}><Clock size={15} />{formatDate(selected.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {selected.startTime} – {selected.endTime}</span>{selected.room && <span className="row" style={{ gap: 6 }}><MapPin size={15} />{selected.room}</span>}<span className={`badge ${selected.type === 'EXAM' ? 'badge-danger' : 'badge-outline'}`}>{eventLabel[selected.type]}</span></div>
          {selected.description && <p className="small muted">{selected.description}</p>}
        </div>
      )}
      <AddEventDialog open={addOpen} onOpenChange={setAddOpen} defaultDate={anchor} />
    </AppLayout>
  );
}
