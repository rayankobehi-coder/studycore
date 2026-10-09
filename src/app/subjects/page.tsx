'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  GraduationCap,
  Info,
  Plus,
  Search,
  Star,
  X,
} from 'lucide-react';

type Assessment = { name: string; grade: number; type: string };
type Subject = {
  name: string;
  coefficient: number;
  credits: number;
  average: number;
  status: 'VALIDÉE' | 'À SURVEILLER' | 'À RISQUE';
  unit: string;
  assessments: Assessment[];
};

const startingSubjects: Subject[] = [
  { name: 'Algorithmique', coefficient: 4, credits: 6, average: 14.2, status: 'VALIDÉE', unit: 'UE 1 : Dév & Algorithmique', assessments: [{ name: 'CC 1', grade: 15, type: 'CC' }, { name: 'TP Noté', grade: 13, type: 'TP' }, { name: 'Partiel', grade: 14.5, type: 'Examen' }] },
  { name: 'Développement Web', coefficient: 3, credits: 6, average: 15.1, status: 'VALIDÉE', unit: 'UE 1 : Dév & Algorithmique', assessments: [{ name: 'Projet Vue.js', grade: 16, type: 'Projet' }, { name: 'QCM Frameworks', grade: 13.5, type: 'QCM' }] },
  { name: 'Réseaux & Télécoms', coefficient: 3, credits: 6, average: 13.8, status: 'VALIDÉE', unit: 'UE 2 : Systèmes & Réseaux', assessments: [{ name: 'Wireshark Rendu', grade: 14, type: 'TP' }, { name: 'DS Routage IP', grade: 13.5, type: 'DS' }] },
  { name: 'Bases de Données', coefficient: 3, credits: 6, average: 8.7, status: 'À SURVEILLER', unit: 'UE 2 : Systèmes & Réseaux', assessments: [{ name: 'Modèle Relationnel', grade: 9, type: 'Projet' }, { name: 'Interro SQL', grade: 8, type: 'DS' }] },
  { name: 'Mathématiques', coefficient: 2, credits: 3, average: 7.9, status: 'À RISQUE', unit: 'UE 3 : Sciences & Outils', assessments: [{ name: 'Algèbre Linéaire', grade: 8, type: 'Examen' }, { name: 'Probabilités', grade: 7.5, type: 'DS' }] },
  { name: 'Anglais Professionnel', coefficient: 2, credits: 3, average: 16.4, status: 'VALIDÉE', unit: 'UE 3 : Sciences & Outils', assessments: [{ name: 'TOEIC Blanc', grade: 17, type: 'CC' }, { name: 'Pitch Présentation', grade: 15.5, type: 'Oral' }] },
];

const stateClass: Record<Subject['status'], string> = {
  VALIDÉE: 'validated',
  'À SURVEILLER': 'watch',
  'À RISQUE': 'risk',
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(startingSubjects);
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState('Toutes');
  const [activeSemester, setActiveSemester] = useState('Semestre 2');
  const [showNewGrade, setShowNewGrade] = useState(false);
  const [gradeSubject, setGradeSubject] = useState(startingSubjects[0].name);
  const [grade, setGrade] = useState(15.5);
  const [weight, setWeight] = useState(2);
  const [semester, setSemester] = useState('S2');
  const [assessmentName, setAssessmentName] = useState('Examen Final');
  const [assessmentType, setAssessmentType] = useState('Examen');

  const visibleSubjects = useMemo(
    () => subjects.filter((subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase())
    && (
      unitFilter === 'Toutes'
      || (unitFilter === 'UE Info' && subject.unit.includes('UE 1'))
      || (unitFilter === 'UE Maths' && subject.name === 'Mathématiques')
      || (unitFilter === 'UE Pro' && subject.name === 'Anglais Professionnel')
    )
    ),
    [search, subjects, unitFilter],
  );
  const overall = subjects.reduce((sum, item) => sum + item.average * item.coefficient, 0)
    / subjects.reduce((sum, item) => sum + item.coefficient, 0);

  const saveAssessment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubjects((current) => current.map((subject) => {
      if (subject.name !== gradeSubject) return subject;
      const nextAverage = Number(((subject.average * subject.assessments.length + grade) / (subject.assessments.length + 1)).toFixed(2));
      return {
        ...subject,
        average: nextAverage,
        status: nextAverage >= 10 ? 'VALIDÉE' : nextAverage >= 9 ? 'À SURVEILLER' : 'À RISQUE',
        assessments: [...subject.assessments, { name: assessmentName, grade, type: assessmentType }],
      };
    }));
    setShowNewGrade(false);
  };

  const groupedUnits = [...new Set(visibleSubjects.map((subject) => subject.unit))];

  return (
    <AppLayout>
      <div className="screen-heading">
        <div><Badge variant="info">● BTS Informatique</Badge><h1>Notes &amp; Moyennes</h1><p>Centralise toutes tes évaluations et suis ta progression.</p></div>
        <button type="button" className="primary-action compact-action" onClick={() => setShowNewGrade(true)}><Plus size={17} /> Note</button>
      </div>

      <section className="grades-summary">
        <div className="grade-summary-copy"><p className="eyebrow">MOYENNE GÉNÉRALE</p><strong>{overall.toFixed(2)}<small> /20</small></strong><span className="trend-pill"><Check size={12} /> +0.8 pts</span></div>
        <div className="summary-graph" aria-hidden="true"><svg viewBox="0 0 120 40"><path d="M2 33 L32 25 L54 29 L79 14 L100 18 L118 5" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M2 33 L32 25 L54 29 L79 14 L100 18 L118 5 L118 40 L2 40Z" fill="currentColor" opacity=".09" /></svg></div>
        <div className="grade-summary-footer"><span><GraduationCap size={13} /> 24 évaluations</span><span><Star size={13} /> 5 Unités (UE)</span><span><CheckCircle2 size={13} /> 26 / 30 ECTS</span></div>
      </section>

      <div className="segmented-tabs" role="tablist" aria-label="Semestre">
        {['Semestre 1', 'Semestre 2', 'Année'].map((semester) => <button type="button" key={semester} className={activeSemester === semester ? 'selected' : ''} onClick={() => setActiveSemester(semester)}>{semester}</button>)}
      </div>

      <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une matière ou évaluation..." /></label>
      <div className="filter-pills">
        {['Toutes', 'UE Info', 'UE Maths', 'UE Pro'].map((filter) => <button type="button" key={filter} className={unitFilter === filter ? 'selected' : ''} onClick={() => setUnitFilter(filter)}>{filter}</button>)}
      </div>

      <div className="subject-groups">
        {groupedUnits.map((unit, index) => {
          const unitSubjects = visibleSubjects.filter((subject) => subject.unit === unit);
          const coefficient = unitSubjects.reduce((sum, subject) => sum + subject.coefficient, 0);
          const credits = unitSubjects.reduce((sum, subject) => sum + subject.credits, 0);
          return (
            <section className="subject-group" key={unit}>
              <div className="unit-heading"><span className={`unit-dot unit-${index + 1}`} /><h2>{unit}</h2><Badge variant="outline">Coeff {coefficient} · {credits} ECTS</Badge></div>
              {unitSubjects.map((subject) => (
                <Link className="subject-card" href="/subjects/algorithmique" key={subject.name}>
                  <div className="subject-card-heading"><div><strong>{subject.name}</strong><small>Coeff {subject.coefficient} · {subject.assessments.length} évaluations</small></div><span className={`subject-status ${stateClass[subject.status]}`}>{subject.status === 'VALIDÉE' ? 'VALIDÉ ✓' : subject.status}</span><div className="subject-average"><strong className={subject.average < 10 ? 'score-red' : ''}>{subject.average.toFixed(2)}</strong><small>/20</small></div><ChevronRight size={18} /></div>
                  <div className="subject-progress"><span className={stateClass[subject.status]} style={{ width: `${Math.min(subject.average * 5, 100)}%` }} /></div>
                  <div className="assessment-chips">{subject.assessments.map((assessment, assessmentIndex) => <span key={`${assessment.name}-${assessmentIndex}`}><small>{assessment.name}</small><strong className={assessment.grade < 10 ? 'score-red' : ''}>{assessment.grade.toFixed(1)}/20</strong></span>)}</div>
                </Link>
              ))}
            </section>
          );
        })}
      </div>

      <div className="soft-info"><span><Info size={17} /></span><p>Un 11/20 au prochain partiel de Maths validerait automatiquement ton UE grâce à la compensation.</p><ArrowRight size={16} /></div>

      {showNewGrade && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewGrade(false); }}>
          <section className="grade-modal" role="dialog" aria-modal="true" aria-labelledby="new-grade-title">
            <div className="modal-grabber" />
            <button type="button" className="modal-close" aria-label="Fermer" onClick={() => setShowNewGrade(false)}><X size={20} /></button>
            <h2 id="new-grade-title">Nouvelle Évaluation</h2>
            <p className="modal-description">Enregistre une note pour recalculer instantanément tes moyennes et crédits.</p>
            <form onSubmit={saveAssessment}>
              <label className="form-label">MATIÈRE &amp; UNITÉ</label>
              <div className="select-with-icon"><GraduationCap size={18} /><select value={gradeSubject} onChange={(event) => setGradeSubject(event.target.value)}>{subjects.map((subject) => <option key={subject.name}>{subject.name}</option>)}</select><ChevronDown size={17} /></div>
              <label className="form-label" htmlFor="assessment-name">NOM DE L&apos;ÉVALUATION</label>
              <input id="assessment-name" className="grade-input" value={assessmentName} onChange={(event) => setAssessmentName(event.target.value)} required />
              <div className="type-pills">{['Examen', 'DS', 'CC', 'TP', 'Projet'].map((type) => <button type="button" key={type} className={assessmentType === type ? 'selected' : ''} onClick={() => setAssessmentType(type)}>{type}</button>)}</div>
              <label className="form-label">NOTE OBTENUE &amp; BARÈME</label>
              <div className="grade-input-pair"><label><span>NOTE</span><input type="number" value={grade} min="0" max="20" step="0.25" onChange={(event) => setGrade(Number(event.target.value))} /><small>sur vingt</small></label><label><span>BARÈME</span><strong>/ 20</strong><small>points max</small></label></div>
              <label className="form-label">PONDÉRATION DANS L&apos;UE <span className="label-trailing">50% du bloc</span></label>
              <div className="coefficient-control"><button type="button" aria-label="Réduire le coefficient" onClick={() => setWeight((value) => Math.max(0.5, value - 0.5))}>−</button><span>Coeff <strong>{weight.toFixed(1)}</strong></span><button type="button" aria-label="Augmenter le coefficient" onClick={() => setWeight((value) => value + 0.5)}>+</button></div>
              <div className="grade-date-row"><label><span className="form-label">DATE</span><span className="date-input"><CalendarDays size={16} /><input type="date" defaultValue="2027-02-12" /></span></label><label><span className="form-label">SEMESTRE</span><span className="semester-switch"><button type="button" className={semester === 'S1' ? 'selected' : ''} onClick={() => setSemester('S1')}>S1</button><button type="button" className={semester === 'S2' ? 'selected' : ''} onClick={() => setSemester('S2')}>S2</button></span></label></div>
              <div className="impact-card"><div className="impact-header"><strong>IMPACT IMMÉDIAT</strong><Badge variant="success">Favorable</Badge></div><div className="impact-row"><span>Moyenne {gradeSubject}</span><strong>14.20 <span>→</span> {((14.2 * 3 + grade) / 4).toFixed(2)}</strong><b>+0.32 pts</b></div><div className="impact-row"><span>Moyenne Générale</span><strong>14.27 <span>→</span> {(overall + (grade - 14.2) / 20).toFixed(2)}</strong><b>+0.07 pts</b></div><small><Info size={13} /> Calcul prévisionnel avant validation du jury.</small></div>
              <button type="submit" className="primary-action save-grade"><CheckCircle2 size={18} /> Enregistrer la note</button>
              <div className="modal-footer"><button type="button" onClick={() => setShowNewGrade(false)}>Annuler</button><button type="submit"><CirclePlus size={16} /> Enregistrer &amp; continuer</button></div>
            </form>
          </section>
        </div>
      )}
    </AppLayout>
  );
}
