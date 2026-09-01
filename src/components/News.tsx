import { ArrowRight, Clock, Loader2 } from 'lucide-react';
import { newsItems as fallbackNews } from '@/data/content';
import { usePublishedNews } from '@/hooks/useContent';
import { useReveal } from '@/hooks/useReveal';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function News() {
  const ref = useReveal<HTMLDivElement>();
  const { items, loading } = usePublishedNews();

  const display = items.length > 0
    ? items.map((n) => ({
        id: n.id,
        image: n.image_url,
        category: n.category,
        title: n.title,
        excerpt: n.excerpt,
        date: formatDate(n.published_at),
        author: n.author,
      }))
    : fallbackNews.map((n, i) => ({ ...n, id: `fallback-${i}` }));

  return (
    <section id="noticias" ref={ref} className="py-24 sm:py-32 bg-ink-50/60">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 reveal">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-primary-400" />
              Noticias y actualidad
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink-900 text-balance">
              Lo que sucede en el hospital
            </h2>
          </div>
          <a href="#noticias" className="btn-ghost shrink-0 group">
            Todas las noticias
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {display.map((item, i) => (
              <article
                key={item.id}
                className="card group overflow-hidden reveal hover:-translate-y-1 hover:shadow-lift"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary-700">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-ink-400">
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                    )}
                    {item.date && item.author && <span className="h-1 w-1 rounded-full bg-ink-300" />}
                    {item.author && <span>{item.author}</span>}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-ink-900 group-hover:text-primary-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{item.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                    Leer más
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
