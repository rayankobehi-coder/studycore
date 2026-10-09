'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserRound, Eye, EyeOff, Play } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useWorkspace } from '@/components/providers/workspace-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { startDemo } = useWorkspace();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    const client = getSupabaseClient();
    if (!client) { setError('L’inscription sera disponible dès que la connexion est configurée. Explore la démo en attendant.'); return; }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setLoading(true); setError('');
    const { data, error: signUpError } = await client.auth.signUp({ email: form.email, password: form.password, options: { data: { first_name: form.firstName, last_name: form.lastName } } });
    if (signUpError) { setLoading(false); setError(signUpError.message); return; }
    if (data.user) {
      await client.from('profiles').insert({ user_id: data.user.id, first_name: form.firstName, last_name: form.lastName, role: 'STUDENT' });
    }
    setLoading(false);
    router.push('/onboarding');
  }

  return (
    <AuthShell title="Crée ton espace" lead="Quelques secondes suffisent. Tu configureras ton parcours ensuite.">
      <form onSubmit={handleRegister} className="stack" style={{ gap: 16 }}>
        <div className="form-grid" style={{ gap: 12 }}>
          <div className="field"><label htmlFor="firstName">Prénom</label><div className="input-with-icon"><UserRound size={17} /><input id="firstName" className="input" required autoComplete="given-name" value={form.firstName} onChange={set('firstName')} placeholder="Alex" /></div></div>
          <div className="field"><label htmlFor="lastName">Nom</label><input id="lastName" className="input" required autoComplete="family-name" value={form.lastName} onChange={set('lastName')} placeholder="Martin" /></div>
        </div>
        <div className="field"><label htmlFor="email">Adresse email</label><div className="input-with-icon"><Mail size={17} /><input id="email" className="input" type="email" required autoComplete="email" value={form.email} onChange={set('email')} placeholder="ton@email.com" /></div></div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <div className="input-with-icon"><Lock size={17} /><input id="password" className="input" type={showPassword ? 'text' : 'password'} required minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')} placeholder="8 caractères minimum" aria-describedby="password-hint" style={{ paddingRight: 48 }} />
            <button type="button" className="icon-button input-trailing" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Masquer' : 'Afficher'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          <p id="password-hint" className="field-hint">Ton mot de passe reste chiffré par Supabase Auth.</p>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <Button type="submit" size="lg" loading={loading}>Créer mon espace</Button>
      </form>
      <div className="divider-label">ou</div>
      <Button variant="outline" size="lg" type="button" onClick={startDemo}><Play size={17} />Explorer la démo sans compte</Button>
      <p className="auth-foot">Déjà inscrit ? <Link href="/login" className="text-link">Se connecter</Link></p>
    </AuthShell>
  );
}
