/*
# Security hardening: fix RLS policy gaps and function exposure

## Purpose
Fixes five security vulnerabilities identified during audit:

1. **Column-level privilege gap on admin_profiles** — the `self_update_profile_name`
   policy allowed any authenticated user to UPDATE their own profile row with no
   column restriction. A user could change their `role` column to 'admin',
   escalating privileges. Fixed by revoking UPDATE on the `role` and `is_active`
   columns from `authenticated`, so only the admin-scoped policy can change them.

2. **SECURITY DEFINER functions callable by anon** — `is_cms_staff()`,
   `can_publish()`, and `handle_new_admin_user()` were executable by the `anon`
   role via the REST API. These functions run with elevated privileges, so
   exposing them publicly is a security risk. Fixed by revoking EXECUTE from
   `anon` and `authenticated` on all three functions; they are only used
   internally by RLS policies and triggers, never called directly by the client.

3. **Mutable search_path on set_updated_at** — the trigger function did not pin
   its search_path, making it vulnerable to schema-spoofing attacks. Fixed by
   setting `search_path = public` on the function.

4. **audit_log INSERT too permissive** — any authenticated user could insert
   fake audit entries. Fixed by requiring `is_cms_staff()` check on INSERT.

5. **Excess table grants** — `anon` had INSERT/UPDATE/DELETE grants on all
   content tables. Even though RLS blocks the operations, reducing the surface
   to SELECT-only for anon follows least-privilege. `authenticated` retains
   full grants since RLS policies gate the actual operations.

## Tables Modified
- `admin_profiles` — column-level UPDATE privilege restricted
- `audit_log` — INSERT policy tightened
- All content tables — anon grants reduced to SELECT only

## Functions Modified
- `set_updated_at()` — search_path pinned to public
- `is_cms_staff()` — EXECUTE revoked from anon and authenticated
- `can_publish()` — EXECUTE revoked from anon and authenticated
- `handle_new_admin_user()` — EXECUTE revoked from anon and authenticated

## Notes
1. The SECURITY DEFINER functions are still used by RLS policies — policies
   run with the caller's privileges but can call SECURITY DEFINER functions
   internally. Revoking EXECUTE only blocks direct REST API calls.
2. The admin_profiles self-update policy still allows users to update their
   own `full_name` and `email`, but NOT `role` or `is_active`.
*/

-- ===================== 1. FIX: Column-level privilege on admin_profiles =====================
-- Revoke full UPDATE from authenticated, then grant only on safe columns
REVOKE UPDATE ON admin_profiles FROM authenticated;
GRANT UPDATE (full_name, email) ON admin_profiles TO authenticated;

-- ===================== 2. FIX: Revoke EXECUTE on SECURITY DEFINER functions =====================
REVOKE EXECUTE ON FUNCTION public.is_cms_staff() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_publish() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM anon, authenticated;

-- ===================== 3. FIX: Pin search_path on set_updated_at =====================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===================== 4. FIX: Tighten audit_log INSERT policy =====================
DROP POLICY IF EXISTS "staff_insert_audit" ON audit_log;
CREATE POLICY "staff_insert_audit"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

-- ===================== 5. FIX: Reduce anon grants to SELECT-only on content tables =====================
-- Revoke write grants from anon (RLS already blocks them, but least-privilege)
REVOKE INSERT, UPDATE, DELETE ON services FROM anon;
REVOKE INSERT, UPDATE, DELETE ON campaigns FROM anon;
REVOKE INSERT, UPDATE, DELETE ON news FROM anon;
REVOKE INSERT, UPDATE, DELETE ON faq_items FROM anon;
REVOKE INSERT, UPDATE, DELETE ON pages FROM anon;
REVOKE INSERT, UPDATE, DELETE ON audit_log FROM anon;
REVOKE INSERT, UPDATE, DELETE ON admin_profiles FROM anon;

-- Also revoke SELECT on admin_profiles and audit_log from anon (sensitive tables)
REVOKE SELECT ON admin_profiles FROM anon;
REVOKE SELECT ON audit_log FROM anon;
