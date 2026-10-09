'use client';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/fields';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { uid, dateKey, minutes } from '@/lib/workspace/dates';
import { assessmentTypes } from './academic-dialogs';
import type { AssessmentType, ScheduleEventType } from '@/lib/types';

function Modal({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description: string; children: ReactNode }) {
  return <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>{children}</Dialog>;
}

export function AddEventDialog({ open, onOpenChange, defaultDate }: { open: boolean; onOpenChange: (v: boolean) => void; defaultDate: string }) {
  return <Modal open={open} onOpenChange={onOpenChange} title="Ajouter un événement" description="Cours, révision ou événement personnel."><EventForm defaultDate={defaultDate} onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} /></Modal>;
}

function EventForm({ defaultDate, onDone, onCancel }: { defaultDate: string; onDone: () => void; onCancel: () => void }) {
  const { data, update } = useWorkspace();
  const [form, setForm] = useState({ title: '', type: 'PERSONAL' as ScheduleEventType, date: defaultDate, start: '14:00', end: '15:30', room: '', subjectId: '' });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) return setError('Donne un titre à l’événement.');
    if (minutes(form.end) <= minutes(form.start)) return setError('L’heure de fin doit être après l’heure de début.');
    const ok = update(current => ({ ...current, events: [...current.events, { id: uid(), studentId: 'me', title: form.title.trim(), type: form.type, date: form.date, startTime: form.start, endTime: form.end, room: form.room || undefined, subjectId: form.subjectId || undefined }] }), 'Événement ajouté au planning');
    if (ok) onDone();
  }
  return (
    <form onSubmit={submit} className="stack" style={{ gap: 16 }}>
      <div className="form-grid">
        <div className="span-2"><Input label="Titre" value={form.title} onChange={set('title')} placeholder="Ex. Groupe de travail BDD" autoFocus /></div>
        <Select label="Type" value={form.type} onChange={set('type')}><option value="PERSONAL">Personnel</option><option value="REVISION">Révision</option><option value="COURSE">Cours</option></Select>
        <Select label="Matière (optionnel)" value={form.subjectId} onChange={set('subjectId')}><option value="">Aucune</option>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
        <Input label="Date" type="date" value={form.date} onChange={set('date')} />
        <Input label="Salle (optionnel)" value={form.room} onChange={set('room')} placeholder="B12" />
        <Input label="Début" type="time" value={form.start} onChange={set('start')} />
        <Input label="Fin" type="time" value={form.end} onChange={set('end')} />
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="dialog-actions"><Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button><Button type="submit">Ajouter</Button></div>
    </form>
  );
}

export function AddAssignmentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return <Modal open={open} onOpenChange={onOpenChange} title="Ajouter une échéance" description="Devoir, projet, oral ou examen."><AssignmentForm onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} /></Modal>;
}

function AssignmentForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const { data, update } = useWorkspace();
  const [form, setForm] = useState({ title: '', subjectId: data.subjects[0]?.id ?? '', type: 'DEVOIR' as AssessmentType, date: dateKey(), coefficient: '1', priority: '3', time: '90' });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.subjectId) return setError('Renseigne un intitulé et une matière.');
    const ok = update(current => ({ ...current, assignments: [...current.assignments, { id: uid(), studentId: 'me', subjectId: form.subjectId, title: form.title.trim(), type: form.type, dueDate: form.date, coefficient: Number(form.coefficient) || 1, priority: Number(form.priority), estimatedTime: Number(form.time) || 60, difficulty: 3, status: 'PENDING', createdAt: new Date().toISOString() }] }), 'Échéance ajoutée');
    if (ok) onDone();
  }
  return (
    <form onSubmit={submit} className="stack" style={{ gap: 16 }}>
      <div className="form-grid">
        <div className="span-2"><Input label="Intitulé" value={form.title} onChange={set('title')} placeholder="Ex. Examen de programmation" autoFocus /></div>
        <Select label="Matière" value={form.subjectId} onChange={set('subjectId')}>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
        <Select label="Type" value={form.type} onChange={set('type')}>{assessmentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</Select>
        <Input label="Date limite" type="date" value={form.date} onChange={set('date')} />
        <Input label="Coefficient" type="number" min="0.5" step="0.5" value={form.coefficient} onChange={set('coefficient')} />
        <Select label="Priorité" value={form.priority} onChange={set('priority')}><option value="5">Très haute</option><option value="4">Haute</option><option value="3">Moyenne</option><option value="2">Basse</option><option value="1">Très basse</option></Select>
        <Input label="Temps estimé (min)" type="number" min="15" step="15" value={form.time} onChange={set('time')} />
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="dialog-actions"><Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button><Button type="submit">Ajouter</Button></div>
    </form>
  );
}

export function AddGoalDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return <Modal open={open} onOpenChange={onOpenChange} title="Nouvel objectif" description="Un objectif clair se suit mieux. STUDYCORE calcule la progression pour toi."><GoalForm onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} /></Modal>;
}

function GoalForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const { data, update } = useWorkspace();
  const [form, setForm] = useState({ title: '', type: 'SUBJECT_GRADE' as 'SUBJECT_GRADE' | 'CREDITS' | 'OVERALL', subjectId: data.subjects[0]?.id ?? '', target: '12', deadline: '' });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const max = form.type === 'CREDITS' ? 300 : 20;

  function submit(event: FormEvent) {
    event.preventDefault();
    const target = Number(form.target);
    if (!form.title.trim()) return setError('Donne un nom à l’objectif.');
    if (!(target > 0 && target <= max)) return setError(`La cible doit être comprise entre 0 et ${max}.`);
    const now = new Date().toISOString();
    const ok = update(current => ({ ...current, goals: [...current.goals, { id: uid(), studentId: 'me', title: form.title.trim(), type: form.type, targetValue: target, subjectId: form.type === 'SUBJECT_GRADE' ? form.subjectId : undefined, deadline: form.deadline || undefined, status: 'ACTIVE', createdAt: now, updatedAt: now }] }), 'Objectif créé');
    if (ok) onDone();
  }
  return (
    <form onSubmit={submit} className="stack" style={{ gap: 16 }}>
      <div className="form-grid">
        <div className="span-2"><Input label="Nom de l’objectif" value={form.title} onChange={set('title')} placeholder="Ex. Passer Mathématiques à 11" autoFocus /></div>
        <Select label="Type" value={form.type} onChange={set('type')}><option value="SUBJECT_GRADE">Moyenne d’une matière</option><option value="OVERALL">Moyenne générale</option><option value="CREDITS">Crédits</option></Select>
        {form.type === 'SUBJECT_GRADE' && <Select label="Matière" value={form.subjectId} onChange={set('subjectId')}>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>}
        <Input label={form.type === 'CREDITS' ? 'Crédits visés' : 'Moyenne visée (/20)'} type="number" min="0" max={max} step="0.5" value={form.target} onChange={set('target')} />
        <Input label="Échéance (optionnel)" type="date" value={form.deadline} onChange={set('deadline')} />
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="dialog-actions"><Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button><Button type="submit">Créer l’objectif</Button></div>
    </form>
  );
}
