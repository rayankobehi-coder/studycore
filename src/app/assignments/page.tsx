'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock3, Plus, TriangleAlert, X } from 'lucide-react';

type Deadline = { id: number; category: string; type: string; name: string; priority: string; coefficient: number; time: string; place: string; note: string; delay: string; tone: string };
const startingDeadlines: Deadline[] = [
  { id: 1, category: "AUJOURD'HUI & URGENT", type: 'EXAMEN PARTIEL', name: 'Réseaux & Télécoms', priority: 'Priorité Haute', coefficient: 3, time: '14:00', place: 'Salle C04', note: 'Calculatrice autorisée · Formulaire fourni sur table', delay: 'Dans 3 heures', tone: 'red' },
  { id: 2, category: 'CETTE SEMAINE', type: 'Examen Final Écrit', name: 'Algorithmique & Structures', priority: 'Priorité Haute', coefficient: 4, time: '15 Fév.', place: 'Amphithéâtre Galois', note: "Pondération majeure · Représente 40% de l'UE", delay: 'Dans 3 jours', tone: 'violet' },
  { id: 3, category: 'CETTE SEMAINE', type: 'Projet de Groupe', name: 'Base de Données Relationnelles', priority: 'Priorité Moyenne', coefficient: 3, time: '17 Fév.', place: 'Dépôt Git / Moodle', note: 'Note CC à consolider · 8.7 / 20', delay: 'Dans 5 jours', tone: 'blue' },
  { id: 4, category: 'PLUS TARD (S2)', type: 'Contrôle Continu (CC)', name: 'Anglais Professionnel', priority: 'Priorité Normale', coefficient: 2, time: '24 Fév.', place: 'Salle B12', note: 'Pitch Présentation Pro · 5 min individuel', delay: 'Dans 12 jours', tone: 'green' },
  { id: 5, category: 'PLUS TARD (S2)', type: 'Devoir Surveillé (DS)', name: "Mathématiques pour l'info", priority: 'Priorité Vigilance', coefficient: 2, time: '02 Mars', place: 'Salle A01', note: 'DS Algèbre Linéaire & Réduction', delay: 'Dans 18 jours', tone: 'violet' },
];

const filters = ['Toutes (7)', 'Examens (3)', 'Projets (2)', 'Devoirs (2)'];

export default function AssignmentsPage() {
  const [deadlines, setDeadlines] = useState(startingDeadlines);
  const [filter, setFilter] = useState('Toutes (7)');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');

  const addDeadline = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeadlines((current) => [...current, { id: Date.now(), category: 'CETTE SEMAINE', type: 'Nouveau devoir', name: title, priority: 'Priorité Normale', coefficient: 1, time: '20 Fév.', place: 'À définir', note: 'Nouvelle échéance à préparer', delay: 'À venir', tone: 'violet' }]);
    setTitle('');
    setShowForm(false);
  };

  const filtered = deadlines.filter((item) => {
    if (filter.startsWith('Examens')) return item.type.toLowerCase().includes('examen');
    if (filter.startsWith('Projets')) return item.type.toLowerCase().includes('projet');
    if (filter.startsWith('Devoirs')) return item.type.toLowerCase().includes('devoir') || item.type.toLowerCase().includes('contrôle');
    return true;
  });
  const groups = [...new Set(filtered.map((item) => item.category))];

  return (
    <AppLayout>
      <div className="screen-heading">
        <div><h1>Échéances</h1><p>Devoirs, projets et examens à venir</p></div>
        <button type="button" className="primary-action compact-action" onClick={() => setShowForm(true)}><Plus size={17} /> Ajouter</button>
      </div>
      <div className="deadline-callout"><span><TriangleAlert size={19} /></span><div><strong>3 examens critiques ce mois-ci</strong><p>Coefficient cumulé : 10 · Priorité absolue</p></div><Badge variant="info">{deadlines.length} Actifs</Badge></div>
      <div className="deadline-filters">{filters.map((item) => <button type="button" key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>

      <div className="deadline-groups">
        {groups.map((group) => <section className="deadline-group" key={group}>
          <div className={`deadline-group-title ${group.startsWith('AUJOUR') ? 'urgent-text' : ''}`}><span>{group.startsWith('AUJOUR') ? '●' : '•'}</span><strong>{group}</strong><small>{filtered.filter((item) => item.category === group).length} échéance{filtered.filter((item) => item.category === group).length > 1 ? 's' : ''}</small></div>
          {filtered.filter((item) => item.category === group).map((item) => <article className={`deadline-card ${item.tone}`} key={item.id}>
            <div className="deadline-card-top"><span className="deadline-type">{item.type}</span><span className="deadline-priority">{item.priority}</span><Badge variant="outline">Coeff {item.coefficient}</Badge></div>
            <h2>{item.name}</h2>
            <div className="deadline-meta"><span>{item.tone === 'red' ? <Clock3 size={14} /> : <CalendarDays size={14} />}{item.time} · {item.place}</span><strong className={item.tone === 'red' ? 'score-red' : ''}><Clock3 size={14} />{item.delay}</strong></div>
            <div className={`deadline-note ${item.tone}`}>{item.note}</div>
          </article>)}
        </section>)}
      </div>
      <Link href="/simulator" className="deadline-sim-callout"><div><span>OBJECTIF MENTION</span><strong>Calculer l&apos;impact sur ma moyenne</strong><small>Simulez vos notes minimales requises.</small></div><span>Simuler</span></Link>

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}><section className="simple-modal" role="dialog" aria-modal="true" aria-labelledby="deadline-title"><button type="button" className="modal-close" aria-label="Fermer" onClick={() => setShowForm(false)}><X size={18} /></button><h2 id="deadline-title">Ajouter une échéance</h2><p>Garde tes devoirs et examens sous contrôle.</p><form onSubmit={addDeadline}><label htmlFor="deadline-name">Nom du devoir ou de l&apos;examen</label><input id="deadline-name" autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Devoir de mathématiques" /><Button type="submit"><Plus size={16} className="mr-2" />Créer l&apos;échéance</Button></form></section></div>}
    </AppLayout>
  );
}
