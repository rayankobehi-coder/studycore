'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BellRing, CheckCircle2, Lightbulb, Plus, Sparkles, TrendingUp } from 'lucide-react';

const assessments = [
  { title: 'Contrôle Continu 1', date: '14 Octobre', type: 'Devoir sur table', grade: '15.00', delta: '+3.50 promo', min: '08.00', avg: '11.50', max: '18.00' },
  { title: 'TP Algorithmes de Tri', date: '28 Novembre', type: 'Projet binôme', grade: '13.00', delta: '-0.20 promo', min: '06.50', avg: '13.20', max: '19.50' },
  { title: 'Examen Partiel S2', date: '22 Janvier', type: 'Amphithéâtre', grade: '14.50', delta: '+2.70 promo', min: '04.00', avg: '11.80', max: '17.50' },
];

export default function SubjectDetailPage() {
  return (
    <AppLayout>
      <div className="detail-back"><Link href="/subjects"><ArrowLeft size={16} /> Retour aux notes</Link><Badge variant="outline">S2 · UE 1 Informatique</Badge></div>
      <div className="detail-title-row"><div><h1>Algorithmique &amp; Structures de Données</h1><p>M. Delorme · Coeff 4 · 6 Crédits ECTS</p></div><Badge variant="success"><CheckCircle2 size={13} /> VALIDÉ</Badge></div>
      <section className="subject-current-panel"><div className="section-heading"><span>MOYENNE ACTUELLE</span><Badge variant="success"><TrendingUp size={13} /> +2.10 vs Promo</Badge></div><div className="subject-score-main">14.20 <small>/ 20</small><span>Promo: 12.10</span></div><div className="objective-row"><span>Objectif personnel (15.00)</span><strong>94.6% atteint</strong></div><div className="subject-progress"><span className="validated" style={{ width: '94.6%' }} /></div><div className="objective-row muted"><span>Seuil: 10.00</span><span>Cible: 15.00</span></div></section>
      <div className="detail-actions"><Link className="secondary-action" href="/simulator">▦ Simuler note</Link><Link className="primary-action" href="/subjects?add=1"><Plus size={17} /> Ajouter note</Link></div>
      <section className="detail-panel"><div className="section-heading"><h2><TrendingUp size={16} /> Évolution du semestre</h2><span>4 évaluations</span></div><div className="detail-chart"><svg viewBox="0 0 360 120" preserveAspectRatio="none"><path d="M10 91 C57 85 79 77 118 75 S174 54 213 43 S272 42 350 57" fill="none" stroke="#3526e9" strokeWidth="3" /><path d="M10 91 C57 85 79 77 118 75 S174 54 213 43 S272 42 350 57 L350 112 L10 112Z" fill="#e9e9ff" />{[[10,91],[118,75],[213,43],[350,57]].map(([x,y], index) => <g key={x}><circle cx={x} cy={y} r="4" fill="white" stroke="#3526e9" strokeWidth="2" /><text x={x} y={Number(y)-10} textAnchor="middle" fontSize="9" fill="#111827">{['13.0','13.5','15.0','14.2'][index]}</text></g>)}</svg><div className="analytics-chart-labels"><span>Octobre</span><span>Novembre</span><span>Décembre</span><span>Janvier</span></div></div></section>
      <section className="upcoming-exam"><div><span><BellRing size={18} /></span><div><strong>Examen Final Écrit</strong><p>15 Février · Coeff 4 · Durée 3h00</p></div><Badge variant="info">J-3</Badge></div><p>⚡ Poids critique : représente <strong>40%</strong> de la note finale UE</p></section>
      <section className="assessment-detail-list"><div className="section-heading"><h2>Évaluations Détaillées</h2><span>3 / 4 passées</span></div>{assessments.map((item) => <article className="detail-assessment" key={item.title}><div><h3>{item.title}</h3><p>{item.date} · Coeff 1 · {item.type}</p></div><div className="detail-grade"><strong>{item.grade}</strong><small>/20</small><span>{item.delta}</span></div><div className="assessment-stat-line"><span>Min: {item.min}</span><span>Moy. promo: {item.avg}</span><span>Max: {item.max}</span></div></article>)}</section>
      <section className="learning-diagnostic"><h2><Sparkles size={17} /> Diagnostic &amp; Analyse d&apos;Apprentissage</h2><article><span><CheckCircle2 size={16} /></span><div><strong>POINT FORT IDENTIFIÉ</strong><p>Excellente maîtrise de la récursivité et des graphes orientés.</p></div></article><article><span><Lightbulb size={16} /></span><div><strong>AXE DE RÉVISION RECOMMANDÉ</strong><p>Optimisation de la complexité spatiale et temporelle (O(n log n)).</p></div></article></section>
      <Button className="w-full mt-4"><Plus size={16} className="mr-2" />Ajouter une évaluation</Button>
    </AppLayout>
  );
}
