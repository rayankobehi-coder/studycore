'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Play, AlertCircle } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useWorkspace } from '@/components/providers/workspace-provider';

export default function LoginPage() {
  const router = useRouter();
  const { startDemo } = useWorkspace();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const configured = Boolean(getSupabaseClient());

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    const client = getSupabaseClient();
    if (!client) { setError('La connexion n’est pas encore configurée. Tu peux explorer la démo en attendant.'); return; }
    setLoading(true); setError('');
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) { setError(signInError.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : signInError.message); return; }
    const next = new URLSearchParams(window.location.search).get('next');
    router.push(next && next.startsWith('/') ? next : '/dashboard');
  }

  return (
    <AuthShell title="Bon retour parmi nous" lead="Connecte-toi pour retrouver ton espace académique.">
      {!configured && <div className="alert alert-info"><AlertCircle size={18} /><span>Connexion en attente de configuration. La démo reste disponible et ne touche à aucune donnée réelle.</span></div>}
      <form onSubmit={handleLogin} className="stack" style={{ gap: 16 }} noValidate={false}>
        <div className="field">
          <label htmlFor="email">Adresse email</label>
          <div className="input-with-icon"><Mail size={17} /><input id="email" className="input" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" /></div>
        </div>
        <div className="field">
          <div className="row-between"><label htmlFor="password">Mot de passe</label><Link href="/forgot-password" className="text-link" style={{ fontSize: '0.82rem' }}>Mot de passe oublié ?</Link></div>
          <div className="input-with-icon">
            <Lock size={17} />
            <input id="password" className="input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: 48 }} />
            <button type="button" className="icon-button input-trailing" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>{loading ? 'Connexion…' : 'Se connecter'}</Button>
      </form>
      <div className="divider-label">ou</div>
      <Button variant="outline" size="lg" onClick={startDemo} type="button"><Play size={17} />Explorer la démo</Button>
      <p className="auth-foot">Pas encore de compte ? <Link href="/register" className="text-link">Créer mon espace</Link></p>
    </AuthShell>
  );
}
