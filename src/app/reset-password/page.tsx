'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase/client');
      const { error: resetError } = await supabase.auth.updateUser({ password });

      if (resetError) throw resetError;
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de réinitialiser le mot de passe.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Sparkles className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau mot de passe</h1>
          <p className="mt-2 text-gray-500">Choisis un mot de passe sécurisé</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répète le mot de passe"
                required
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
}
