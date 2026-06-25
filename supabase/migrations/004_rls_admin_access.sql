-- ============================================================
-- MandaGO - RLS Policies Update
-- Phase: feat/users
-- Allows admins to see all data across companies
-- Uses SECURITY DEFINER functions to avoid recursion
-- ============================================================

-- Helper function to get current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS TEXT AS $$
  SELECT role FROM internal_users WHERE id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's company_id (bypasses RLS)
CREATE OR REPLACE FUNCTION auth_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM internal_users WHERE id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Update internal_users policies using helper functions
DROP POLICY IF EXISTS internal_users_select ON internal_users;
CREATE POLICY internal_users_select ON internal_users
  FOR SELECT USING (
    auth_user_role() = 'admin'
    OR company_id = auth_user_company_id()
  );

DROP POLICY IF EXISTS internal_users_manage ON internal_users;
CREATE POLICY internal_users_manage ON internal_users
  FOR ALL USING (
    auth_user_role() = 'admin'
  );

-- Update companies policies
DROP POLICY IF EXISTS companies_select ON companies;
CREATE POLICY companies_select ON companies
  FOR SELECT USING (
    auth_user_role() = 'admin'
    OR id = auth_user_company_id()
  );

DROP POLICY IF EXISTS companies_update ON companies;
CREATE POLICY companies_update ON companies
  FOR UPDATE USING (
    auth_user_role() = 'admin'
    OR id = auth_user_company_id()
  );

-- ============================================================
-- Grants for authenticated role
-- ============================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.companies TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.internal_users TO authenticated;
