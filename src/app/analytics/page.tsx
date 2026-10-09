'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Award, Download, Flag, Lightbulb, Sparkles, TrendingUp } from 'lucide-react';

const performance = [
  { name: 'Anglais Professionnel', value: 16.4, color: 'green' },
  { name: 'Développement Web & APIs', value: 15.1, color: 'green' },
  { name: 'Algorithmique Avancée', value: 14.2, color: 'green' },
  { name: 'Architecture Réseaux', value: 13.8, color: 'green' },
  { name: 'Bases de Données Relationnelles', value: 8.7, color: 'blue' },
  { name: 'Mathématiques Discrètes', value: 7.9, color: 'red' },
];
export default function AnalyticsPage() {
  const [period, setPeriod] = useState('Semestre 2');
  return (
    <AppLayout>
      <div className="screen-heading">
        <div><Badge variant="info">● Promotion L3 Informatique</Badge><h1>Mes Performances</h1><p>Analyse statistique de tes résultats et tendances académiques.</p></div>
        <span className="data-updated"><TrendingUp size={13} /> Mis à jour hier</span>
      </div>
      <div className="segmented-tabs analytics-tabs">{['Semestre 1', 'Semestre 2', 'Global 26-27'].map((item) => <button type="button" key={item} className={period === item ? 'selected' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div>
      <section className="analytics-summary">
        <article><span>MOYENNE</span><strong>14.27<small> /20</small></strong><p className="up-text"><ArrowUpRight size={14} /> +1.12 pts vs S1</p></article>
        <article><span>RANG PROMO</span><strong>5<small>e / 36</small></strong><Badge variant="info">Top 14% de promo</Badge></article>
        <article className="strength"><span>ATOUT MAJEUR <Award size={14} /></span><strong>Anglais Pro</strong><p>16.40 <small>/20</small></p><Badge variant="success">Mention Très Bien</Badge></article>
        <article className="weakness"><span>EN TENSION <span>!</span></span><strong>Mathématiques</strong><p>7.90 <small>/20</small></p><Badge variant="danger">Seuil de vigilance</Badge></article>
      </section>
      <section className="analytics-panel">
        <div className="section-heading"><div><h2>Trajectoire Semestrielle</h2><p>Progression continue de 13.4 à 14.27</p></div><Badge variant="info">● S2 Actuel</Badge></div>
        <div className="analytics-chart"><svg viewBox="0 0 360 140" preserveAspectRatio="none"><defs><linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f41ee" stopOpacity=".2" /><stop offset="100%" stopColor="#4f41ee" stopOpacity="0" /></linearGradient></defs><path d="M18 97 C70 92 86 85 119 82 S168 72 205 69 S256 59 294 53 S328 46 345 40 L345 124 L18 124Z" fill="url(#analytics-area)" /><path d="M18 97 C70 92 86 85 119 82 S168 72 205 69 S256 59 294 53 S328 46 345 40" fill="none" stroke="#4838ef" strokeWidth="3" />{[[18,97],[119,82],[205,69],[294,53],[345,40]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="4.5" fill="white" stroke="#4838ef" strokeWidth="2.5" />)}<line x1="12" x2="346" y1="111" y2="111" stroke="#f5b7bb" strokeDasharray="3 4" /></svg><div className="analytics-chart-labels"><span>Oct (13.4)</span><span>Nov</span><span>Déc</span><span>Jan</span><span>Fév (14.27)</span></div></div>
      </section>
      <section className="analytics-panel dispersion">
        <div className="section-heading"><div><h2>Dispersion par Discipline</h2><p>Répartition des moyennes &amp; niveaux d&apos;acquisition</p></div><Badge variant="outline">6 cours</Badge></div>
        <div className="performance-bars">{performance.map((item) => <div className="performance-row" key={item.name}><div><span className={`performance-dot ${item.color}`} /><span>{item.name}</span><strong className={`score-${item.color}`}>{item.value.toFixed(1)} / 20</strong></div><div className="subject-progress"><span className={item.color === 'green' ? 'validated' : item.color === 'blue' ? 'watch' : 'risk'} style={{ width: `${item.value * 5}%` }} /></div></div>)}</div>
      </section>
      <section className="diagnostic-panel">
        <h2><Sparkles size={16} /> Diagnostic &amp; Régularité</h2>
        <div className="diagnostic-grid"><article><span>Écart-type</span><strong>2.45 <small>pts</small></strong><p>Profil polarisé : excellence en pratique tech.</p></article><article><span>Compensation</span><strong className="score-green">98%</strong><p>L&apos;avance en info compense les maths.</p></article></div>
        <div className="leverage-tip"><Lightbulb size={17} /><p><strong>Fort effet de levier identifié</strong><br />Base de données (Coeff 3) possède le plus fort potentiel : viser 12.0/20 à l&apos;examen final génèrera +0.34 pts.</p></div>
      </section>
      <section className="analytics-panel promo-panel"><div className="section-heading"><h2>Comparatif Promotion</h2><Badge variant="success">Avance nette</Badge></div><div className="promo-compare"><div><span>Ta moyenne</span><strong>14.27</strong></div><div><span className="score-green">+2.17 pts</span><small>—</small></div><div><span>Moyenne Promo</span><strong>12.10</strong></div></div><div className="validation-probability"><span><strong>96%</strong></span><div><strong>Validation Sans Rattrapage</strong><p>Probabilité statistique très élevée d&apos;obtenir ton année dès la première session.</p></div></div></section>
      <Button className="w-full analytics-download"><Download size={15} className="mr-2" />Générer le rapport analytique semestriel</Button>
      <Button variant="secondary" className="mt-2 w-full"><Flag size={15} className="mr-2" />Définir un nouvel objectif de note</Button>
    </AppLayout>
  );
}
