import { ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { campaigns as fallbackCampaigns } from '@/data/content';
import { usePublishedCampaigns } from '@/hooks/useContent';
import { useReveal } from '@/hooks/useReveal';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });
}

export function Campaigns() {
  const ref = useReveal<HTMLDivElement>();
  const { items, loading } = usePublishedCampaigns();

  const display = items.length > 0
    ? items.map((c) => ({
        id: c.id,
        image: c.image_url,
        category: c.category,
        title: c.title,
        excerpt: c.excerpt,
        date: formatDate(c.published_at),
        status: 'active' as const,
      }))
    : fallbackCampaigns.map((c, i) => ({ ...c, id: `fallback-${i}` }));

  return (
    <section id="campanas" ref={ref} className="py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 reveal">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-primary-400" />
              Campañas de salud
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink-900 text-balance">
              Prevención que salva vidas
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              Participa en nuestras campañas activas y mantente informada sobre tu salud.
            </p>
          </div>
          <a href="#campanas" className="btn-ghost shrink-0 group">
            Ver todas
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {display.map((c, i) => (
              <article
                key={c.id}
                className={`card group overflow-hidden reveal hover:-translate-y-1 hover:shadow-lift ${
                  i === 0 ? 'md:row-span-2 md:flex md:flex-col' : ''
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[4/3] md:flex-1' : 'aspect-[16/10]'}`}>
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                  <span
                    className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      c.status === 'active'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/90 text-ink-700'
                    }`}
                  >
                    {c.status === 'active' ? 'Activa ahora' : 'Próximamente'}
                  </span>
                  <span className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-ink-700">
                    {c.category}
                  </span>
                </div>
                <div className="p-6">
                  {c.date && (
                    <div className="flex items-center gap-2 text-xs text-ink-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {c.date}
                    </div>
                  )}
                  <h3 className={`mt-2 font-display font-medium text-ink-900 ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{c.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                    Ampliar información
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
