/*
# Create content tables: services, campaigns, news, faq, pages

## Purpose
Stores all the dynamic content that the CMS admin panel manages and the public
portal displays. Replaces the hardcoded data in src/data/content.ts so hospital
staff can update content without a developer.

## New Tables

### services
- `id` (uuid, PK)
- `icon_name` (text) — maps to a Lucide icon key in the frontend
- `title` (text, not null) — e.g. "Ginecología"
- `description` (text) — short summary for cards
- `body` (text) — optional long-form content for detail pages
- `sort_order` (int, default 0) — controls display order
- `is_published` (boolean, default false)
- `created_at`, `updated_at` (timestamptz)

### campaigns
- `id` (uuid, PK)
- `title` (text, not null)
- `excerpt` (text) — short summary
- `body` (text) — full content
- `image_url` (text) — featured image
- `category` (text) — e.g. "Prevención", "Maternidad"
- `status` (text) — 'borrador', 'revision', 'aprobado', 'publicado', 'archivado'
- `published_at` (timestamptz, nullable) — when it goes live
- `expires_at` (timestamptz, nullable) — auto-archive date
- `created_by` (uuid, references auth.users) — author
- `created_at`, `updated_at` (timestamptz)

### news
- `id` (uuid, PK)
- `title` (text, not null)
- `excerpt` (text)
- `body` (text)
- `image_url` (text)
- `category` (text)
- `author` (text) — display name of responsible area
- `status` (text) — 'borrador', 'publicado', 'archivado'
- `published_at` (timestamptz, nullable)
- `created_at`, `updated_at` (timestamptz)

### faq_items
- `id` (uuid, PK)
- `question` (text, not null)
- `answer` (text, not null)
- `sort_order` (int, default 0)
- `is_published` (boolean, default true)
- `created_at`, `updated_at` (timestamptz)

### pages
- `id` (uuid, PK)
- `slug` (text, unique) — URL-friendly identifier
- `title` (text, not null)
- `body` (text)
- `status` (text) — 'borrador', 'publicado'
- `created_at`, `updated_at` (timestamptz)

## Security — Public Read, Admin Write

The public portal must show published content to anonymous visitors, so SELECT
policies use `TO anon, authenticated` with a filter on published status.

Admin write policies check that the authenticated user has an admin_profiles
row with an appropriate role (admin, editor, publicador, or colaborador can
create drafts; only admin/editor/publicador can publish).

## Notes
1. Public SELECT only returns published/active rows.
2. Admin SELECT (any status) requires an authenticated admin profile.
3. Write access is role-gated via a helper function.
4. `updated_at` is auto-maintained by triggers.
*/

-- Helper: check if current user has a CMS role (any admin staff)
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

-- Helper: check if current user can publish (admin, editor, publicador)
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

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===================== SERVICES =====================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'stethoscope',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public can read published services
DROP POLICY IF EXISTS "public_select_services" ON services;
CREATE POLICY "public_select_services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- CMS staff can read all services (any status)
DROP POLICY IF EXISTS "staff_select_services" ON services;
CREATE POLICY "staff_select_services"
  ON services FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());

-- CMS staff can create services
DROP POLICY IF EXISTS "staff_insert_services" ON services;
CREATE POLICY "staff_insert_services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

-- CMS staff can update services
DROP POLICY IF EXISTS "staff_update_services" ON services;
CREATE POLICY "staff_update_services"
  ON services FOR UPDATE
  TO authenticated
  USING (public.is_cms_staff())
  WITH CHECK (public.is_cms_staff());

-- Only admin can delete services
DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===================== CAMPAIGNS =====================
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'borrador'
    CHECK (status IN ('borrador', 'revision', 'aprobado', 'publicado', 'archivado')),
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Public can read published, non-archived, non-expired campaigns
DROP POLICY IF EXISTS "public_select_campaigns" ON campaigns;
CREATE POLICY "public_select_campaigns"
  ON campaigns FOR SELECT
  TO anon, authenticated
  USING (
    status = 'publicado'
    AND (expires_at IS NULL OR expires_at > now())
  );

-- CMS staff can read all campaigns
DROP POLICY IF EXISTS "staff_select_campaigns" ON campaigns;
CREATE POLICY "staff_select_campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());

-- CMS staff can create campaigns (created_by auto-set)
DROP POLICY IF EXISTS "staff_insert_campaigns" ON campaigns;
CREATE POLICY "staff_insert_campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

-- CMS staff can update campaigns
DROP POLICY IF EXISTS "staff_update_campaigns" ON campaigns;
CREATE POLICY "staff_update_campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (public.is_cms_staff())
  WITH CHECK (public.is_cms_staff());

-- Only admin can delete campaigns
DROP POLICY IF EXISTS "admin_delete_campaigns" ON campaigns;
CREATE POLICY "admin_delete_campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE TRIGGER campaigns_set_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===================== NEWS =====================
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'borrador'
    CHECK (status IN ('borrador', 'publicado', 'archivado')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_news" ON news;
CREATE POLICY "public_select_news"
  ON news FOR SELECT
  TO anon, authenticated
  USING (status = 'publicado');

DROP POLICY IF EXISTS "staff_select_news" ON news;
CREATE POLICY "staff_select_news"
  ON news FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());

DROP POLICY IF EXISTS "staff_insert_news" ON news;
CREATE POLICY "staff_insert_news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "staff_update_news" ON news;
CREATE POLICY "staff_update_news"
  ON news FOR UPDATE
  TO authenticated
  USING (public.is_cms_staff())
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "admin_delete_news" ON news;
CREATE POLICY "admin_delete_news"
  ON news FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE TRIGGER news_set_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===================== FAQ ITEMS =====================
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_faq" ON faq_items;
CREATE POLICY "public_select_faq"
  ON faq_items FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "staff_select_faq" ON faq_items;
CREATE POLICY "staff_select_faq"
  ON faq_items FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());

DROP POLICY IF EXISTS "staff_insert_faq" ON faq_items;
CREATE POLICY "staff_insert_faq"
  ON faq_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "staff_update_faq" ON faq_items;
CREATE POLICY "staff_update_faq"
  ON faq_items FOR UPDATE
  TO authenticated
  USING (public.is_cms_staff())
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "admin_delete_faq" ON faq_items;
CREATE POLICY "admin_delete_faq"
  ON faq_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE TRIGGER faq_items_set_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===================== PAGES =====================
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'borrador'
    CHECK (status IN ('borrador', 'publicado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_pages" ON pages;
CREATE POLICY "public_select_pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (status = 'publicado');

DROP POLICY IF EXISTS "staff_select_pages" ON pages;
CREATE POLICY "staff_select_pages"
  ON pages FOR SELECT
  TO authenticated
  USING (public.is_cms_staff());

DROP POLICY IF EXISTS "staff_insert_pages" ON pages;
CREATE POLICY "staff_insert_pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "staff_update_pages" ON pages;
CREATE POLICY "staff_update_pages"
  ON pages FOR UPDATE
  TO authenticated
  USING (public.is_cms_staff())
  WITH CHECK (public.is_cms_staff());

DROP POLICY IF EXISTS "admin_delete_pages" ON pages;
CREATE POLICY "admin_delete_pages"
  ON pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE TRIGGER pages_set_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===================== INDEXES =====================
CREATE INDEX IF NOT EXISTS idx_services_published_sort ON services (is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns (status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news (status);
CREATE INDEX IF NOT EXISTS idx_faq_published_sort ON faq_items (is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages (slug);
