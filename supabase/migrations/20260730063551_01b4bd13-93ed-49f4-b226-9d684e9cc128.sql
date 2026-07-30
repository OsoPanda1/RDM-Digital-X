CREATE TABLE public.admin_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_table text NOT NULL,
  target_id text,
  csrf_token_hash text,
  before_state jsonb,
  after_state jsonb,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_events_created_at ON public.admin_audit_events (created_at DESC);
CREATE INDEX idx_admin_audit_events_actor ON public.admin_audit_events (actor_id);

GRANT SELECT, INSERT ON public.admin_audit_events TO authenticated;
GRANT ALL ON public.admin_audit_events TO service_role;

ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit events"
ON public.admin_audit_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can append audit events"
ON public.admin_audit_events FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND actor_id = auth.uid());