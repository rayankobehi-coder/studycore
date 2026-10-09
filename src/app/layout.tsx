import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';
import '@fontsource-variable/inter';
import './globals.css';
import { WorkspaceProvider } from '@/components/providers/workspace-provider';

export const metadata: Metadata = {
  title: { default: 'STUDYCORE : ton parcours, sous contrôle', template: '%s · STUDYCORE' },
  description: 'Comprends tes notes. Maîtrise ton parcours. Atteins tes objectifs. Notes, simulateur, crédits, planning et révisions dans un seul espace.',
  icons: { icon: '/logo.png', apple: '/logo.png' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#4f46e5' };

/** Dates (today, deadlines, countdowns) are evaluated per visit, never frozen at build time. */
async function RequestTime({ children }: { children: React.ReactNode }) {
  await connection();
  return children;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Suspense fallback={null}>
          <RequestTime>
            <WorkspaceProvider>{children}</WorkspaceProvider>
          </RequestTime>
        </Suspense>
      </body>
    </html>
  );
}
