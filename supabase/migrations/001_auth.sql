-- ============================================================
-- MandaGO - Auth Tables
-- Phase: feat/auth
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Companies (Tenants)
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

-- ============================================================
-- Internal Users
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

-- ============================================================
-- Trigger: Auto-create company and internal_user on signup
-- internal_user is created with 'operator' role (not admin for security)
-- Admin should manually promote if needed
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_company_id UUID;
  v_company_name TEXT;
  v_full_name TEXT;
BEGIN
  v_company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'company');
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.companies (name, email)
  VALUES (v_company_name, NEW.email)
  RETURNING id INTO v_company_id;

  INSERT INTO public.internal_users (id, company_id, email, full_name, role)
  VALUES (NEW.id, v_company_id, NEW.email, v_full_name, 'operator');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- RLS Policies (simplified to avoid infinite recursion)
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_users ENABLE ROW LEVEL SECURITY;

-- Companies: users can read their own company data
DROP POLICY IF EXISTS companies_select ON companies;
CREATE POLICY companies_select ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM internal_users
      WHERE internal_users.id = (SELECT auth.uid())
      AND internal_users.company_id = companies.id
    )
  );

-- Companies: only admins can update their company
DROP POLICY IF EXISTS companies_update ON companies;
CREATE POLICY companies_update ON companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM internal_users
      WHERE internal_users.id = (SELECT auth.uid())
      AND internal_users.company_id = companies.id
      AND internal_users.role = 'admin'
    )
  );

-- Internal users: users can read users in their company
DROP POLICY IF EXISTS internal_users_select ON internal_users;
CREATE POLICY internal_users_select ON internal_users
  FOR SELECT USING (
    company_id = (
      SELECT company_id FROM internal_users
      WHERE id = (SELECT auth.uid())
    )
  );

-- Internal users: admins can manage users in their company
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

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON companies(tax_id);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_internal_users_company ON internal_users(company_id);
CREATE INDEX IF NOT EXISTS idx_internal_users_role ON internal_users(company_id, role);

-- ============================================================
-- Grants for authenticated role
-- ============================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.companies TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.internal_users TO authenticated;
