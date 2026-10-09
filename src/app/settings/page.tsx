'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Select, Toggle } from '@/components/ui/fields';
import { Segmented } from '@/components/ui/segmented';
import { ConfirmDialog } from '@/components/forms/academic-dialogs';
import { exportGrades, exportReport, exportWorkspace } from '@/lib/workspace/export';
import { parseWorkspace } from '@/lib/workspace/validation';
import { createDemoWorkspace } from '@/lib/workspace/demo';
import { Cloud, CloudOff, Download, Upload, RotateCcw, Trash2, FileSpreadsheet, FileText, KeyRound, Database } from 'lucide-react';
import type { Theme } from '@/lib/workspace/types';

export default function SettingsPage() {
  const { data, update, replace, theme, setTheme, syncStatus, syncError, retrySync, userId, toast } = useWorkspace();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState<null | 'reset' | 'demo'>(null);
  const rules = data.rules;
  const storageSize = typeof window !== 'undefined' ? Math.round(new Blob([JSON.stringify(data)]).size / 1024) : 0;

  function setRule<K extends keyof typeof rules>(key: K, value: (typeof rules)[K]) {
    update(c => ({ ...c, rules: { ...c.rules, [key]: value } }), 'Règle mise à jour, les moyennes sont recalculées');
  }

  async function importFile(file: File) {
    try {
      const text = await file.text();
      const parsed = parseWorkspace(JSON.parse(text));
      replace(parsed, 'Sauvegarde importée');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Fichier invalide', 'error');
    }
  }

  return (
    <AppLayout title="Paramètres">
      <PageHead eyebrow="Réglages" title="Paramètres" description="Compte, apparence, préférences académiques et tes données." />
      <div className="two-col">
        <div className="stack" style={{ gap: 18 }}>
          <section className="panel" aria-labelledby="account">
            <h2 id="account" style={{ marginBottom: 6 }}>Compte</h2>
            <p className="small muted" style={{ marginBottom: 16 }}>{userId ? 'Connecté à ton espace STUDYCORE.' : 'Mode démonstration : aucune donnée n’est envoyée au serveur.'}</p>
            <div className="stack" style={{ gap: 12 }}>
              <div className="row-between"><span className="small muted">Synchronisation</span><span className={`sync-pill sync-${syncStatus}`}><span className="sync-dot" />{{ loading: 'Chargement', local: 'Sur cet appareil', syncing: 'En cours…', synced: 'Synchronisé', error: 'À vérifier' }[syncStatus]}</span></div>
              {syncError && <div className="alert alert-warning" role="alert">{syncError}</div>}
              <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={retrySync}>{syncStatus === 'error' ? <CloudOff size={15} /> : <Cloud size={15} />}Réessayer la synchronisation</Button>
                <Link href="/forgot-password" className="button button-secondary button-sm"><KeyRound size={15} />Changer mon mot de passe</Link>
              </div>
            </div>
          </section>

          <section className="panel" aria-labelledby="appearance">
            <h2 id="appearance" style={{ marginBottom: 14 }}>Apparence</h2>
            <div className="row-between" style={{ gap: 14, flexWrap: 'wrap' }}>
              <div><strong>Thème</strong><p className="small muted">Clair, sombre, ou selon ton système.</p></div>
              <Segmented label="Thème de l’interface" value={theme} onChange={(v: Theme) => setTheme(v)} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} />
            </div>
          </section>

          <section className="panel" aria-labelledby="notif-s">
            <h2 id="notif-s" style={{ marginBottom: 6 }}>Notifications</h2>
            <Toggle label="Échéances et examens" hint="Rappels 7 jours avant chaque échéance." checked={data.preferences.examReminders} onChange={v => update(c => ({ ...c, preferences: { ...c.preferences, examReminders: v } }))} />
            <Toggle label="Objectifs" hint="Une alerte quand un objectif est atteint." checked={data.preferences.goalUpdates} onChange={v => update(c => ({ ...c, preferences: { ...c.preferences, goalUpdates: v } }))} />
            <Toggle label="Révisions" hint="Rappel de tes sessions du jour." checked={data.preferences.revisionReminders} onChange={v => update(c => ({ ...c, preferences: { ...c.preferences, revisionReminders: v } }))} />
          </section>
        </div>

        <div className="stack" style={{ gap: 18 }}>
          <section className="panel stack" style={{ gap: 16 }} aria-labelledby="academic">
            <div><h2 id="academic">Préférences académiques</h2><p className="small muted">Ces réglages pilotent le moteur de calcul. Vérifie-les avec ton règlement.</p></div>
            <div className="form-grid">
              <Select label="Barème" value={String(rules.gradingScale)} onChange={e => setRule('gradingScale', Number(e.target.value))}><option value="20">/20</option><option value="10">/10</option></Select>
              <Select label="Arrondi" value={rules.roundingMode} onChange={e => setRule('roundingMode', e.target.value as typeof rules.roundingMode)}><option value="STANDARD">Standard</option><option value="SUPERIOR">Supérieur</option><option value="INFERIOR">Inférieur</option><option value="BANKER">Bancaire</option></Select>
              <Select label="Seuil de validation" value={String(rules.passingGrade)} onChange={e => setRule('passingGrade', Number(e.target.value))}>{[8, 9, 10, 11, 12].map(v => <option key={v} value={v}>{v}/20</option>)}</Select>
              <Select label="Note éliminatoire" value={rules.eliminatoryGrade === null ? 'none' : String(rules.eliminatoryGrade)} onChange={e => setRule('eliminatoryGrade', e.target.value === 'none' ? null : Number(e.target.value))}><option value="none">Aucune</option>{[5, 6, 7, 8].map(v => <option key={v} value={v}>Moins de {v}/20</option>)}</Select>
            </div>
            <Toggle label="Compensation entre matières" hint="Une moyenne suffisante peut compenser une matière plus faible." checked={rules.compensationEnabled} onChange={v => setRule('compensationEnabled', v)} />
            <Toggle label="Suivi des crédits ECTS" checked={rules.creditsEnabled} onChange={v => setRule('creditsEnabled', v)} />
            <Toggle label="Rattrapage possible" checked={rules.retakeEnabled} onChange={v => setRule('retakeEnabled', v)} />
          </section>

          <section className="panel stack" style={{ gap: 14 }} aria-labelledby="privacy">
            <h2 id="privacy">Confidentialité & données</h2>
            <p className="small muted">Exporte tout ce que tu as saisi. Tu restes propriétaire de tes données.</p>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <Button variant="outline" size="sm" onClick={() => exportWorkspace(data)}><Download size={15} />Sauvegarde complète (JSON)</Button>
              <Button variant="outline" size="sm" onClick={() => exportGrades(data)}><FileSpreadsheet size={15} />Notes (CSV)</Button>
              <Button variant="outline" size="sm" onClick={() => exportReport(data)}><FileText size={15} />Bilan (Markdown)</Button>
            </div>
            <div className="divider" />
            <h3>Stockage</h3>
            <p className="small muted"><Database size={14} style={{ verticalAlign: -2 }} /> Environ {storageSize} Ko de données sur cet appareil.</p>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) void importFile(f); e.target.value = ''; }} />
              <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}><Upload size={15} />Importer une sauvegarde</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm('demo')}><RotateCcw size={15} />Rétablir les données de démo</Button>
              <Button variant="destructive" size="sm" onClick={() => setConfirm('reset')}><Trash2 size={15} />Effacer mes données</Button>
            </div>
          </section>
        </div>
      </div>
      <ConfirmDialog open={confirm === 'reset'} onOpenChange={o => !o && setConfirm(null)} title="Effacer toutes mes données ?" description="Matières, notes, planning et objectifs seront supprimés de cet appareil. Exporte une sauvegarde avant si besoin." confirmLabel="Tout effacer" onConfirm={() => replace({ ...createDemoWorkspace(), isDemo: false, subjects: [], assessments: [], grades: [], credits: [], events: [], assignments: [], sessions: [], goals: [], resources: data.resources, notifications: [], simulations: [], previousAverage: null, profile: { ...data.profile, onboardingCompleted: false } }, 'Données effacées')} />
      <ConfirmDialog open={confirm === 'demo'} onOpenChange={o => !o && setConfirm(null)} title="Rétablir la démo ?" description="Les données actuelles seront remplacées par le jeu de données fictif." confirmLabel="Rétablir" onConfirm={() => replace(createDemoWorkspace(), 'Données de démonstration rétablies')} />
      {false && update}
    </AppLayout>
  );
}
