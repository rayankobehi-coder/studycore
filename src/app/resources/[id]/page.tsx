'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { ArrowLeft, Bookmark, BookmarkCheck, ThumbsUp, Printer, Clock3 } from 'lucide-react';
import type { ReactNode } from 'react';

/** Minimal, safe renderer: headings, lists, code blocks. Text is always React children, never HTML. */
function renderContent(content: string): ReactNode[] {
  const blocks = content.split(/\n\s*\n/);
  return blocks.map((block, i) => {
    const lines = block.split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return null;
    if (lines[0].startsWith('# ')) return <h1 key={i}>{lines[0].slice(2)}</h1>;
    if (lines[0].startsWith('## ')) return <h2 key={i}>{lines[0].slice(3)}</h2>;
    if (/^SELECT |^CREATE |^\w+\s*=/.test(lines[0]) || lines.every(l => /;\s*$|^\s/.test(l) && /SELECT|FROM|JOIN|ON |WHERE/.test(l))) return <pre key={i}><code>{lines.join('\n')}</code></pre>;
    if (lines.every(l => /^\d+\.\s/.test(l))) return <ol key={i}>{lines.map((l, j) => <li key={j}>{l.replace(/^\d+\.\s/, '')}</li>)}</ol>;
    if (lines.every(l => /^- /.test(l))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
    return <p key={i}>{lines.join(' ')}</p>;
  });
}

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, update } = useWorkspace();
  const resource = data.resources.find(r => r.id === params.id);

  if (!resource) return <AppLayout title="Ressource"><EmptyState title="Cette ressource est introuvable." description="Elle a peut-être été retirée de la bibliothèque." action={<Link href="/resources" className="button button-primary">Retour aux ressources</Link>} /></AppLayout>;

  const saved = data.bookmarks.includes(resource.id);
  const voted = data.upvotes.includes(resource.id);
  const subject = data.subjects.find(s => s.id === resource.subjectId);

  function toggle(key: 'bookmarks' | 'upvotes') {
    update(current => {
      const has = current[key].includes(resource!.id);
      return {
        ...current,
        [key]: has ? current[key].filter(id => id !== resource!.id) : [...current[key], resource!.id],
        resources: key === 'upvotes' ? current.resources.map(r => r.id === resource!.id ? { ...r, votes: Math.max(0, r.votes + (has ? -1 : 1)) } : r) : current.resources,
      };
    }, undefined);
  }

  return (
    <AppLayout title="Ressource">
      <Link href="/resources" className="text-link" style={{ marginBottom: 14 }}><ArrowLeft size={14} />Ressources</Link>
      <div className="split" style={{ gridTemplateColumns: 'minmax(0,1fr) 300px', alignItems: 'start' }}>
        <article className="panel reader rise" style={{ padding: 'clamp(22px, 4vw, 44px)' }}>
          <p className="eyebrow">{subject?.name} · {resource.year}</p>
          {renderContent(resource.content)}
        </article>
        <aside className="stack" style={{ position: 'sticky', top: 100 }}>
          <section className="panel stack" style={{ gap: 14 }}>
            <span className="badge badge-brand" style={{ justifySelf: 'start' }}>{resource.type}</span>
            <h2>{resource.title}</h2>
            <p className="small muted">{resource.description}</p>
            <div className="kpi-inline">
              <div><strong>{resource.votes}</strong><span>votes</span></div>
              <div><strong>{resource.readingMinutes} min</strong><span>lecture</span></div>
            </div>
            <div className="small muted row" style={{ gap: 8 }}><Clock3 size={15} />Auteur : {resource.author}</div>
            <Button variant={voted ? 'primary' : 'secondary'} onClick={() => toggle('upvotes')} aria-pressed={voted}><ThumbsUp size={16} />{voted ? 'Vote enregistré' : 'Voter pour cette ressource'}</Button>
            <Button variant="outline" onClick={() => toggle('bookmarks')} aria-pressed={saved}>{saved ? <><BookmarkCheck size={16} />Dans mes favoris</> : <><Bookmark size={16} />Ajouter aux favoris</>}</Button>
            <Button variant="ghost" onClick={() => window.print()}><Printer size={16} />Imprimer</Button>
          </section>
          {subject && <Link href={`/subjects/${subject.id}`} className="button button-secondary">Aller à {subject.name}</Link>}
        </aside>
      </div>
    </AppLayout>
  );
}
