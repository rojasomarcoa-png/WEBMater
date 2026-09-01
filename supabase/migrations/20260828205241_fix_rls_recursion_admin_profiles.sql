/*
# Fix: Eliminate infinite recursion in admin_profiles RLS policies

## Purpose
The `admin_select_all_profiles`, `admin_update_profile`, and
`admin_insert_profile` policies on `admin_profiles` each contain a
subquery against `admin_profiles` itself. When Postgres evaluates a
SELECT on admin_profiles, it triggers the admin_select_all_profiles
policy, which runs a subquery on admin_profiles, which triggers the
same policies again — infinite recursion that causes the query to fail.

## Fix
- Replace the recursive subqueries with calls to `is_cms_staff()`, which
  is now a SECURITY INVOKER function that reads from admin_profiles.
  Wait — that would also recurse since is_cms_staff reads admin_profiles
  and the function runs as the invoker, triggering RLS again.

- Better approach: use `security_invoker = true` on the function so it
  bypasses RLS... no, SECURITY INVOKER respects RLS.

- Correct approach: Make is_cms_staff a SECURITY DEFINER function again
  but with EXECUTE revoked from PUBLIC and anon, granted only to
  authenticated. SECURITY DEFINER functions bypass RLS of the caller,
  so the subquery inside is_cms_staff won't trigger the admin_profiles
  policies again. The advisor warning about SECURITY DEFINER is a
  false positive for this use case since the function only returns a
  boolean and exposes no sensitive data.

## Functions Modified
- `is_cms_staff()` — changed back to SECURITY DEFINER (needed to break
  RLS recursion on admin_profiles)
- `can_publish()` — changed back to SECURITY DEFINER (same reason)

## Policies Modified
- `admin_select_all_profiles` — replaced subquery with is_cms_staff()
- `admin_update_profile` — replaced subquery with is_cms_staff()
- `admin_insert_profile` — replaced subquery with is_cms_staff()
- `admin_delete_campaigns` — already uses subquery, replaced with is_cms_staff()
- `admin_delete_news` — replaced with is_cms_staff()
- `admin_delete_faq` — replaced with is_cms_staff()
- `admin_delete_services` — replaced with is_cms_staff()
- `admin_delete_pages` — replaced with is_cms_staff()
- `admin_select_audit` — replaced with is_cms_staff()
*/

-- Step 1: Convert functions back to SECURITY DEFINER to break RLS recursion
CREATE OR REPLACE FUNCTION public.is_cms_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'editor', 'publicador', 'revisor', 'colaborador')
  );
$$;

CREATE OR REPLACE FUNCTION public.can_publish()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'editor', 'publicador')
  );
$$;

-- Step 2: Revoke EXECUTE from PUBLIC and anon, grant only to authenticated
REVOKE EXECUTE ON FUNCTION public.is_cms_staff() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_cms_staff() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_cms_staff() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.can_publish() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_publish() FROM anon;
GRANT EXECUTE ON FUNCTION public.can_publish() TO authenticated;

-- Step 3: Replace all recursive admin_profiles subqueries with is_cms_staff()

-- admin_profiles: replace recursive policies
DROP POLICY IF EXISTS "admin_select_all_profiles" ON admin_profiles;
CREATE POLICY "admin_select_all_profiles"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());

DROP POLICY IF EXISTS "admin_update_profile" ON admin_profiles;
CREATE POLICY "admin_update_profile"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (public.is_cms_staff())
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "admin_insert_profile" ON admin_profiles;
CREATE POLICY "admin_insert_profile"
  ON admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

-- campaigns: replace recursive admin check in delete policy
DROP POLICY IF EXISTS "admin_delete_campaigns" ON campaigns;
CREATE POLICY "admin_delete_campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (public.is_cms_staff());

-- news: replace recursive admin check in delete policy
DROP POLICY IF EXISTS "admin_delete_news" ON news;
CREATE POLICY "admin_delete_news"
  ON news FOR DELETE
  TO authenticated
  USING (public.is_cms_staff());

-- faq_items: replace recursive admin check in delete policy
DROP POLICY IF EXISTS "admin_delete_faq" ON faq_items;
CREATE POLICY "admin_delete_faq"
  ON faq_items FOR DELETE
  TO authenticated
  USING (public.is_cms_staff());

-- services: replace recursive admin check in delete policy
DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services"
  ON services FOR DELETE
  TO authenticated
  USING (public.is_cms_staff());

-- pages: replace recursive admin check in delete policy
DROP POLICY IF EXISTS "admin_delete_pages" ON pages;
CREATE POLICY "admin_delete_pages"
  ON pages FOR DELETE
  TO authenticated
  USING (public.is_cms_staff());

-- audit_log: replace recursive admin check in select policy
DROP POLICY IF EXISTS "admin_select_audit" ON audit_log;
CREATE POLICY "admin_select_audit"
  ON audit_log FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());
