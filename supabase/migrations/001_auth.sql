-- ============================================================
-- MandaGO - Auth
-- Phase: feat/auth
-- ============================================================

-- Trigger function to auto-create company and internal_user on signup
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

-- Trigger on auth.users (created after tables exist in subsequent migrations)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
