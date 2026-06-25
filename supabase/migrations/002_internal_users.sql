-- ============================================================
-- MandaGO - Internal Users
-- Phase: feat/auth
-- ============================================================

CREATE TABLE IF NOT EXISTS internal_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator')),
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE internal_users IS 'Usuarios internos de empresas (admins y operadores)';

CREATE INDEX IF NOT EXISTS idx_internal_users_company ON internal_users(company_id);
CREATE INDEX IF NOT EXISTS idx_internal_users_role ON internal_users(company_id, role);

-- RLS Policies
ALTER TABLE internal_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS internal_users_select ON internal_users;
CREATE POLICY internal_users_select ON internal_users
  FOR SELECT USING (
    company_id = (
      SELECT company_id FROM internal_users
      WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS internal_users_manage ON internal_users;
CREATE POLICY internal_users_manage ON internal_users
  FOR ALL USING (
    company_id = (
      SELECT company_id FROM internal_users
      WHERE id = (SELECT auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM internal_users
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.internal_users TO authenticated;
