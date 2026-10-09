'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { createDemoWorkspace, createEmptyWorkspace } from '@/lib/workspace/demo';
import { parseWorkspace } from '@/lib/workspace/validation';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Workspace, SyncStatus, Theme } from '@/lib/workspace/types';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info' }
interface WorkspaceContextValue {
  data: Workspace;
  loaded: boolean;
  update: (change: (data: Workspace) => Workspace, message?: string) => boolean;
  replace: (data: Workspace, message?: string) => boolean;
  toast: (message: string, type?: Toast['type']) => void;
  syncStatus: SyncStatus;
  syncError: string;
  userId: string | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  startDemo: () => void;
  signOut: () => Promise<void>;
  retrySync: () => void;
}
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
const demo = createDemoWorkspace();

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Workspace>(demo);
  const [loaded, setLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [syncError, setSyncError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setThemeState] = useState<Theme>('system');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const storageKey = useRef('studycore.local.v1');
  const cloudReady = useRef(false);
  const lastSaved = useRef('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const revision = useRef(0);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current.slice(-3), { id, message, type }]);
    timers.current.push(setTimeout(() => setToasts(current => current.filter(t => t.id !== id)), 5000));
  }, []);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      let initial = demo;
      let errorMessage = '';
      try {
        const client = getSupabaseClient();
        const demoMode = document.cookie.split('; ').includes('studycore_demo=true');
        if (client && !demoMode) {
          const { data: auth, error } = await client.auth.getUser();
          if (error) throw error;
          if (auth.user) {
            storageKey.current = `studycore.user.${auth.user.id}.v1`;
            if (active) setUserId(auth.user.id);
            initial = createEmptyWorkspace();
            initial.profile.firstName = auth.user.user_metadata.first_name ?? '';
            initial.profile.lastName = auth.user.user_metadata.last_name ?? '';
            const cached = localStorage.getItem(storageKey.current);
            if (cached) initial = parseWorkspace(JSON.parse(cached));
            const { data: saved, error: loadError } = await client.from('student_workspaces').select('state').eq('user_id', auth.user.id).maybeSingle();
            if (loadError) throw new Error('Synchronisation indisponible. Vérifie la migration student_workspaces dans Supabase. Tes modifications restent sur cet appareil.');
            if (saved?.state) initial = parseWorkspace(saved.state);
            cloudReady.current = true;
          } else {
            storageKey.current = 'studycore.demo.v1';
            const cached = localStorage.getItem(storageKey.current);
            if (cached) initial = parseWorkspace(JSON.parse(cached));
          }
        } else {
          storageKey.current = client ? 'studycore.demo.v1' : 'studycore.local.v1';
          const cached = localStorage.getItem(storageKey.current);
          if (cached) initial = parseWorkspace(JSON.parse(cached));
        }
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'La sauvegarde n’a pas pu être chargée.';
        // An invalid backup is preserved rather than silently overwritten.
        const original = localStorage.getItem(storageKey.current);
        if (original) {
          try { localStorage.setItem(`${storageKey.current}.recovery`, original); initial = parseWorkspace(JSON.parse(original)); } catch { /* Keep the original recovery copy. */ }
        }
      }
      if (active) {
        setData(initial); setSyncError(errorMessage); setLoaded(true);
        lastSaved.current = JSON.stringify(initial);
        setSyncStatus(errorMessage ? 'error' : cloudReady.current ? 'synced' : 'local');
      }
    }
    void hydrate();
    const pending = timers.current;
    return () => { active = false; pending.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    async function restoreTheme() {
      const saved = localStorage.getItem('studycore.theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') setThemeState(saved);
    }
    void restoreTheme();
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function apply() { document.documentElement.dataset.theme = theme === 'system' ? media.matches ? 'dark' : 'light' : theme; }
    apply(); media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  const setTheme = useCallback((value: Theme) => { setThemeState(value); localStorage.setItem('studycore.theme', value); }, []);

  useEffect(() => {
    if (!loaded) return;
    const serialized = JSON.stringify(data);
    if (serialized === lastSaved.current) return;
    const currentRevision = ++revision.current;
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem(storageKey.current, serialized);
        const client = getSupabaseClient();
        if (client && userId && cloudReady.current && !data.isDemo) {
          setSyncStatus('syncing');
          const { error } = await client.from('student_workspaces').upsert({ user_id: userId, state: data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
          if (error) throw new Error('Sauvegardé sur cet appareil, mais la synchronisation a échoué. Réessaie depuis les paramètres.');
          if (currentRevision === revision.current) setSyncStatus('synced');
        } else if (!syncError) setSyncStatus('local');
        lastSaved.current = serialized;
      } catch (error) {
        if (currentRevision === revision.current) {
          setSyncStatus('error'); setSyncError(error instanceof Error ? error.message : 'Impossible de sauvegarder les données.');
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [data, loaded, userId, syncError]);

  // Always read the latest snapshot synchronously, so several updates in one event stay consistent.
  const latest = useRef(demo);
  useEffect(() => { latest.current = data; }, [data]);
  const commit = useCallback((next: Workspace, message?: string, errorPrefix = 'Action impossible') => {
    try {
      const safe = parseWorkspace(next);
      latest.current = safe;
      setData(safe);
      if (message) toast(message);
      return true;
    } catch (error) {
      toast(`${errorPrefix} : ${error instanceof Error ? error.message : 'donnée invalide'}`, 'error');
      return false;
    }
  }, [toast]);
  const update = useCallback((change: (current: Workspace) => Workspace, message?: string) => {
    let next: Workspace;
    try { next = change(latest.current); } catch (error) {
      toast(error instanceof Error ? error.message : 'Action impossible', 'error');
      return false;
    }
    return commit(next, message);
  }, [commit, toast]);
  const replace = useCallback((next: Workspace, message?: string) => commit(next, message), [commit]);
  // Full navigation on purpose: the demo cookie must be read by the server proxy on the next request.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  const startDemo = useCallback(() => { document.cookie = 'studycore_demo=true; path=/; max-age=86400; SameSite=Lax'; window.location.href = '/dashboard'; }, []);
  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (client && userId) {
      const { error } = await client.auth.signOut();
      if (error) { toast('La déconnexion a échoué. Réessaie.', 'error'); return; }
      localStorage.removeItem(storageKey.current);
    }
    document.cookie = 'studycore_demo=; path=/; max-age=0; SameSite=Lax';
    // Full navigation on purpose: clears the client session state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/login';
  }, [toast, userId]);
  const retrySync = useCallback(() => window.location.reload(), []);
  const value = useMemo(() => ({ data, loaded, update, replace, toast, syncStatus, syncError, userId, theme, setTheme, startDemo, signOut, retrySync }), [data, loaded, update, replace, toast, syncStatus, syncError, userId, theme, setTheme, startDemo, signOut, retrySync]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map(item => <div key={item.id} className={`toast toast-${item.type}`} role={item.type === 'error' ? 'alert' : 'status'}>
          {item.type === 'error' ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />}
          <span>{item.message}</span><button className="icon-button" aria-label="Fermer la notification" onClick={() => setToasts(current => current.filter(t => t.id !== item.id))}><X size={16} /></button>
        </div>)}
      </div>
    </WorkspaceContext.Provider>
  );
}
export function useWorkspace() { const context = useContext(WorkspaceContext); if (!context) throw new Error('WorkspaceProvider manquant'); return context; }
