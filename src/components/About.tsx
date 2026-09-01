import { Shield, HeartHandshake, Sparkles, Award } from 'lucide-react';
import { stats } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

const pillars = [
  {
    icon: Shield,
    title: 'Confianza institucional',
    text: 'Décadas de trayectoria cuidando la salud de las mujeres cruceñas y sus recién nacidos.',
  },
  {
    icon: HeartHandshake,
    title: 'Cercanía humana',
    text: 'Cada atención está pensada para que te sientas escuchada, acompañada y respetada.',
  },
  {
    icon: Sparkles,
    title: 'Especialización',
    text: 'Un hospital dedicado por completo a la salud de la mujer y la neonatología.',
  },
  {
    icon: Award,
    title: 'Calidad médica',
    text: 'Equipos profesionales y tecnología actualizada para un diagnóstico y tratamiento precisos.',
  },
];

export function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="hospital" ref={ref} className="py-24 sm:py-32">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image collage */}
          <div className="relative reveal">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.pexels.com/photos/9054999/pexels-photo-9054999.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Equipo médico del hospital"
                  className="rounded-3xl object-cover aspect-[4/5] w-full shadow-card"
                  loading="lazy"
                />
                <img
                  src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Edificio del hospital"
                  className="rounded-3xl object-cover aspect-square w-full shadow-card"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4 pt-10">
                <img
                  src="https://images.pexels.com/photos/3279203/pexels-photo-3279203.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Madre con su recién nacido"
                  className="rounded-3xl object-cover aspect-square w-full shadow-card"
                  loading="lazy"
                />
                <img
                  src="https://images.pexels.com/photos/7088480/pexels-photo-7088480.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Consulta prenatal"
                  className="rounded-3xl object-cover aspect-[4/5] w-full shadow-card"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lift px-6 py-4 flex items-center gap-4 ring-1 ring-ink-100">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-amber-400">
                    <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8 4.8 17.1l1-5.8L1.5 7.2l5.9-.9L10 1z" />
                  </svg>
                ))}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-ink-900">Hospital de referencia</p>
                <p className="text-xs text-ink-500">en salud de la mujer</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="reveal">
            <span className="eyebrow">
              <span className="h-px w-6 bg-primary-400" />
              El Hospital
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink-900 text-balance leading-tight">
              Una institución dedicada por completo a la salud de la mujer
            </h2>
            <p className="mt-5 text-lg text-ink-600 leading-relaxed">
              El Hospital de la Mujer Dr. Percy Boland Rodríguez es el principal centro de referencia
              en salud materna y neonatal de Santa Cruz de la Sierra. Combinamos experiencia médica,
              tecnología y un trato profundamente humano.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {pillars.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <span className="shrink-0 grid place-items-center h-11 w-11 rounded-xl bg-primary-50 text-primary-600">
                    <p.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">{p.title}</h3>
                    <p className="mt-1 text-sm text-ink-500 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-100 rounded-3xl overflow-hidden reveal">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-8 text-center">
              <p className="text-4xl lg:text-5xl font-display font-medium text-primary-600">{s.value}</p>
              <p className="mt-2 text-sm text-ink-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
