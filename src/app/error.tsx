'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/states';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="legal" style={{ minHeight: '70vh', display: 'grid', alignContent: 'center' }}>
      <ErrorState
        title="Une petite interruption."
        description="Un problème est survenu pendant l’affichage. Tes données ne sont pas modifiées. Réessaie ou reviens à l’accueil."
        onRetry={reset}
      />
      <p style={{ textAlign: 'center', marginTop: 16 }}><Link href="/dashboard" className="text-link">Retour à l’accueil</Link></p>
    </main>
  );
}
