'use client';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, Grade } from '@/components/academic';
import { assessmentTypes, createGradeInWorkspace } from '@/components/forms/academic-dialogs';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/fields';
import { getEngine, getSubjectResults } from '@/lib/workspace/selectors';
import { dateKey, number } from '@/lib/workspace/dates';
import { ArrowLeft, Check } from 'lucide-react';
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
  const setSubjectId = setChosenSubject;

  const subject = data.subjects.find(s => s.id === subjectId);
  const preview = useMemo(() => {
    const numeric = Number(value);
    if (!subject || value === '' || !Number.isFinite(numeric) || numeric < 0 || numeric > Number(scale)) return null;
    const before = getSubjectResults(data, 'all').find(r => r.subjectId === subject.id);
    const engine = getEngine(data);
    const future = [...data.grades.filter(g => g.subjectId === subject.id), { id: 'preview', assessmentId: 'preview', subjectId: subject.id, studentId: 'me', value: numeric, scale: Number(scale), createdAt: '', updatedAt: '' }];
    const assessments = [...data.assessments.filter(a => a.subjectId === subject.id), { id: 'preview', subjectId: subject.id, name: 'Aperçu', type: 'DEVOIR' as AssessmentType, coefficient: Number(coefficient) || 1, date, createdAt: '', updatedAt: '' }];
    const after = engine.calculateSubjectAverage(future, assessments, subject);
    return { before: before?.grades.length ? before.average : null, after: after.average, status: after.status };
  }, [data, subject, value, scale, coefficient, date]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const numeric = Number(value);
    if (!subject) return setError('Choisis une matière.');
    if (!name.trim()) return setError('Donne un intitulé à l’évaluation.');
    if (!Number.isFinite(numeric) || numeric < 0 || numeric > Number(scale)) return setError(`La note doit être comprise entre 0 et ${scale}.`);
    if (!(Number(coefficient) > 0)) return setError('Le coefficient doit être supérieur à 0.');
    const ok = update(current => createGradeInWorkspace(current, { subjectId: subject.id, name: name.trim(), type, coefficient: Number(coefficient), date, value: numeric, scale: Number(scale) }), 'Note ajoutée, moyenne recalculée');
    if (ok) router.push(`/subjects/${subject.id}`);
  }

  return (
    <AppLayout title="Ajouter une note">
      <Link href="/subjects" className="text-link" style={{ marginBottom: 14 }}><ArrowLeft size={14} />Retour aux matières</Link>
      <PageHead eyebrow="Saisie" title="Ajouter une note" description="Renseigne l’évaluation. La moyenne de la matière se met à jour automatiquement, selon les règles de ta formation." />
      {data.subjects.length === 0 ? (
        <div className="panel"><p className="muted">Ajoute d’abord une matière pour pouvoir saisir une note.</p><Link href="/subjects" className="button button-primary" style={{ marginTop: 14 }}>Ajouter une matière</Link></div>
      ) : (
        <div className="split">
          <form onSubmit={submit} className="panel stack" style={{ gap: 18 }} noValidate>
            <div className="form-grid">
              <Select label="Matière" value={subjectId} onChange={e => setSubjectId(e.target.value)} className="span-2">
                {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name} · coeff. {s.coefficient}</option>)}
              </Select>
              <div className="span-2"><Input label="Intitulé de l’évaluation" value={name} onChange={e => setName(e.target.value)} placeholder="Ex. Devoir surveillé n°2" required autoFocus /></div>
              <Select label="Type" value={type} onChange={e => setType(e.target.value as AssessmentType)}>{assessmentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select>
              <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
              <Input label="Note obtenue" type="number" inputMode="decimal" step="0.25" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder="14.5" required />
              <Select label="Barème" value={scale} onChange={e => setScale(e.target.value)}>
                <option value="20">/20</option><option value="10">/10</option><option value="40">/40</option><option value="100">/100</option>
              </Select>
              <Input label="Coefficient de l’évaluation" type="number" step="0.5" min="0.5" value={coefficient} onChange={e => setCoefficient(e.target.value)} hint="Pondère cette note dans la moyenne de la matière." />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className="dialog-actions" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
              <Button type="submit"><Check size={16} />Enregistrer la note</Button>
              <Link href="/subjects" className="button button-ghost">Annuler</Link>
            </div>
          </form>
          <aside className="panel stack" aria-label="Aperçu de l’impact" style={{ gap: 14 }}>
            <p className="eyebrow" style={{ marginBottom: 0 }}>Aperçu</p>
            <h2>Impact sur {subject?.name ?? 'la matière'}</h2>
            {preview ? (
              <div className="result-band">
                <span className="small muted">Nouvelle moyenne</span>
                <Grade value={preview.after} size="lg" />
                <span className="small muted">{preview.before !== null ? `Avant : ${number(preview.before)}/20 · variation ${preview.after - preview.before >= 0 ? '+' : ''}${number(preview.after - preview.before)}` : 'Première évaluation de cette matière.'}</span>
              </div>
            ) : <p className="muted small">Saisis une note pour voir son effet sur la moyenne.</p>}
            <p className="tiny faint">Calcul indicatif. Seule ta scolarité fait foi pour tes résultats officiels.</p>
          </aside>
        </div>
      )}
    </AppLayout>
  );
}
