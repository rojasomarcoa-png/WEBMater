import { useEffect, useState } from 'react';
import { Megaphone, Newspaper, Stethoscope, HelpCircle, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stat {
  label: string;
  value: number;
  icon: typeof Megaphone;
  color: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recent, setRecent] = useState<{ title: string; type: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [campaigns, news, services, faq] = await Promise.all([
        supabase.from('campaigns').select('id, status'),
        supabase.from('news').select('id, status'),
        supabase.from('services').select('id, is_published'),
        supabase.from('faq_items').select('id, is_published'),
      ]);

      const publishedCampaigns = campaigns.data?.filter((c) => c.status === 'publicado').length ?? 0;
      const publishedNews = news.data?.filter((n) => n.status === 'publicado').length ?? 0;
      const publishedServices = services.data?.filter((s) => s.is_published).length ?? 0;
      const publishedFaq = faq.data?.filter((f) => f.is_published).length ?? 0;

      setStats([
        { label: 'Campañas publicadas', value: publishedCampaigns, icon: Megaphone, color: 'text-primary-600 bg-primary-50' },
        { label: 'Noticias publicadas', value: publishedNews, icon: Newspaper, color: 'text-accent-600 bg-accent-50' },
        { label: 'Servicios activos', value: publishedServices, icon: Stethoscope, color: 'text-rose-600 bg-rose-50' },
        { label: 'Preguntas frecuentes', value: publishedFaq, icon: HelpCircle, color: 'text-amber-600 bg-amber-50' },
      ]);

      // Recent campaigns + news combined
      const { data: recentCampaigns } = await supabase
        .from('campaigns')
        .select('title, updated_at')
        .order('updated_at', { ascending: false })
        .limit(3);

      const { data: recentNews } = await supabase
        .from('news')
        .select('title, updated_at')
        .order('updated_at', { ascending: false })
        .limit(3);

      const combined = [
        ...(recentCampaigns ?? []).map((c) => ({ title: c.title, type: 'Campaña', date: c.updated_at })),
        ...(recentNews ?? []).map((n) => ({ title: n.title, type: 'Noticia', date: n.updated_at })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      setRecent(combined);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-medium text-ink-900">Panel de control</h1>
      <p className="mt-1 text-ink-500">Resumen del contenido publicado en el portal.</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-6">
            <span className={`grid place-items-center h-12 w-12 rounded-2xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </span>
            <p className="mt-4 text-3xl font-display font-medium text-ink-900">{s.value}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-10 card p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-ink-900">Actividad reciente</h2>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-ink-400">No hay actividad reciente.</p>
        ) : (
          <ul className="space-y-3">
            {recent.map((item, i) => (
              <li key={i} className="flex items-center justify-between py-3 border-b border-ink-100 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                    {item.type}
                  </span>
                  <span className="truncate text-sm text-ink-700">{item.title}</span>
                </div>
                <span className="shrink-0 text-xs text-ink-400">
                  {new Date(item.date).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
