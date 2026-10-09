'use client';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { assessmentTypes, createGradeInWorkspace } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { getEngine, getSubjectResults, getSummary } from '@/lib/workspace/selectors';
import { dateKey, number } from '@/lib/workspace/dates';
import { ArrowLeft, Check, CirclePlus, Minus, Plus } from 'lucide-react';
import type { AssessmentType } from '@/lib/types';

export default function NewGradePage() {
  return <Suspense fallback={null}><NewGradeForm /></Suspense>;
}

function NewGradeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get('subject');
  const { data, update } = useWorkspace();
  const [chosenSubject, setChosenSubject] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<AssessmentType>('DEVOIR');
  const [coefficient, setCoefficient] = useState('1');
  const [date, setDate] = useState(dateKey());
  const [value, setValue] = useState('');
  const [scale, setScale] = useState(String(data.rules.gradingScale));
  const [error, setError] = useState('');

  const validRequest = requested && data.subjects.some(s => s.id === requested) ? requested : null;
  const subjectId = chosenSubject ?? validRequest ?? data.subjects[0]?.id ?? '';
  const subject = data.subjects.find(s => s.id === subjectId);
  const coefficientValue = Number(coefficient) || 1;
  const coefficientValid = Number(coefficient) > 0;

  // Live impact: subject average and overall average, computed with the existing engine on a copy of the workspace.
  const preview = useMemo(() => {
    const numeric = Number(value);
    if (!subject || value === '' || !Number.isFinite(numeric) || numeric < 0 || numeric > Number(scale)) return null;
    const before = getSubjectResults(data, 'all').find(r => r.subjectId === subject.id);
    const engine = getEngine(data);
    const future = [...data.grades.filter(g => g.subjectId === subject.id), { id: 'preview', assessmentId: 'preview', subjectId: subject.id, studentId: 'me', value: numeric, scale: Number(scale), createdAt: '', updatedAt: '' }];
    const assessments = [...data.assessments.filter(a => a.subjectId === subject.id), { id: 'preview', subjectId: subject.id, name: 'Aperçu', type: 'DEVOIR' as AssessmentType, coefficient: coefficientValue, date, createdAt: '', updatedAt: '' }];
    const after = engine.calculateSubjectAverage(future, assessments, subject);
    const overallBefore = getSummary(data).average;
    const overallAfter = getSummary(createGradeInWorkspace(data, { subjectId: subject.id, name: 'Aperçu', type, coefficient: coefficientValue, date, value: numeric, scale: Number(scale) })).average;
    return { before: before?.grades.length ? before.average : null, after: after.average, status: after.status, overallBefore, overallAfter };
  }, [data, subject, value, scale, coefficientValue, date, type]);

  function submit(event: { preventDefault: () => void }, stay: boolean) {
    event.preventDefault();
    const numeric = Number(value);
    if (!subject) return setError('Choisis une matière.');
    if (!name.trim()) return setError('Donne un intitulé à l’évaluation.');
    if (!Number.isFinite(numeric) || numeric < 0 || numeric > Number(scale)) return setError(`La note doit être comprise entre 0 et ${scale}.`);
    if (!coefficientValid) return setError('Le coefficient doit être supérieur à 0.');
    setError('');
    const ok = update(current => createGradeInWorkspace(current, { subjectId: subject.id, name: name.trim(), type, coefficient: coefficientValue, date, value: numeric, scale: Number(scale) }), 'Note ajoutée, moyenne recalculée');
    if (!ok) return;
    if (stay) {
      setName(''); setValue('');
    } else {
      router.push(`/subjects/${subject.id}`);
    }
  }

  const stepCoefficient = (delta: number) => setCoefficient(String(Math.max(0.5, Math.round((coefficientValue + delta) * 2) / 2)));

  return (
    <AppLayout title="Ajouter une note">
      {data.subjects.length === 0 ? (
        <div className="panel"><p className="muted">Ajoute d’abord une matière pour pouvoir saisir une note.</p><Link href="/subjects" className="button button-primary" style={{ marginTop: 14 }}>Ajouter une matière</Link></div>
      ) : (
        <form onSubmit={event => submit(event, false)} className="ng" noValidate>
          <header className="nm-head">
            <div style={{ minWidth: 0 }}>
              <Link href="/subjects" className="text-link small"><ArrowLeft size={14} />Retour aux matières</Link>
              <h1 style={{ marginTop: 8 }}>Nouvelle évaluation</h1>
              <p>Enregistre une note pour recalculer instantanément tes moyennes.</p>
            </div>
          </header>

          <div className="ng-field">
            <label htmlFor="ng-subject" className="ng-label">Matière</label>
            <div className="ng-select">
              <span className="ng-select-icon" aria-hidden="true">{subject?.code?.slice(0, 3) ?? '—'}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ display: 'block' }}>{subject?.name}</strong>
                <span className="tiny muted">Coeff {subject?.coefficient} • {subject?.credits} crédits</span>
              </div>
              <select id="ng-subject" value={subjectId} onChange={e => setChosenSubject(e.target.value)} aria-label="Choisir la matière">
                {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name} · coeff. {s.coefficient}</option>)}
              </select>
            </div>
          </div>

          <div className="ng-field">
            <label htmlFor="ng-name" className="ng-label">Nom de l’évaluation</label>
            <input id="ng-name" className="ng-input" value={name} onChange={e => setName(e.target.value)} placeholder="Ex. Devoir surveillé n°2" autoFocus />
          </div>

          <div className="ng-field">
            <span className="ng-label">Type</span>
            <div className="ng-chips" role="group" aria-label="Type d’évaluation">
              {assessmentTypes.map(t => <button type="button" key={t.value} className={`ng-chip ${type === t.value ? 'is-active' : ''}`} aria-pressed={type === t.value} onClick={() => setType(t.value as AssessmentType)}>{t.label}</button>)}
            </div>
          </div>

          <div className="ng-grades">
            <div className="ng-box">
              <label htmlFor="ng-value" className="ng-label">Note obtenue</label>
              <div className="ng-big"><input id="ng-value" type="number" inputMode="decimal" step="0.25" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder="—" aria-label="Note obtenue" /></div>
              <span className="tiny muted">sur vingt</span>
            </div>
            <div className="ng-box">
              <label htmlFor="ng-scale" className="ng-label">Barème</label>
              <div className="ng-big ng-big-scale"><span className="faint">/</span><select id="ng-scale" value={scale} onChange={e => setScale(e.target.value)} aria-label="Barème"><option value="20">20</option><option value="10">10</option><option value="40">40</option><option value="100">100</option></select></div>
              <span className="tiny muted">points max</span>
            </div>
          </div>

          <div className="ng-field">
            <div className="row-between"><span className="ng-label">Pondération dans l’UE</span><span className="tiny" style={{ color: 'var(--brand)' }}>Coeff de l’évaluation</span></div>
            <div className="ng-stepper">
              <button type="button" className="icon-button" aria-label="Diminuer le coefficient" onClick={() => stepCoefficient(-0.5)}><Minus size={16} /></button>
              <label htmlFor="ng-coef" className="sr-only">Coefficient de l’évaluation</label>
              <input id="ng-coef" className="ng-coef" type="number" step="0.5" min="0.5" value={coefficient} onChange={e => setCoefficient(e.target.value)} />
              <button type="button" className="icon-button" aria-label="Augmenter le coefficient" onClick={() => stepCoefficient(0.5)}><Plus size={16} /></button>
            </div>
          </div>

          <div className="ng-row2">
            <div className="ng-field">
              <label htmlFor="ng-date" className="ng-label">Date</label>
              <input id="ng-date" className="ng-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <section className="ng-impact" aria-label="Aperçu de l’impact">
            <div className="row-between"><span className="dash-kicker">Impact immédiat</span><span className="badge badge-success">{preview && preview.overallAfter >= preview.overallBefore ? 'Favorable' : preview ? 'À surveiller' : 'En attente'}</span></div>
            {preview ? (
              <>
                <div className="ng-impact-row">
                  <span className="small muted">Moyenne {subject?.name}</span>
                  <strong className="num">{preview.before !== null ? number(preview.before) : '—'} → <span style={{ color: 'var(--brand)' }}>{number(preview.after)}</span></strong>
                </div>
                <div className="ng-impact-row">
                  <span className="small muted">Moyenne générale</span>
                  <strong className="num">{number(preview.overallBefore)} → <span style={{ color: 'var(--brand)' }}>{number(preview.overallAfter)}</span></strong>
                </div>
              </>
            ) : <p className="small muted">Saisis une note pour voir son effet sur tes moyennes.</p>}
            <p className="tiny faint">Calcul prévisionnel, indicatif, avant validation du jury.</p>
          </section>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <Button type="submit" size="lg" className="ng-submit"><Check size={16} />Enregistrer la note</Button>
          <div className="ng-footer">
            <Link href="/subjects" className="button button-ghost">Annuler</Link>
            <button type="button" className="button button-ghost" onClick={e => submit(e, true)}><CirclePlus size={16} />Enregistrer & continuer</button>
          </div>
        </form>
      )}
    </AppLayout>
  );
}
