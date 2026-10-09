'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlarmClock, Brain, Check, Circle, Clock3, Focus, Play, Settings2, Sparkles, Target, TimerReset } from 'lucide-react';

const priorities = [
  { name: 'Algorithmique', status: 'Priorité Haute', due: 'Examen dans 3 jours', time: '1h30 prévue', goal: 'Complexité spatiale et arbres binaires', color: 'red' },
  { name: 'Base de Données', status: 'Priorité Soutenue', due: 'Projet dans 5 jours', time: '1h00 prévue', goal: 'Modèle relationnel et requêtes SQL', color: 'blue' },
  { name: 'Mathématiques', status: 'Priorité Modérée', due: 'Sous le seuil · 45 min', time: '45 min prévue', goal: 'Révision matrices et vecteurs', color: 'yellow' },
];
const plan = [
  { time: '18:00 - 19:30', subject: 'Algorithmique', detail: 'Session Focus · Arbres binaires approfondis', state: 'Terminée', tone: 'done' },
  { time: '19:30 - 19:45', subject: 'Pause Récupération', detail: 'Hydratation et petite pause', state: 'Terminée', tone: 'break' },
  { time: '19:45 - 20:45', subject: 'Base de Données', detail: 'Écriture script SQL & indexation relationnelle', state: 'En cours · Reste 35 min', tone: 'active' },
  { time: '21:00 - 21:45', subject: 'Mathématiques', detail: 'Flashcards & Quiz d’ancrage mémoire', state: 'À venir', tone: 'upcoming' },
];

export default function StudyPlannerPage() {
  const [completed, setCompleted] = useState<string[]>(['Algorithmique', 'Pause Récupération']);
  const [focusMode, setFocusMode] = useState(false);
  const toggleSession = (subject: string) => setCompleted((current) => current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject]);
  return (
    <AppLayout>
      <div className="screen-heading">
        <div><span className="screen-kicker"><span /> ORDONNANCEMENT PRÉDICTIF</span><h1>Plan de Révisions</h1><p>Organisation intelligente pilotée par tes coefficients et priorités.</p></div>
      </div>
      <section className="planner-goal">
        <div className="planner-goal-top"><div><span>OBJECTIF QUOTIDIEN</span><strong>2 <small>/ 4 sessions</small></strong></div><div className="progress-ring"><span>50%</span></div></div>
        <div className="planner-goal-bar"><span style={{ width: '50%' }} /></div>
        <div className="planner-stat-pair"><div><span><Clock3 size={15} /></span><small>Temps révisé<strong>2h15 / 4h00</strong></small></div><div><span><Sparkles size={15} /></span><small>Cadence<strong>+18% opti</strong></small></div></div>
      </section>
      <div className="algorithm-advice"><span><Brain size={17} /></span><div><strong>CONSEIL ALGORITHME <i /></strong><p>Accorde <b>15 min de plus</b> aux jointures SQL ce soir pour sécuriser la note de projet et maximiser l&apos;impact ECTS.</p></div></div>
      <div className="unit-heading priority-heading"><Target size={17} /><h2>PRIORITÉS ALGORITHMIQUES DU JOUR</h2><Badge variant="outline">3 modules</Badge></div>
      <div className="priority-list">{priorities.map((item) => <article className="priority-card" key={item.name}><div className="priority-card-top"><strong>{item.name}</strong><Badge variant={item.color === 'red' ? 'danger' : item.color === 'blue' ? 'info' : 'warning'}>{item.status}</Badge></div><div className="priority-details"><span><AlarmClock size={13} />{item.due}</span><span><Clock3 size={13} />{item.time}</span></div><div className="priority-goal"><Target size={14} /> Objectif : {item.goal}</div></article>)}</div>
      <section className="planner-timeline">
        <div className="section-heading"><h2><Clock3 size={17} /> TIMELINE QUOTIDIENNE</h2><span>Aujourd&apos;hui</span></div>
        <div className="timeline-list">{plan.map((item) => <article className={`timeline-item ${item.tone}`} key={item.subject}><button type="button" className={`timeline-check ${completed.includes(item.subject) ? 'checked' : ''}`} aria-label={`${completed.includes(item.subject) ? 'Marquer non terminée' : 'Terminer'} ${item.subject}`} onClick={() => toggleSession(item.subject)}>{completed.includes(item.subject) ? <Check size={14} /> : item.tone === 'active' ? <Play size={12} /> : <Circle size={12} />}</button><div><div className="timeline-top"><span>{item.time}</span><small>{completed.includes(item.subject) ? 'Terminée ✓' : item.state}</small></div><strong>{item.subject}</strong><p>{item.detail}</p>{item.tone === 'active' && <div className="subject-progress"><span style={{ width: '54%', background: '#4b3dea' }} /></div>}</div></article>)}</div>
      </section>
      <section className="weekly-review"><div className="section-heading"><h2>APERÇU HEBDOMADAIRE</h2><span className="score-green">92% respecté</span></div><div className="weekly-bars">{[80, 94, 90, 94, 77, 0, 0].map((value, index) => <div key={index}><span style={{ height: `${value || 16}%`, opacity: value ? 1 : .15 }} /><small>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}</small></div>)}</div></section>
      <Button className="w-full focus-button" onClick={() => setFocusMode((value) => !value)}>{focusMode ? <TimerReset size={16} className="mr-2" /> : <Focus size={16} className="mr-2" />}{focusMode ? 'Quitter le mode Focus' : 'Lancer le mode Focus'}</Button>
      {focusMode && <div className="focus-running"><span className="focus-pulse" /><strong>Mode Focus activé</strong><span>25:00</span><button type="button" onClick={() => setFocusMode(false)}>Arrêter</button></div>}
      <Button variant="secondary" className="mt-2 w-full"><Settings2 size={15} className="mr-2" />Ajuster mon planning</Button>
    </AppLayout>
  );
}
