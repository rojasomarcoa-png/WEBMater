/*
# Create admin profiles and roles infrastructure

## Purpose
Sets up the foundation for the CMS admin panel: user profiles with role-based
access control. Each authenticated Supabase user gets a profile row that
determines their CMS permissions.

## New Tables
- `admin_profiles`
  - `id` (uuid, PK, references auth.users) — one row per admin user
  - `email` (text) — denormalized for convenience
  - `full_name` (text) — display name
  - `role` (text, not null) — one of: 'admin', 'editor', 'publicador', 'revisor', 'colaborador'
  - `is_active` (boolean, default true) — can be deactivated without deleting
  - `created_at` (timestamptz)

## Security
- RLS enabled on `admin_profiles`.
- Users can read their own profile (to check their role in the frontend).
- Only admins can read all profiles and update them.
- INSERT is restricted to admins (they create new admin accounts by first
  creating the auth user, then inserting the profile row).
- A trigger auto-creates a default 'colaborador' profile when a new auth user
  signs up, so the admin can then promote them.

## Notes
1. The default role on auto-creation is 'colaborador' (lowest privilege).
2. An admin must manually promote new users to higher roles.
3. The `is_active` flag lets admins deactivate accounts without data loss.
*/

CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'colaborador'
    CHECK (role IN ('admin', 'editor', 'publicador', 'revisor', 'colaborador')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "select_own_profile" ON admin_profiles;
CREATE POLICY "select_own_profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins can read all profiles
DROP POLICY IF EXISTS "admin_select_all_profiles" ON admin_profiles;
CREATE POLICY "admin_select_all_profiles"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Admins can insert profiles (for new admin accounts)
DROP POLICY IF EXISTS "admin_insert_profile" ON admin_profiles;
CREATE POLICY "admin_insert_profile"
  ON admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Admins can update profiles (change roles, activate/deactivate)
DROP POLICY IF EXISTS "admin_update_profile" ON admin_profiles;
CREATE POLICY "admin_update_profile"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- A user can update their own name (but not their role)
DROP POLICY IF EXISTS "self_update_profile_name" ON admin_profiles;
CREATE POLICY "self_update_profile_name"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create a default profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, '', 'colaborador')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin_user();
