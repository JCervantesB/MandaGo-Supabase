-- ============================================================
-- MandaGO - RLS Policies Update
-- Phase: feat/users
-- Allows admins to see all data across companies
-- ============================================================

-- Update internal_users policies
DROP POLICY IF EXISTS internal_users_select ON internal_users;
CREATE POLICY internal_users_select ON internal_users
  FOR SELECT USING (
    (
      SELECT role FROM internal_users WHERE id = (SELECT auth.uid())
    ) = 'admin'
    OR
    company_id = (
      SELECT company_id FROM internal_users WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS internal_users_manage ON internal_users;
CREATE POLICY internal_users_manage ON internal_users
  FOR ALL USING (
    (
      SELECT role FROM internal_users WHERE id = (SELECT auth.uid())
    ) = 'admin'
  );

-- Update companies policies
DROP POLICY IF EXISTS companies_select ON companies;
CREATE POLICY companies_select ON companies
  FOR SELECT USING (
    (
      SELECT role FROM internal_users WHERE id = (SELECT auth.uid())
    ) = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM internal_users
      WHERE internal_users.id = (SELECT auth.uid())
      AND internal_users.company_id = companies.id
    )
  );

DROP POLICY IF EXISTS companies_update ON companies;
CREATE POLICY companies_update ON companies
  FOR UPDATE USING (
    (
      SELECT role FROM internal_users WHERE id = (SELECT auth.uid())
    ) = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM internal_users
      WHERE internal_users.id = (SELECT auth.uid())
      AND internal_users.company_id = companies.id
    )
  );
