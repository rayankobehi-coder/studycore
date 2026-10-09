'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2 } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (password !== confirm) { setError('Les deux mots de passe ne correspondent pas.'); return; }
    const client = getSupabaseClient();
    if (!client) { setError('La réinitialisation sera disponible dès que la connexion est configurée.'); return; }
    setLoading(true); setError('');
    const { error: updateError } = await client.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setDone(true);
    setTimeout(() => router.push('/dashboard'), 1200);
  }

  return (
    <AuthShell title="Nouveau mot de passe" lead="Choisis un mot de passe que tu n’utilises nulle part ailleurs.">
      {done ? <div className="alert alert-success" role="status"><CheckCircle2 size={18} /><span>Mot de passe mis à jour. Redirection…</span></div> : (
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          <div className="field"><label htmlFor="password">Nouveau mot de passe</label><div className="input-with-icon"><Lock size={17} /><input id="password" className="input" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></div></div>
          <div className="field"><label htmlFor="confirm">Confirmer</label><input id="confirm" className="input" type="password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <Button type="submit" size="lg" loading={loading}>Enregistrer</Button>
        </form>
      )}
    </AuthShell>
  );
}
