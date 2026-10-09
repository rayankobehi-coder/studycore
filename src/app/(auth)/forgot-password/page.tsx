'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { Mail, MailCheck } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const client = getSupabaseClient();
    if (!client) { setError('La réinitialisation sera disponible dès que la connexion est configurée.'); return; }
    setLoading(true); setError('');
    const { error: resetError } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    setSent(true);
  }

  return (
    <AuthShell title="Mot de passe oublié" lead="Indique ton email, nous t’enverrons un lien sécurisé.">
      {sent ? (
        <div className="alert alert-success" role="status"><MailCheck size={18} /><span>Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vient d’être envoyé.</span></div>
      ) : (
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          <div className="field"><label htmlFor="email">Adresse email</label><div className="input-with-icon"><Mail size={17} /><input id="email" type="email" className="input" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" /></div></div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <Button type="submit" size="lg" loading={loading}>Envoyer le lien</Button>
        </form>
      )}
      <p className="auth-foot"><Link href="/login" className="text-link">← Retour à la connexion</Link></p>
    </AuthShell>
  );
}
