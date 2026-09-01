import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, FileText, Megaphone, Play } from 'lucide-react';

const slides = [
  {
    image: 'https://images.pexels.com/photos/7088531/pexels-photo-7088531.jpeg?auto=compress&cs=tinysrgb&w=1920',
    kicker: 'Atención a la mujer',
    title: 'Cuidamos la salud de la mujer',
  },
  {
    image: 'https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&w=1920',
    kicker: 'Maternidad',
    title: 'Y del recién nacido',
  },
  {
    image: 'https://images.pexels.com/photos/7108418/pexels-photo-7108418.jpeg?auto=compress&cs=tinysrgb&w=1920',
    kicker: 'Control prenatal',
    title: 'Cada etapa importa',
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section id="inicio" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`h-full w-full object-cover ${i === active ? 'animate-ken-burns' : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          </div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-900/55 to-ink-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
      </div>

      {/* Organic shape decoration */}
      <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-accent-400/15 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="container-page relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
              {slides[active].kicker}
            </span>
          </div>

          <h1
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-medium text-white text-balance leading-[1.05] animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Cuidamos la salud de la mujer y del recién nacido
          </h1>

          <p
            className="mt-6 max-w-xl text-lg sm:text-xl text-white/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.35s' }}
          >
            Información, orientación y acceso a los servicios del Hospital de la Mujer Dr. Percy
            Boland Rodríguez, en Santa Cruz de la Sierra.
          </p>

          <div
            className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            <a href="#especialidades" className="btn-primary text-base">
              Ver servicios
              <ChevronRight className="h-5 w-5" />
            </a>
            <a
              href="#pacientes"
              className="btn bg-white/10 backdrop-blur-md text-white border-2 border-white/25 px-6 py-3 text-base hover:bg-white/20"
            >
              Información para pacientes
            </a>
          </div>

          {/* Quick links */}
          <div
            className="mt-10 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: '0.65s' }}
          >
            <a
              href="#resultados"
              className="group inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur-sm ring-1 ring-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/15 transition-all"
            >
              <FileText className="h-4 w-4 text-accent-300" />
              Resultados de laboratorio
            </a>
            <a
              href="#campanas"
              className="group inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur-sm ring-1 ring-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/15 transition-all"
            >
              <Megaphone className="h-4 w-4 text-accent-300" />
              Campañas activas
            </a>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container-page flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? 'w-10 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir a la imagen ${i + 1}`}
              />
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/70 text-xs uppercase tracking-wider">
            <Play className="h-3 w-3" />
            Recorre el hospital
          </div>
        </div>
      </div>
    </section>
  );
}
