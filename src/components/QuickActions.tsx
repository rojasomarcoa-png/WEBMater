import { ArrowUpRight } from 'lucide-react';
import { quickActions } from '@/data/content';
import { Icon } from '@/components/Icon';
import { useReveal } from '@/hooks/useReveal';

const accentMap = {
  primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white',
  accent: 'bg-accent-50 text-accent-600 group-hover:bg-accent-600 group-hover:text-white',
  rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
};

export function QuickActions() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="relative -mt-16 z-20">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="eyebrow">
            <span className="h-px w-6 bg-primary-400" />
            Empieza aquí
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-display font-medium text-ink-900 text-balance">
            ¿Qué necesitas hacer hoy?
          </h2>
          <p className="mt-3 text-ink-500 text-lg">
            Te guiamos en uno, dos o como máximo tres pasos hacia la información que buscas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, i) => (
            <a
              key={action.title}
              href={action.href}
              className="card group p-7 reveal hover:-translate-y-1.5 hover:shadow-lift"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid place-items-center h-14 w-14 rounded-2xl transition-all duration-500 group-hover:scale-110 ${accentMap[action.accent]}`}
                >
                  <Icon name={action.icon} className="h-7 w-7" strokeWidth={1.9} />
                </span>
                <ArrowUpRight className="h-5 w-5 text-ink-300 group-hover:text-primary-500 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink-900 group-hover:text-primary-700 transition-colors">
                {action.title}
              </h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">{action.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
