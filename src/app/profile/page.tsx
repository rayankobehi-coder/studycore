'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead } from '@/components/academic';
import { Avatar } from '@/components/brand/brand';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input, Select, Toggle } from '@/components/ui/fields';
import { Segmented } from '@/components/ui/segmented';
import { getGoalProgress } from '@/lib/workspace/selectors';
import { AcademicRuleSet } from '@/lib/engine/AcademicRuleSet';
import { LogOut, Lock, ShieldCheck, Target, Pencil, Settings2 } from 'lucide-react';
import type { FormationType } from '@/lib/types';

const formationLabels: Record<FormationType, string> = { COLLEGE: 'Collège', LYCEE_GENERAL: 'Lycée général', LYCEE_TECHNO: 'Lycée technologique', LYCEE_PRO: 'Lycée professionnel', BTS: 'BTS', LICENCE: 'Licence', MASTER: 'Master', FORMATION_PRO: 'Formation professionnelle', AUTRE: 'Autre' };

export default function ProfilePage() {
  const { data, update, theme, setTheme, signOut, userId } = useWorkspace();
  const [editOpen, setEditOpen] = useState(false);
  const p = data.profile;
  const dark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <AppLayout title="Profil">
      <PageHead eyebrow="Mon profil" title="Profil" description="Tes informations académiques et tes préférences." />
      <div className="split" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', alignItems: 'start' }}>
        <section className="panel stack" style={{ gap: 20, alignItems: 'start' }} aria-labelledby="identity">
          <div className="row" style={{ gap: 18 }}>
            <Avatar firstName={p.firstName} lastName={p.lastName} size="large" />
            <div>
              <h2 id="identity" style={{ fontSize: '1.45rem' }}>{p.firstName} {p.lastName}</h2>
              <p className="muted">{p.formation}</p>
              {data.isDemo && <span className="badge badge-warning" style={{ marginTop: 8 }}>Profil de démonstration</span>}
            </div>
          </div>
          <dl className="stack" style={{ gap: 14, width: '100%', margin: 0 }}>
            {[['Classe', p.className], ['Établissement', p.institution || 'Non renseigné'], ['Année académique', p.academicYear], ['Niveau', formationLabels[p.formationType]]].map(([k, v]) => (
              <div key={k} className="row-between" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 12 }}><dt className="small muted">{k}</dt><dd style={{ margin: 0, fontWeight: 600, textAlign: 'right' }}>{v}</dd></div>
            ))}
          </dl>
          <Button onClick={() => setEditOpen(true)}><Pencil size={16} />Modifier mon profil</Button>
        </section>

        <div className="stack" style={{ gap: 18 }}>
          <section className="panel" aria-labelledby="goals-h">
            <div className="panel-head"><h2 id="goals-h">Mes objectifs</h2><Link href="/goals" className="text-link">Gérer</Link></div>
            <div className="list">
              {data.goals.slice(0, 3).map(g => { const s = getGoalProgress(g, data); return (
                <div key={g.id} className="list-item"><span className="stat-icon"><Target size={16} /></span><div className="list-grow"><div className="list-title">{g.title}</div><div className="tiny muted">{Math.round(s.percent)} % atteint</div></div></div>
              ); })}
              {data.goals.length === 0 && <p className="small muted">Aucun objectif pour l’instant.</p>}
            </div>
          </section>

          <section className="panel" aria-labelledby="prefs-h">
            <h2 id="prefs-h" style={{ marginBottom: 6 }}>Mes préférences</h2>
            <Toggle label="Rappels d’examens" hint="Une alerte quand une échéance approche." checked={data.preferences.examReminders} onChange={v => update(c => ({ ...c, preferences: { ...c.preferences, examReminders: v } }))} />
            <Toggle label="Objectifs atteints" hint="Être prévenu quand un objectif est franchi." checked={data.preferences.goalUpdates} onChange={v => update(c => ({ ...c, preferences: { ...c.preferences, goalUpdates: v } }))} />
            <Toggle label="Rappels de révision" hint="Une notification au moment de tes sessions." checked={data.preferences.revisionReminders} onChange={v => update(c => ({ ...c, preferences: { ...c.preferences, revisionReminders: v } }))} />
            <div className="toggle-row">
              <div><label>Mode sombre</label><p className="small muted">Actuellement : {dark ? 'sombre' : 'clair'}.</p></div>
              <Segmented label="Thème" value={theme} onChange={setTheme} options={[{ value: 'light', label: 'Clair' }, { value: 'dark', label: 'Sombre' }, { value: 'system', label: 'Auto' }]} />
            </div>
          </section>

          <section className="panel" aria-labelledby="sec-h">
            <h2 id="sec-h" style={{ marginBottom: 12 }}>Sécurité & confidentialité</h2>
            <div className="stack" style={{ gap: 10 }}>
              <Link href="/settings" className="row list-item" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}><Lock size={18} className="muted" /><span className="list-grow">Mot de passe et sécurité</span><span className="faint">›</span></Link>
              <Link href="/settings" className="row list-item" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}><ShieldCheck size={18} className="muted" /><span className="list-grow">Confidentialité et export des données</span><span className="faint">›</span></Link>
              <Link href="/settings" className="row list-item" style={{ padding: '12px 0', borderBottom: 0 }}><Settings2 size={18} className="muted" /><span className="list-grow">Préférences académiques</span><span className="faint">›</span></Link>
            </div>
            <div className="divider" />
            <Button variant="destructive" onClick={signOut}><LogOut size={16} />{userId ? 'Se déconnecter' : 'Quitter la démo'}</Button>
          </section>
        </div>
      </div>
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </AppLayout>
  );
}

function EditProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data, update } = useWorkspace();
  const [form, setForm] = useState(() => ({ ...data.profile }));
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return setError('Prénom et nom sont requis.');
    const ok = update(c => ({ ...c, profile: { ...c.profile, ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim() }, rules: form.formationType !== c.profile.formationType ? AcademicRuleSet.fromFormationType(form.formationType).getConfig() : c.rules }), 'Profil mis à jour');
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (o) setForm({ ...data.profile }); onOpenChange(o); }} title="Modifier mon profil" description="Le niveau de formation applique les règles de calcul correspondantes.">
      <form onSubmit={submit} className="stack" style={{ gap: 16 }}>
        <div className="form-grid">
          <Input label="Prénom" value={form.firstName} onChange={set('firstName')} />
          <Input label="Nom" value={form.lastName} onChange={set('lastName')} />
          <div className="span-2"><Input label="Formation" value={form.formation} onChange={set('formation')} /></div>
          <div className="span-2"><Input label="Établissement" value={form.institution} onChange={set('institution')} /></div>
          <Select label="Niveau" value={form.formationType} onChange={set('formationType')}>{Object.entries(formationLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>
          <Input label="Classe / année" value={form.className} onChange={set('className')} />
          <div className="span-2"><Input label="Année académique" value={form.academicYear} onChange={set('academicYear')} /></div>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="dialog-actions"><Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Annuler</Button><Button type="submit">Enregistrer</Button></div>
      </form>
    </Dialog>
  );
}
