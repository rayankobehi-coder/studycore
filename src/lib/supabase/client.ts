import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createFallbackSupabaseClient() {
  const createError = (message: string) => ({ data: { user: null }, error: new Error(message) });

  return {
    auth: {
      signInWithPassword: async () => createError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'),
      signUp: async () => createError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'),
      resetPasswordForEmail: async () => ({ error: new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.') }),
      updateUser: async () => ({ error: new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.') }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  } as const;
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabaseClient();