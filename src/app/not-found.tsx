import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="legal" style={{ textAlign: 'center', minHeight: '70vh', display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 16 }}>
      <div className="empty-symbol" aria-hidden="true"><Compass size={28} strokeWidth={1.4} /></div>
      <p className="eyebrow">Erreur 404</p>
      <h1>Cette page n’existe pas.</h1>
      <p className="muted" style={{ maxWidth: 420 }}>Le lien est peut-être incorrect ou la page a été déplacée. Ton espace reste accessible.</p>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/dashboard" className="button button-primary">Retour à l’accueil</Link>
        <Link href="/aide" className="button button-secondary">Centre d’aide</Link>
      </div>
    </main>
  );
}
