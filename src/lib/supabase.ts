import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Faltan las variables de entorno de Supabase.');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type AdminRole = 'admin' | 'editor' | 'publicador' | 'revisor' | 'colaborador';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
}

export interface ServiceRow {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  body: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
  category: string;
  status: 'borrador' | 'revision' | 'aprobado' | 'publicado' | 'archivado';
  published_at: string | null;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsRow {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
  category: string;
  author: string;
  status: 'borrador' | 'publicado' | 'archivado';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
