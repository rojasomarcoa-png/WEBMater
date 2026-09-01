/*
# Fix: Revoke EXECUTE from PUBLIC on SECURITY DEFINER functions

## Purpose
Postgres grants EXECUTE to PUBLIC by default when creating functions. The
previous migration revoked from `anon` and `authenticated` explicitly, but
PUBLIC still grants access. This migration revokes from PUBLIC directly,
which is the correct way to block all external access.

## Functions Modified
- `is_cms_staff()` — revoke EXECUTE from PUBLIC
- `can_publish()` — revoke EXECUTE from PUBLIC
- `handle_new_admin_user()` — revoke EXECUTE from PUBLIC (trigger-only)
*/

REVOKE EXECUTE ON FUNCTION public.is_cms_staff() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_publish() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM PUBLIC;
