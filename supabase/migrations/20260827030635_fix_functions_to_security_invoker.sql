/*
# Fix: Convert helper functions to SECURITY INVOKER

## Purpose
The SECURITY DEFINER functions `is_cms_staff()` and `can_publish()` trigger
security advisor warnings because they run with elevated privileges. Since
they only read from `admin_profiles` (which has its own RLS policy allowing
users to read their own row), they don't need elevated privileges at all.

## Fix
- Recreate both functions as SECURITY INVOKER instead of SECURITY DEFINER.
- This eliminates the advisor warnings while preserving functionality.
- The functions still work within RLS policies because the policy on
  admin_profiles allows `SELECT` of the caller's own row, which is all
  these functions need.

## Notes
1. SECURITY INVOKER means the function runs with the caller's privileges.
2. When called from within a policy, the caller is the authenticated user.
3. The admin_profiles SELECT policy (`select_own_profile`) allows users to
   see their own row, so `is_cms_staff()` can read the role column.
4. `handle_new_admin_user()` stays SECURITY DEFINER because it's a trigger
   that must insert into admin_profiles even before RLS policies exist for
   the new user. EXECUTE remains revoked from PUBLIC on that function.
*/

CREATE OR REPLACE FUNCTION public.is_cms_staff()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
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
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'editor', 'publicador')
  );
$$;
