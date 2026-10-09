'use client';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Select } from '@/components/ui/fields';
import { EmptyState } from '@/components/ui/states';
import { FileText, ClipboardList, BookOpen, Search, Bookmark, BookmarkCheck, ThumbsUp, ArrowRight, Filter, FileCheck2 } from 'lucide-react';
import type { ResourceType } from '@/lib/types';

const typeMeta: Record<ResourceType, { label: string; icon: typeof FileText }> = {
  FICHE: { label: 'Fiche', icon: FileText }, ANNALE: { label: 'Annale', icon: ClipboardList }, EXERCICE: { label: 'Exercices', icon: FileCheck2 },
  PDF: { label: 'Cours', icon: BookOpen }, CORRIGE: { label: 'Corrigé', icon: FileCheck2 }, VIDEO: { label: 'Vidéo', icon: BookOpen }, LIEN: { label: 'Lien', icon: BookOpen },
};

export default function ResourcesPage() {
  return <Suspense fallback={null}><Resources /></Suspense>;
}

function Resources() {
  const { data, update } = useWorkspace();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get('q') ?? '';
  const [typedQuery, setTypedQuery] = useState<string | null>(null);
  const query = typedQuery ?? fromUrl;
  const setQuery = setTypedQuery;
  const [subject, setSubject] = useState('all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState<'votes' | 'recent'>('votes');

  const list = useMemo(() => data.resources
    .filter(r => subject === 'all' || r.subjectId === subject)
    .filter(r => type === 'all' || r.type === type)
    .filter(r => { const q = query.trim().toLowerCase(); return !q || [r.title, r.description, r.author].some(v => v?.toLowerCase().includes(q)); })
    .sort((a, b) => sort === 'votes' ? b.votes - a.votes : b.createdAt.localeCompare(a.createdAt)), [data.resources, subject, type, query, sort]);

  function toggleList(key: 'bookmarks' | 'upvotes', id: string) {
    update(current => {
      const has = current[key].includes(id);
      const nextList = has ? current[key].filter(x => x !== id) : [...current[key], id];
      const resources = key === 'upvotes' ? current.resources.map(r => r.id === id ? { ...r, votes: r.votes + (has ? -1 : 1) } : r) : current.resources;
      return { ...current, [key]: nextList, resources };
    });
  }

  return (
    <AppLayout title="Ressources">
      <PageHead eyebrow="Bibliothèque" title="Ressources" description="Fiches, annales et exercices partagés. Cherche, filtre, consulte." />
      <div className="panel" style={{ display: 'grid', gap: 14, padding: 18 }}>
        <div className="search" style={{ maxWidth: 'none' }}>
          <Search size={18} aria-hidden="true" />
          <label htmlFor="res-search" className="sr-only">Rechercher un cours, une fiche, un sujet</label>
          <input id="res-search" className="input" placeholder="Rechercher un cours, une fiche, un sujet..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Filter size={16} className="muted" aria-hidden="true" />
          <div style={{ minWidth: 200 }}><Select label="Matière" value={subject} onChange={e => setSubject(e.target.value)}><option value="all">Toutes les matières</option>{data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
          <div style={{ minWidth: 180 }}><Select label="Type" value={type} onChange={e => setType(e.target.value)}><option value="all">Tous les types</option>{Object.entries(typeMeta).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}</Select></div>
          <div style={{ minWidth: 180 }}><Select label="Trier par" value={sort} onChange={e => setSort(e.target.value as 'votes' | 'recent')}><option value="votes">Les mieux votées</option><option value="recent">Les plus récentes</option></Select></div>
        </div>
      </div>
      <p className="small muted" style={{ margin: '18px 0' }}>{list.length} ressource(s)</p>
      {list.length === 0 ? <EmptyState title="Aucune ressource ne correspond." description="Essaie un autre mot-clé ou retire un filtre." action={<button className="button button-outline" onClick={() => { setQuery(''); setSubject('all'); setType('all'); }}>Réinitialiser les filtres</button>} /> : (
        <div className="resource-grid">
          {list.map(resource => {
            const meta = typeMeta[resource.type];
            const Icon = meta.icon;
            const saved = data.bookmarks.includes(resource.id);
            const voted = data.upvotes.includes(resource.id);
            return (
              <article key={resource.id} className="resource rise">
                <div className="row-between">
                  <span className="resource-icon"><Icon size={21} /></span>
                  <button type="button" className="icon-button" aria-pressed={saved} aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => toggleList('bookmarks', resource.id)} style={{ color: saved ? 'var(--brand)' : undefined }}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button>
                </div>
                <div>
                  <span className="badge badge-brand" style={{ marginBottom: 10 }}>{meta.label}</span>
                  <h3>{resource.title}</h3>
                  <p className="small muted" style={{ marginTop: 6 }}>{resource.description}</p>
                </div>
                <div className="resource-meta">
                  <span>{data.subjects.find(s => s.id === resource.subjectId)?.name}</span><span>· {resource.author}</span><span>· {resource.year}</span><span>· {resource.readingMinutes} min</span>
                </div>
                <div className="row-between" style={{ marginTop: 'auto' }}>
                  <button type="button" className={`button button-sm ${voted ? 'button-primary' : 'button-secondary'}`} aria-pressed={voted} onClick={() => toggleList('upvotes', resource.id)}><ThumbsUp size={14} />{resource.votes}</button>
                  <Link href={`/resources/${resource.id}`} className="button button-outline button-sm">Consulter <ArrowRight size={14} /></Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
