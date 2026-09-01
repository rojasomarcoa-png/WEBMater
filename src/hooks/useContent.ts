import { useEffect, useState } from 'react';
import { supabase, type CampaignRow, type NewsRow, type ServiceRow, type FaqRow } from '@/lib/supabase';

export function usePublishedCampaigns() {
  const [items, setItems] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, excerpt, image_url, category, status, published_at')
        .eq('status', 'publicado')
        .order('published_at', { ascending: false })
        .limit(6);

      if (!cancelled && !error && data) setItems(data as CampaignRow[]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}

export function usePublishedNews() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, image_url, category, author, published_at')
        .eq('status', 'publicado')
        .order('published_at', { ascending: false })
        .limit(6);

      if (!cancelled && !error && data) setItems(data as NewsRow[]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}

export function usePublishedServices() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, icon_name, title, description, sort_order')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(12);

      if (!cancelled && !error && data) setItems(data as ServiceRow[]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}

export function usePublishedFaq() {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('faq_items')
        .select('id, question, answer, sort_order')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(20);

      if (!cancelled && !error && data) setItems(data as FaqRow[]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}
