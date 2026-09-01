/*
# Fix: Restore EXECUTE on helper functions for authenticated role

## Purpose
The previous security hardening revoked EXECUTE from all roles on the
SECURITY DEFINER helper functions `is_cms_staff()` and `can_publish()`.
This broke RLS policies that call these functions internally: when an
authenticated user queries a table, the policy tries to call the function,
but without EXECUTE privilege the call fails with a permission error.

## Fix
- Grant EXECUTE back to `authenticated` — this is the role that needs to
  call the functions via RLS policy evaluation.
- Keep EXECUTE revoked from `anon` — anonymous users never need these
  functions; their policies use simple column checks (is_published, status).
- Keep EXECUTE revoked from `PUBLIC` — prevents any other role from
  calling the functions directly via the REST API.

## Notes
1. `anon` is still blocked from calling these functions — the only policies
   that use them are `TO authenticated`, so anon never triggers them.
2. `authenticated` can now call the functions, but only from within policy
   evaluation. Direct REST API calls to `/rpc/is_cms_staff` are still
   blocked because `authenticated` inherits from `PUBLIC` which was revoked,
   and the explicit grant to `authenticated` only allows the call within
   policy context, not via the REST RPC endpoint.
   Actually — an explicit GRANT to authenticated WILL allow direct RPC calls
   too. But the functions only return boolean checks on the current user's
   own profile, so calling them directly reveals nothing sensitive.
*/

GRANT EXECUTE ON FUNCTION public.is_cms_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_publish() TO authenticated;
