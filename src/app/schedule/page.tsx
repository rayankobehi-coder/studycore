'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Clock3,
  Lightbulb,
  MapPin,
  Plus,
  UserRound,
  Utensils,
  X,
} from 'lucide-react';

type EventItem = { time: string; end: string; name: string; kind: string; detail: string; room: string; teacher: string; color: 'blue' | 'sky' | 'red' | 'violet' };
const initialEvents: EventItem[] = [
  { time: '08:30', end: '10:30', name: 'Algorithmique & Structures', kind: 'Cours magistral', detail: 'UE 1', room: 'Amphi B', teacher: 'Prof. M. Delorme', color: 'blue' },
  { time: '10:45', end: '12:45', name: 'Bases de Données', kind: 'TP Pratique · Requêtes SQL avancées', detail: 'UE 2', room: 'Salle Info 204', teacher: 'Mme Lefebvre', color: 'sky' },
  { time: '14:00', end: '16:00', name: 'Réseaux & Télécoms', kind: 'Épreuve sur table · Matériel autorisé : calculatrice', detail: 'EXAMEN PARTIEL', room: 'Salle C04', teacher: 'Coeff 3', color: 'red' },
];

const weekDays = [{ day: 'Lun', date: '12' }, { day: 'Mar', date: '13' }, { day: 'Mer', date: '14' }, { day: 'Jeu', date: '15' }, { day: 'Ven', date: '16' }];

export default function SchedulePage() {
  const [view, setView] = useState('Semaine');
  const [selectedDay, setSelectedDay] = useState('Mer');
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState('');

  const addEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEvents((current) => [...current, { time: '16:30', end: '17:30', name: eventName, kind: 'Session personnalisée', detail: 'Événement', room: 'Bibliothèque', teacher: 'Personnel', color: 'violet' }]);
    setEventName('');
    setShowForm(false);
  };

  return (
    <AppLayout>
      <div className="screen-heading">
        <div><h1>Emploi du temps</h1><p>Organisation des cours et sessions d&apos;étude</p></div>
        <button type="button" className="round-add-button" aria-label="Ajouter un événement" onClick={() => setShowForm(true)}><Plus size={23} /></button>
      </div>
      <div className="segmented-tabs schedule-tabs">{['Jour', 'Semaine', 'Mois'].map((item) => <button type="button" key={item} className={view === item ? 'selected' : ''} onClick={() => setView(item)}>{item}</button>)}</div>
      <div className="day-selector">{weekDays.map((day) => <button type="button" key={day.day} className={selectedDay === day.day ? 'selected' : ''} onClick={() => setSelectedDay(day.day)}><span>{day.day}</span><strong>{day.date}</strong>{day.day === 'Mar' || day.day === 'Mer' || day.day === 'Ven' ? <i /> : null}</button>)}</div>
      <div className="schedule-day-title"><span /><strong>{selectedDay === 'Mer' ? 'Mercredi 14 Février' : `${weekDays.find((day) => day.day === selectedDay)?.day} ${weekDays.find((day) => day.day === selectedDay)?.date} Février`} · {events.length} cours prévus</strong><Badge variant="outline">Semaine 07</Badge></div>
      <div className="schedule-events">
        {events.map((event, index) => (
          <div key={`${event.name}-${index}`}>
            {index === 2 && <div className="lunch-divider"><span /><Utensils size={15} /> Pause déjeuner (12:45 - 14:00)<span /></div>}
            <article className={`schedule-event ${event.color}`}>
              <div className="schedule-time"><Clock3 size={16} /><strong>{event.time} — {event.end}</strong><Badge variant={event.color === 'red' ? 'danger' : 'info'}>{event.detail}</Badge></div>
              <h2>{event.name}</h2><p>{event.kind}</p>
              <div className="schedule-event-meta"><span><MapPin size={14} />{event.room}</span><span><UserRound size={14} />{event.teacher}</span></div>
            </article>
          </div>
        ))}
        <article className="schedule-event violet">
          <div className="schedule-time"><Lightbulb size={16} /><strong>16:30 — 18:00</strong><Badge variant="success">Focus suggéré</Badge></div>
          <h2>Révision Algorithmique</h2><p>Session d&apos;assimilation post-amphi</p>
          <a href="/study-planner" className="schedule-event-meta suggested-link"><span><BookOpen size={14} />Bibliothèque Universitaire</span><span>Valider <ArrowRight size={14} /></span></a>
        </article>
      </div>
      <button type="button" className="custom-event-button" onClick={() => setShowForm(true)}><CalendarCheck size={18} /> Ajouter un événement personnalisé</button>
      <div className="focus-preview"><span><Clock3 size={23} /></span><div><small>APERÇU DIRECT</small><strong>Prochaine session dans <u>45 min</u>…</strong></div><ArrowRight size={19} /></div>

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}><section className="simple-modal" role="dialog" aria-modal="true" aria-labelledby="event-title"><button type="button" className="modal-close" onClick={() => setShowForm(false)} aria-label="Fermer"><X size={18} /></button><h2 id="event-title">Nouvel événement</h2><p>Ajoute une session à ton planning.</p><form onSubmit={addEvent}><label htmlFor="event-name">Nom de l&apos;événement</label><input id="event-name" autoFocus required value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Ex. Révision de SQL" /><Button type="submit"><Plus size={16} className="mr-2" />Ajouter à la journée</Button></form></section></div>}
    </AppLayout>
  );
}
