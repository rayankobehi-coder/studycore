'use client';

import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Check, ChevronDown, Download, Lightbulb, RefreshCw, Save, ShieldCheck, SlidersHorizontal, Target, TrendingUp } from 'lucide-react';

const subjects = [
  { name: 'Algorithmique & Structures', current: 14.2, coefficient: 4, final: 15.2 },
  { name: 'Réseaux', current: 13.8, coefficient: 3, final: 14.5 },
  { name: 'Base de données', current: 8.7, coefficient: 3, final: 13.8 },
  { name: 'Anglais', current: 16.4, coefficient: 2, final: 12 },
  { name: 'Mathématiques', current: 7.9, coefficient: 2, final: 11 },
];

export default function SimulatorPage() {
  const [mode, setMode] = useState<'Matière' | 'Semestre'>('Matière');
  const [subjectName, setSubjectName] = useState(subjects[0].name);
  const [grade, setGrade] = useState(16);
  const [target, setTarget] = useState(14);
  const subject = subjects.find((item) => item.name === subjectName) ?? subjects[0];
  const subjectAverage = subject.current + (grade - subject.current) * 0.11;
  const overall = useMemo(() => subjects.reduce((sum, item) => sum + item.current * item.coefficient, 0) / subjects.reduce((sum, item) => sum + item.coefficient, 0), []);
  const needed = Math.max(0, Math.min(20, subject.current + (target - overall) * 2.4));

  const reset = () => {
    setGrade(16);
    setTarget(14);
  };

  return (
    <AppLayout>
      <div className="screen-heading">
        <div><h1>Simulateur</h1><p>Teste différents scénarios sans modifier tes vraies notes.</p></div>
        <button type="button" className="round-tool-button" aria-label="Réinitialiser" onClick={reset}><Calculator size={19} /></button>
      </div>
      <div className="segmented-tabs simulator-tabs"><button type="button" className={mode === 'Matière' ? 'selected' : ''} onClick={() => setMode('Matière')}>Par Matière</button><button type="button" className={mode === 'Semestre' ? 'selected' : ''} onClick={() => setMode('Semestre')}>Objectif Semestre</button></div>

      {mode === 'Matière' ? <>
        <section className="sim-target-card">
          <div className="sim-card-label"><span>MATIÈRE CIBLÉE</span><Badge variant="info"><SlidersHorizontal size={13} /> Coeff. {subject.coefficient.toFixed(1)}</Badge></div>
          <label className="sim-subject-select"><span><Calculator size={19} /></span><select value={subjectName} onChange={(event) => setSubjectName(event.target.value)}>{subjects.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={17} /></label>
          <div className="sim-current-row"><span>Moyenne actuelle enregistrée</span><strong>{subject.current.toFixed(2)} <small>/ 20</small><i /></strong></div>
        </section>

        <section className="sim-card">
          <div className="sim-card-label"><div><span>SIMULATION EN DIRECT</span><h2>Examen Final Écrit</h2></div><Badge variant="outline">Pondération 50%</Badge></div>
          <div className="grade-slider-card"><span>Note d&apos;épreuve projetée</span><strong>{grade.toFixed(2)}<small> / 20</small></strong><div className="slider-row"><button type="button" onClick={() => setGrade((value) => Math.max(0, value - 0.5))} aria-label="Diminuer la note">−</button><input type="range" min="0" max="20" step="0.5" value={grade} onChange={(event) => setGrade(Number(event.target.value))} aria-label="Note projetée" /><button type="button" onClick={() => setGrade((value) => Math.min(20, value + 0.5))} aria-label="Augmenter la note">+</button></div></div>
          <div className="sim-result-grid"><div><span>Moyenne Matière</span><strong>{subjectAverage.toFixed(2)} <small>/ 20</small></strong><em>{subjectAverage >= subject.current ? '▲' : '▼'} {(subjectAverage - subject.current).toFixed(2)} pts</em></div><div><span>Moyenne Générale</span><strong>{(overall + (subjectAverage - subject.current) * subject.coefficient / 40).toFixed(2)} <small>/ 20</small></strong><em>▲ +0.05 pts</em></div></div>
        </section>

        <section className="sim-card projection-card">
          <div className="section-heading"><h2><TrendingUp size={17} /> Projection Continue</h2><span>Seuil validation: 10/20</span></div>
          <div className="projection-chart"><div className="validation-line"><span>Seuil 10.0</span></div><svg viewBox="0 0 360 116" preserveAspectRatio="none" aria-label="Projection selon la note d'examen"><path d={`M8 105 L350 ${Math.max(14, 105 - grade * 4.4)}`} fill="none" stroke="#4a39ed" strokeWidth="3" /><circle cx="260" cy={Math.max(20, 105 - grade * 4.4)} r="6" fill="#4738ed" /></svg><div className="chart-grade-labels"><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span><span>16</span><span>20</span></div></div>
          <div className="projection-footer"><span>Note Examen visée</span><strong>Moyenne résultante : {subjectAverage.toFixed(2)}</strong></div>
        </section>

        <section className="sim-card target-calculator">
          <div className="section-heading"><h2><Target size={18} /> Calculateur d&apos;objectif cible</h2><span>Seuils officiels</span></div>
          <div className="target-options">{[10, 12, 14, 15].map((score) => <button type="button" className={target === score ? 'selected' : ''} key={score} onClick={() => setTarget(score)}>{score.toFixed(2)}/20</button>)}</div>
          <div className="target-result"><div><span>Note minimale requise à l&apos;Examen</span><Badge variant="success">Faisabilité 92%</Badge></div><strong>{needed.toFixed(2)} <small>/ 20</small></strong><p><ShieldCheck size={14} /> Objectif {needed < 12 ? 'très accessible' : 'atteignable'} avec un plan régulier de révision.</p><div className="subject-progress"><span className="validated" style={{ width: `${Math.min(100, needed * 5)}%` }} /></div></div>
        </section>
        <div className="strategy-tip"><span><Lightbulb size={20} /></span><div><strong>Conseil Stratégique</strong><p>3 devoirs passés analysés pour cette prédiction. Maintiens ton rythme pour sécuriser les crédits.</p></div><TrendingUp size={19} /></div>
        <Button className="w-full sim-save" onClick={() => window.localStorage.setItem('studycore-simulation', JSON.stringify({ subjectName, grade, target }))}><Save size={16} className="mr-2" />Sauvegarder ce scénario</Button>
        <Button variant="secondary" className="mt-2 w-full" onClick={reset}><RefreshCw size={15} className="mr-2" />Réinitialiser les valeurs</Button>
      </> : <>
        <section className="sim-semester-hero">
          <div className="sim-card-label"><span>PROJECTION SEMESTRE 2</span><Badge variant="success"><TrendingUp size={13} /> +1.13 pts</Badge></div>
          <h2>Cible : Mention Bien</h2>
          <div className="semester-results"><div><span>Moyenne actuelle</span><strong>{overall.toFixed(2)} <small>/ 20</small></strong><small>11 notes actées</small></div><div><span>Objectif visé</span><label><input type="number" min="0" max="20" step="0.5" value={target.toFixed(2)} onChange={(event) => setTarget(Number(event.target.value))} /><small>/ 20</small></label><small>Seuil minimal</small></div></div>
          <div className="semester-progress-line"><div><span>84% de l&apos;objectif sécurisé</span><strong>3 épreuves restantes</strong></div><div className="subject-progress"><span className="validated" style={{ width: '84%' }} /></div></div>
          <p className="semester-tip"><Check size={14} /> 3 épreuves restantes pour atteindre ta cible de mention.</p>
        </section>
        <div className="section-heading scenario-heading"><h2>Scénarios pré-calculés</h2><span>3 alternatives</span></div>
        <div className="scenario-grid">{[{ label: 'MINIMUM', value: 10, detail: 'Validation' }, { label: 'RÉALISTE', value: target, detail: 'Équilibré' }, { label: 'AMBITIEUX', value: 15.5, detail: 'Mention TB' }].map((scenario) => <button type="button" key={scenario.label} className={`scenario-card ${scenario.value === target ? 'selected' : ''}`} onClick={() => setTarget(scenario.value)}><span>{scenario.label}</span><strong>{scenario.value.toFixed(2)}</strong><small>{scenario.detail}</small></button>)}</div>
        <div className="section-heading required-heading"><h2>Notes requises par matière</h2><span>Base : Scénario Réaliste</span></div>
        <div className="required-subjects">{subjects.map((item) => <article className={`required-subject ${item.current < 10 ? 'at-risk' : ''}`} key={item.name}><div><strong>{item.name}</strong><Badge variant="outline">Coeff {item.coefficient}</Badge><small>Moyenne actuelle : {item.current.toFixed(2)} / 20</small></div><div><strong className={item.current < 10 ? 'score-red' : ''}>{item.final.toFixed(2)} <small>/20</small></strong><small>Écart : +{Math.max(0, item.final - item.current).toFixed(1)}</small></div><Badge variant={item.current < 10 ? 'danger' : 'info'}>Effort {item.current < 10 ? 'Soutenu' : 'Modéré'}</Badge><span>{item.name === 'Anglais' ? 'TOEIC Blanc' : 'Examen final'} · 18 Déc</span></article>)}</div>
        <section className="sim-card effort-adjust"><div className="section-heading"><h2><SlidersHorizontal size={17} /> Ajustement manuel de l&apos;effort</h2><span>Compensé</span></div><p>Modifie la cible d&apos;une matière pour redistribuer l&apos;exigence sur les autres coefficients.</p>{subjects.slice(0, 2).map((item) => <label className="effort-slider" key={item.name}><span>{item.name} (Coeff {item.coefficient}) <strong>{item.final.toFixed(2)} / 20</strong></span><input type="range" min="0" max="20" defaultValue={item.final} /><small>10.0 (Min) <span>Effort accru (+2.0 pts)</span> 18.0 (Max)</small></label>)}<div className="strategy-tip"><Lightbulb size={16} /><p>Un investissement ciblé compense plus efficacement les matières à enjeu élevé.</p></div></section>
        <Button className="w-full sim-save"><Check size={16} className="mr-2" />Appliquer comme plan de révision</Button>
        <Button variant="secondary" className="mt-2 w-full"><Download size={15} className="mr-2" />Exporter le scénario PDF / Synthèse</Button>
      </>}
    </AppLayout>
  );
}
