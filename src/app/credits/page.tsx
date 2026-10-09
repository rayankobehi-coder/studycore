'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CircleHelp, GraduationCap, Scale, Sparkles } from 'lucide-react';

const units = [
  { code: 'UE 1', title: 'Informatique Fondamentale', credits: 12, average: '14.65', status: 'VALIDÉE', subjects: [{ name: 'Algorithmique & C++', grade: '15.2/20', credits: 6 }, { name: 'Développement Web Avancé', grade: '14.1/20', credits: 6 }] },
  { code: 'UE 2', title: 'Systèmes, Réseaux & Données', credits: 10, average: '11.25', status: 'EN ATTENTE', subjects: [{ name: 'Architecture Réseaux IP', grade: '13.8/20', credits: 5 }, { name: 'Bases de Données Relationnelles', grade: '8.7/20', credits: 5 }] },
  { code: 'UE 3', title: 'Sciences Appliquées & Outils', credits: 8, average: '12.15', status: 'COMPENSABLE', subjects: [{ name: 'Anglais Professionnel', grade: '16.4/20', credits: 4 }, { name: "Mathématiques pour l'info", grade: '7.9/20', credits: 4 }] },
];

export default function CreditsPage() {
  const [activeTab, setActiveTab] = useState('Semestre 2');
  return (
    <AppLayout>
      <div className="screen-heading">
        <div><Badge variant="info">● SYSTÈME EUROPÉEN ECTS</Badge><h1>Crédits ECTS</h1><p>Comptabilise et valide tes crédits européens pour l&apos;obtention du diplôme.</p></div>
      </div>
      <div className="segmented-tabs credit-tabs">{['Semestre 2', 'Année 26-27', 'Cycle Global'].map((tab) => <button type="button" key={tab} className={activeTab === tab ? 'selected' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>

      <section className="credit-overview">
        <div className="credit-ring" style={{ '--credit-value': '70%' } as React.CSSProperties}><div><strong>42 <small>/ 60</small></strong><span>ECTS validés (70%)</span><Badge variant="success">↗ En bonne voie</Badge></div></div>
        <div className="credit-legend">
          <div><span className="legend-dot acquired" /><small>Acquis</small><strong>42</strong><span>ECTS sécurisés</span></div>
          <div><span className="legend-dot pending" /><small>En attente</small><strong>12</strong><span>Examens S2</span></div>
          <div><span className="legend-dot retry" /><small>Rattrapage</small><strong>6</strong><span>Session juin</span></div>
        </div>
      </section>

      <div className="unit-heading credits-heading"><GraduationCap size={17} /><h2>Unités d&apos;Enseignement (S2)</h2><span>3 Blocs</span></div>
      <div className="credit-units">
        {units.map((unit) => (
          <article className="credit-unit" key={unit.code}>
            <div className="credit-unit-head"><div><span>{unit.code} · {unit.credits} ECTS</span><h3>{unit.title}</h3><small>Moyenne générale : {unit.average} / 20</small></div><Badge variant={unit.status === 'VALIDÉE' ? 'success' : unit.status === 'EN ATTENTE' ? 'warning' : 'info'}>{unit.status}</Badge></div>
            <div className="credit-subjects">{unit.subjects.map((subject) => <div className="credit-subject" key={subject.name}><span className="credit-bullet" /><span>{subject.name}</span><strong className={subject.grade.startsWith('8') || subject.grade.startsWith('7') ? 'score-red' : ''}>{subject.grade}</strong><small>{subject.credits} ECTS</small></div>)}</div>
            <div className="credit-unit-footer"><span>Taux d&apos;acquisition bloc</span><strong>{unit.status === 'VALIDÉE' ? '12 / 12 ECTS Sécurisés' : unit.status === 'EN ATTENTE' ? '5 / 10 ECTS Sécurisés' : '4 / 8 ECTS acquis'}</strong></div>
          </article>
        ))}
      </div>

      <section className="degree-ladders">
        <div className="unit-heading"><GraduationCap size={17} /><h2>Paliers vers le Diplôme</h2><Badge variant="info">Niveau Bac+2</Badge></div>
        <div className="degree-step"><div><span>Passage en 2e année</span><strong>60 / 60 ECTS (100%)</strong></div><div className="subject-progress"><span className="validated" style={{ width: '100%' }} /></div></div>
        <div className="degree-step"><div><span>Obtention finale BTS SIO</span><strong>72 / 120 ECTS (60%)</strong></div><div className="subject-progress"><span style={{ width: '60%', background: '#5141ef' }} /></div></div>
        <div className="degree-step"><div><span>Passerelle Licence L3 <CircleHelp size={12} /></span><small>120 ECTS requis</small></div><div className="subject-progress"><span style={{ width: '38%', background: '#cfd2f4' }} /></div></div>
      </section>

      <section className="ects-rule"><div className="rule-title"><span><Scale size={17} /></span><div><strong>Règle d&apos;or ECTS</strong><p>Une Unité d&apos;Enseignement est définitivement acquise dès lors que la moyenne pondérée du bloc est supérieure ou égale à 10.00/20, sans note éliminatoire (&lt; 05.00/20).</p></div></div><Button className="w-full"><Sparkles size={16} className="mr-2" />Simuler l&apos;impact sur mes crédits<ArrowRight size={16} className="ml-2" /></Button></section>
    </AppLayout>
  );
}
