'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead, StatCard, StatusBadge, Grade, ProgressBarInline } from '@/components/academic';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/fields';
import { Alert, EmptyState, ErrorState, PageSkeleton } from '@/components/ui/states';
import { ProgressRing } from '@/components/ui/progress';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Plus, Sparkles, Trash2 } from 'lucide-react';

export default function DesignSystemPage() {
  const [tab, setTab] = useState<'a' | 'b' | 'c'>('a');
  const [loading, setLoading] = useState(false);
  return (
    <AppLayout title="Design system">
      <PageHead eyebrow="Référence" title="Système visuel STUDYCORE" description="Les composants, états et couleurs utilisés dans toute l’application. Ce qui est ici est ce que tu retrouves partout." />
      <section className="panel stack" style={{ gap: 18, marginBottom: 18 }}>
        <h2>Boutons</h2>
        <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
          <Button><Plus size={16} />Principal</Button>
          <Button variant="outline">Contour</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="ghost">Fantôme</Button>
          <Button variant="destructive"><Trash2 size={16} />Destructif</Button>
          <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }}>Chargement</Button>
          <Button disabled>Désactivé</Button>
        </div>
      </section>
      <section className="panel stack" style={{ gap: 18, marginBottom: 18 }}>
        <h2>Statuts académiques</h2>
        <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
          {(['VALIDATED', 'WARNING', 'FAILED', 'RETAKABLE', 'PENDING'] as const).map(s => <StatusBadge key={s} status={s} />)}
          <Badge variant="info">Information</Badge><Badge variant="brand">Accent</Badge>
        </div>
        <div className="row" style={{ gap: 28, flexWrap: 'wrap' }}>
          <Grade value={14.27} size="lg" />
          <Grade value={8.7} size="lg" />
          <ProgressRing value={70} size={110} stroke={9}><strong className="num">42</strong></ProgressRing>
          <div style={{ minWidth: 260 }}><ProgressBarInline value={82} /></div>
        </div>
      </section>
      <section className="panel stack" style={{ gap: 18, marginBottom: 18 }}>
        <h2>Formulaires & onglets</h2>
        <div className="form-grid">
          <Input label="Champ de saisie" placeholder="Ex. Algorithmique" hint="Texte d’aide sous le champ." />
          <Input label="Champ en erreur" defaultValue="22" error="La note doit être comprise entre 0 et 20." />
          <Select label="Liste"><option>Option 1</option><option>Option 2</option></Select>
        </div>
        <Tabs items={[{ value: 'a', label: 'Vue jour' }, { value: 'b', label: 'Vue semaine' }, { value: 'c', label: 'Vue mois' }]} value={tab} onChange={setTab} />
      </section>
      <section className="stats-grid" style={{ marginBottom: 18 }}>
        <StatCard label="Moyenne générale" value={<span className="num">14,27</span>} unit="/20" foot={<>+0,80 depuis le dernier semestre</>} />
        <StatCard label="Matières validées" tone="ok" value={<span className="num">8</span>} unit="/ 10" />
        <StatCard label="Échéances" tone="warn" value={<span className="num">3</span>} />
        <StatCard label="Examens" tone="danger" value={<span className="num">1</span>} />
      </section>
      <section className="stack" style={{ gap: 14, marginBottom: 18 }}>
        <h2>Alertes</h2>
        <Alert variant="success"><Sparkles size={18} />Semestre validé. Bravo, c’est une belle progression.</Alert>
        <Alert variant="warning">Cette matière nécessite ton attention.</Alert>
        <Alert variant="danger">Cette note est sous le seuil de validation.</Alert>
        <Alert variant="info">Ton examen approche dans 3 jours.</Alert>
      </section>
      <div className="three-col" style={{ marginBottom: 18 }}>
        <div className="panel"><h3 style={{ marginBottom: 12 }}>État vide</h3><EmptyState compact title="Tu n’as encore aucune note." description="Commence par ajouter ta première évaluation." action={<Button size="sm"><Plus size={14} />Ajouter une note</Button>} /></div>
        <div className="panel"><h3 style={{ marginBottom: 12 }}>État d’erreur</h3><ErrorState title="Une petite interruption." description="Impossible de charger cet espace." onRetry={() => undefined} /></div>
        <div className="panel"><h3 style={{ marginBottom: 12 }}>Chargement</h3><PageSkeleton /></div>
      </div>
    </AppLayout>
  );
}
