'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, GraduationCap, School, BookOpen, Target, Sparkles, Users, Backpack } from 'lucide-react';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Brand } from '@/components/brand/brand';
import { AcademicRuleSet } from '@/lib/engine/AcademicRuleSet';
import type { FormationType } from '@/lib/types';

const who = [
  { id: 'COLLEGE', label: 'Collégien', icon: Backpack, hint: 'Brevet, collège' },
  { id: 'LYCEE_GENERAL', label: 'Lycéen', icon: BookOpen, hint: 'Lycée, baccalauréat' },
  { id: 'BTS', label: 'Étudiant BTS', icon: GraduationCap, hint: 'Brevet de technicien supérieur' },
  { id: 'LICENCE', label: 'Étudiant universitaire', icon: School, hint: 'Licence, master' },
  { id: 'AUTRE', label: 'Autre', icon: Users, hint: 'Formation professionnelle, autre' },
] as const;
const years = ['1re année', '2e année', '3e année', 'Année de mise à niveau', 'Autre'];
const goals = [
  { value: 14, label: 'Je veux atteindre 14/20', text: 'Une moyenne solide, sans stress.' },
  { value: 12, label: 'Je veux être au-dessus de 12/20', text: 'Progresser régulièrement.' },
  { value: 10, label: 'Valider mon semestre', text: 'Atteindre le seuil de validation.' },
];
const steps = ['Bienvenue', 'Qui es-tu ?', 'Établissement', 'Formation', 'Année', 'Objectif'];

export default function OnboardingPage() {
  const router = useRouter();
  const { data, update } = useWorkspace();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<FormationType>(data.profile.formationType);
  const [institution, setInstitution] = useState(data.profile.institution);
  const [formation, setFormation] = useState(data.profile.formation);
  const [year, setYear] = useState(data.profile.className || years[0]);
  const [goal, setGoal] = useState(14);
  const [firstName, setFirstName] = useState(data.profile.firstName);
  const [lastName, setLastName] = useState(data.profile.lastName);
  const [error, setError] = useState('');
  const progress = ((step + 1) / steps.length) * 100;

  function next() {
    if (step === 0) { setStep(1); return; }
    if (step === 1 && !type) { setError('Choisis ce qui te décrit le mieux.'); return; }
    if (step === 3 && formation.trim().length < 2) { setError('Indique ta formation, par exemple « BTS Informatique ».'); return; }
    setError('');
    if (step < steps.length - 1) { setStep(step + 1); return; }
    finish();
  }

  function finish() {
    update(current => ({
      ...current,
      profile: {
        ...current.profile,
        firstName: firstName.trim() || current.profile.firstName,
        lastName: lastName.trim() || current.profile.lastName,
        formationType: type,
        institution: institution.trim() || current.profile.institution,
        formation: formation.trim() || current.profile.formation,
        className: year,
        onboardingCompleted: true,
      },
      rules: AcademicRuleSet.fromFormationType(type).getConfig(),
      goals: current.goals.map(g => g.id === 'goal-average' ? { ...g, targetValue: goal, title: `Atteindre ${goal} de moyenne`, updatedAt: new Date().toISOString() } : g),
    }), 'Ton espace est prêt. Bienvenue !');
    router.push('/dashboard');
  }

  return (
    <div className="public-page" style={{ minHeight: '100vh' }}>
      <header className="public-nav"><Brand href="/" /><span className="small muted">Étape {step + 1} sur {steps.length}</span></header>
      <div className="wizard">
        <div className="stepper" aria-hidden="true" style={{ marginBottom: 14 }}>{steps.map((s, i) => <span key={s} className={`stepper-dot ${i <= step ? 'is-done' : ''}`} />)}</div>
        <div className="row-between" style={{ marginBottom: 22 }}>
          <span className="badge badge-brand">{steps[step]}</span>
          <div className="progress" style={{ width: 160 }} role="progressbar" aria-label="Progression de l’onboarding" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
        </div>
        <section className="wizard-card rise" key={step} aria-live="polite">
          {step === 0 && (
            <div className="stack" style={{ gap: 18 }}>
              <div className="empty-symbol" style={{ width: 64, height: 64 }}><Sparkles size={30} /></div>
              <h1>Bienvenue sur STUDYCORE</h1>
              <p className="muted">Ton centre de contrôle académique. Configurons ton espace en moins d’une minute : profil, formation et objectif.</p>
              <div className="form-grid" style={{ gap: 12, marginTop: 6 }}>
                <div className="field"><label htmlFor="fn">Prénom</label><input id="fn" className="input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" /></div>
                <div className="field"><label htmlFor="ln">Nom</label><input id="ln" className="input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Martin" /></div>
              </div>
            </div>
          )}
          {step === 1 && (
            <fieldset className="stack" style={{ gap: 16, border: 0, padding: 0, margin: 0 }}>
              <legend><h1 style={{ fontSize: '1.7rem' }}>Qui es-tu ?</h1></legend>
              <div className="choice-grid" role="radiogroup" aria-label="Ton niveau">
                {who.map(item => {
                  const Icon = item.icon;
                  const active = type === item.id;
                  return (
                    <button type="button" key={item.id} role="radio" aria-checked={active} className="choice" onClick={() => setType(item.id)}>
                      <Icon size={20} className="muted" />
                      <span>{item.label}<small>{item.hint}</small></span>
                      <span className="choice-mark">{active && <Check size={13} />}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
          {step === 2 && (
            <div className="stack" style={{ gap: 16 }}>
              <h1 style={{ fontSize: '1.7rem' }}>Ton établissement</h1>
              <p className="muted">Ce nom apparaît sur ton profil. Tu peux le modifier à tout moment.</p>
              <div className="field"><label htmlFor="inst">Établissement</label><input id="inst" className="input" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Ex. Lycée Jean Moulin" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="stack" style={{ gap: 16 }}>
              <h1 style={{ fontSize: '1.7rem' }}>Ta formation</h1>
              <p className="muted">Ta formation détermine les règles de calcul appliquées à tes moyennes.</p>
              <div className="field"><label htmlFor="form">Intitulé</label><input id="form" className="input" value={formation} onChange={e => setFormation(e.target.value)} placeholder="BTS Informatique de gestion" aria-invalid={Boolean(error)} /></div>
            </div>
          )}
          {step === 4 && (
            <fieldset className="stack" style={{ gap: 16, border: 0, padding: 0, margin: 0 }}>
              <legend><h1 style={{ fontSize: '1.7rem' }}>Ton année</h1></legend>
              <div className="choice-grid">
                {years.map(item => <button type="button" key={item} className="choice" aria-pressed={year === item} onClick={() => setYear(item)}><span>{item}</span><span className="choice-mark">{year === item && <Check size={13} />}</span></button>)}
              </div>
            </fieldset>
          )}
          {step === 5 && (
            <fieldset className="stack" style={{ gap: 16, border: 0, padding: 0, margin: 0 }}>
              <legend><h1 style={{ fontSize: '1.7rem' }}>Ton objectif</h1></legend>
              <div className="stack" style={{ gap: 10 }}>
                {goals.map(item => <button type="button" key={item.value} className="choice" style={{ minHeight: 76 }} aria-pressed={goal === item.value} onClick={() => setGoal(item.value)}><Target size={20} className="muted" /><span>{item.label}<small>{item.text}</small></span><span className="choice-mark">{goal === item.value && <Check size={13} />}</span></button>)}
              </div>
              <p className="small muted">Tu pourras ajouter d’autres objectifs depuis la page Objectifs.</p>
            </fieldset>
          )}
          {error && <div className="alert alert-danger" role="alert" style={{ marginTop: 18 }}>{error}</div>}
          <div className="dialog-actions" style={{ justifyContent: 'space-between', marginTop: 30 }}>
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}><ArrowLeft size={16} />Retour</Button>
            <Button onClick={next}>{step === steps.length - 1 ? 'Terminer' : 'Continuer'}<ArrowRight size={16} /></Button>
          </div>
        </section>
      </div>
    </div>
  );
}
