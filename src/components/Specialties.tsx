import { ArrowRight, Loader2 } from 'lucide-react';
import { services as fallbackServices } from '@/data/content';
import { Icon } from '@/components/Icon';
import { usePublishedServices } from '@/hooks/useContent';
import { useReveal } from '@/hooks/useReveal';
import type { IconName } from '@/data/content';

export function Specialties() {
  const ref = useReveal<HTMLDivElement>();
  const { items, loading } = usePublishedServices();

  const display = items.length > 0
    ? items.map((s) => ({
        id: s.id,
        icon: (s.icon_name || 'stethoscope') as IconName,
        title: s.title,
        description: s.description,
      }))
    : fallbackServices.map((s, i) => ({ ...s, id: `fallback-${i}` }));

  return (
    <section id="especialidades" ref={ref} className="py-24 sm:py-32 bg-gradient-to-b from-primary-50/60 to-white">
      <div className="container-page">
        <div className="max-w-2xl reveal">
          <span className="eyebrow">
            <span className="h-px w-6 bg-primary-400" />
            Servicios y especialidades
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink-900 text-balance">
            Atención especializada en cada etapa
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Desde el control prenatal hasta el cuidado del recién nacido, un equipo dedicado a ti y
            a tu familia.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {display.map((service, i) => (
              <article
                key={service.id}
                className="card group p-6 reveal hover:-translate-y-1 hover:shadow-lift cursor-pointer"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <span className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon name={service.icon} className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{service.title}</h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
                  Ver más
                  <ArrowRight className="h-4 w-4" />
                </span>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center reveal">
          <a href="#contacto" className="btn-secondary">
            Conocer todos los servicios
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
