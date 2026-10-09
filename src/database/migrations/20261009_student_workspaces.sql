-- Optional private cloud storage for the new visual application.
-- Execute in the Supabase SQL editor. No existing academic rule/table is replaced.
CREATE TABLE IF NOT EXISTS public.student_workspaces (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  state jsonb NOT NULL CHECK (jsonb_typeof(state) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own workspace" ON public.student_workspaces;
CREATE POLICY "Own workspace" ON public.student_workspaces
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_workspaces TO authenticated;
REVOKE ALL ON public.student_workspaces FROM anon;
