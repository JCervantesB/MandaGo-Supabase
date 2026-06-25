-- ============================================================
-- MandaGO - Companies
-- Phase: feat/auth
-- ============================================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trade_name TEXT,
  tax_id TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  logo_url TEXT,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE companies IS 'Empresas tenants que usan MandaGO';

CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON companies(tax_id);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_select ON companies;
CREATE POLICY companies_select ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM internal_users
      WHERE internal_users.id = (SELECT auth.uid())
      AND internal_users.company_id = companies.id
    )
  );

DROP POLICY IF EXISTS companies_update ON companies;
CREATE POLICY companies_update ON companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM internal_users
      WHERE internal_users.id = (SELECT auth.uid())
      AND internal_users.company_id = companies.id
    )
  );

-- Grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.companies TO authenticated;
