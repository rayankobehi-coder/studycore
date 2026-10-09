'use client';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/fields';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { uid, dateKey } from '@/lib/workspace/dates';
import type { Workspace } from '@/lib/workspace/types';
import type { AssessmentType, Subject } from '@/lib/types';

export const assessmentTypes: { value: AssessmentType; label: string }[] = [
  { value: 'CONTROLE_CONTINU', label: 'Contrôle continu' }, { value: 'TP', label: 'Travaux pratiques' },
  { value: 'DEVOIR', label: 'Devoir' }, { value: 'DEVOIR_SURVEILLE', label: 'Devoir surveillé' },
  { value: 'INTERROGATION', label: 'Interrogation' }, { value: 'PROJET', label: 'Projet' },
  { value: 'ORAL', label: 'Oral' }, { value: 'EXPOSE', label: 'Exposé' }, { value: 'EXAMEN', label: 'Examen' },
  { value: 'PARTIEL', label: 'Partiel' }, { value: 'EXAMEN_FINAL', label: 'Examen final' }, { value: 'RATTRAPAGE', label: 'Rattrapage' }, { value: 'BONUS', label: 'Bonus' },
];
export const palette = ['#7771eb', '#5b95cc', '#ca9860', '#639c88', '#aa7fba', '#c27f82', '#698da1', '#939263', '#9a8fbb', '#749da6'];

/** Each form lives inside its dialog content, so it is mounted fresh (and reset) every time the dialog opens. */
function Modal({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string; children: ReactNode }) {
  return <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>{children}</Dialog>;
}

export function AddSubjectDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated?: (id: string) => void }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Ajouter une matière" description="Renseigne ce qui sert au calcul. Tu ajouteras les notes ensuite.">
      <AddSubjectForm onDone={id => { onCreated?.(id); onOpenChange(false); }} onCancel={() => onOpenChange(false)} />
    </Modal>
  );
}

function AddSubjectForm({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { data, update } = useWorkspace();
  const [form, setForm] = useState({ name: '', code: '', coefficient: '2', credits: '3', semesterId: data.activeSemesterId === 'all' ? data.semesters[0]?.id ?? 's1' : data.activeSemesterId, color: palette[0] });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    const coefficient = Number(form.coefficient); const credits = Number(form.credits);
    if (!form.name.trim()) return setError('Donne un nom à la matière.');
    if (!(coefficient > 0)) return setError('Le coefficient doit être supérieur à 0.');
    if (!(credits >= 0)) return setError('Les crédits ne peuvent pas être négatifs.');
    if (data.subjects.some(s => s.name.toLowerCase() === form.name.trim().toLowerCase() && s.semesterId === form.semesterId)) return setError('Cette matière existe déjà dans ce semestre.');
    const id = uid();
    const now = new Date().toISOString();
    const ok = update(current => ({
      ...current,
      subjects: [...current.subjects, { id, name: form.name.trim(), code: (form.code || form.name.slice(0, 4)).trim().toUpperCase(), coefficient, credits, passingGrade: current.rules.passingGrade, color: form.color, semesterId: form.semesterId, unitId: 'informatique', teacherName: '', createdAt: now, updatedAt: now }],
      credits: [...current.credits, { id: `credit-${id}`, studentId: 'me', subjectId: id, unitId: 'informatique', creditsEarned: 0, creditsTotal: credits, status: 'IN_PROGRESS' }],
    }), 'Matière ajoutée');
    if (ok) onDone(id);
  }

  return (
    <form onSubmit={submit} className="stack" style={{ gap: 16 }}>
      <div className="form-grid">
        <div className="span-2"><Input label="Nom de la matière" value={form.name} onChange={set('name')} placeholder="Ex. Systèmes d’exploitation" required autoFocus /></div>
        <Input label="Code" value={form.code} onChange={set('code')} placeholder="SYS" maxLength={8} />
        <Select label="Semestre" value={form.semesterId} onChange={set('semesterId')}>{data.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
        <Input label="Coefficient" type="number" min="0.5" step="0.5" value={form.coefficient} onChange={set('coefficient')} />
        <Input label="Crédits ECTS" type="number" min="0" step="1" value={form.credits} onChange={set('credits')} />
      </div>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field-label" style={{ marginBottom: 8 }}>Couleur</legend>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          {palette.map(color => <button type="button" key={color} aria-label={`Couleur ${color}`} aria-pressed={form.color === color} onClick={() => setForm(f => ({ ...f, color }))} style={{ width: 30, height: 30, borderRadius: '50%', background: color, border: form.color === color ? '3px solid var(--surface)' : '1px solid var(--line-strong)', boxShadow: form.color === color ? `0 0 0 2px ${color}` : 'none' }} />)}
        </div>
      </fieldset>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="dialog-actions"><Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button><Button type="submit">Ajouter la matière</Button></div>
    </form>
  );
}

export interface GradeDraft { subjectId: string; name: string; type: AssessmentType; coefficient: number; date: string; value: number; scale: number }

export function createGradeInWorkspace(current: Workspace, draft: GradeDraft): Workspace {
  const assessmentId = uid();
  const now = new Date().toISOString();
  return {
    ...current,
    assessments: [...current.assessments, { id: assessmentId, subjectId: draft.subjectId, name: draft.name, type: draft.type, coefficient: draft.coefficient, date: draft.date, createdAt: now, updatedAt: now }],
    grades: [...current.grades, { id: uid(), assessmentId, subjectId: draft.subjectId, studentId: 'me', value: draft.value, scale: draft.scale, createdAt: now, updatedAt: now }],
  };
}

export function EditGradeDialog({ open, onOpenChange, gradeId, subject }: { open: boolean; onOpenChange: (v: boolean) => void; gradeId: string | null; subject: Subject }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Modifier la note" description={subject.name}>
      {gradeId && <EditGradeForm gradeId={gradeId} onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />}
    </Modal>
  );
}

function EditGradeForm({ gradeId, onDone, onCancel }: { gradeId: string; onDone: () => void; onCancel: () => void }) {
  const { data, update } = useWorkspace();
  const grade = data.grades.find(g => g.id === gradeId);
  const assessment = data.assessments.find(a => a.id === grade?.assessmentId);
  const [form, setForm] = useState({
    name: assessment?.name ?? '', type: (assessment?.type ?? 'DEVOIR') as AssessmentType, coefficient: String(assessment?.coefficient ?? 1),
    date: assessment?.date ?? dateKey(), value: String(grade?.value ?? ''), scale: String(grade?.scale ?? 20),
  });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = Number(form.value); const scale = Number(form.scale); const coefficient = Number(form.coefficient);
    if (!grade || !assessment) return setError('Cette note n’existe plus.');
    if (!Number.isFinite(value) || value < 0 || value > scale) return setError(`La note doit être comprise entre 0 et ${scale}.`);
    if (!(coefficient > 0)) return setError('Le coefficient doit être supérieur à 0.');
    const now = new Date().toISOString();
    const ok = update(current => ({
      ...current,
      assessments: current.assessments.map(a => a.id === assessment.id ? { ...a, name: form.name.trim() || a.name, type: form.type, coefficient, date: form.date, updatedAt: now } : a),
      grades: current.grades.map(g => g.id === grade.id ? { ...g, value, scale, updatedAt: now } : g),
    }), 'Note mise à jour');
    if (ok) onDone();
  }

  return (
    <form onSubmit={submit} className="stack" style={{ gap: 16 }}>
      <div className="form-grid">
        <div className="span-2"><Input label="Intitulé" value={form.name} onChange={set('name')} /></div>
        <Select label="Type" value={form.type} onChange={set('type')}>{assessmentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select>
        <Input label="Date" type="date" value={form.date} onChange={set('date')} />
        <Input label="Note" type="number" step="0.25" min="0" value={form.value} onChange={set('value')} />
        <Input label="Coefficient" type="number" step="0.5" min="0.5" value={form.coefficient} onChange={set('coefficient')} />
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="dialog-actions"><Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button><Button type="submit">Enregistrer</Button></div>
    </form>
  );
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description: string; confirmLabel: string; onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="dialog-actions"><Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button><Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>{confirmLabel}</Button></div>
    </Dialog>
  );
}
