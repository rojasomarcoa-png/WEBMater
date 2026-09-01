import { useEffect, useState } from 'react';
import { Menu, X, HeartPulse, ChevronRight } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useReveal';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'El Hospital', href: '#hospital' },
  { label: 'Servicios', href: '#especialidades' },
  { label: 'Campañas', href: '#campanas' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Pacientes', href: '#pacientes' },
  { label: 'Contacto', href: '#contacto' },
];

export function Header() {
  const scrolled = useScrollPosition();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-ink-100 shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group shrink-0">
          <span
            className={`grid place-items-center h-11 w-11 rounded-2xl transition-all duration-500 group-hover:scale-105 ${
              scrolled ? 'bg-primary-600' : 'bg-white/15 backdrop-blur-md ring-1 ring-white/30'
            }`}
          >
            <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span
              className={`block text-[0.95rem] font-bold font-display transition-colors ${
                scrolled ? 'text-primary-800' : 'text-white'
              }`}
            >
              Hospital de la Mujer
            </span>
            <span
              className={`block text-[0.7rem] font-medium uppercase tracking-wider transition-colors ${
                scrolled ? 'text-ink-500' : 'text-white/70'
              }`}
            >
              Dr. Percy Boland R.
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2 rounded-full text-[0.9rem] font-medium transition-all duration-300 ${
                scrolled
                  ? 'text-ink-700 hover:bg-primary-50 hover:text-primary-700'
                  : 'text-white/85 hover:bg-white/15 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="#resultados"
            className={`btn-secondary !py-2.5 !px-5 ${!scrolled && '!bg-white/10 !text-white !border-white/30 hover:!bg-white/20'}`}
          >
            Resultados
          </a>
          <a href="#contacto" className="btn-primary !py-2.5">
            Contacto
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden grid place-items-center h-11 w-11 rounded-xl transition-colors ${
            scrolled ? 'text-primary-800 bg-primary-50' : 'text-white bg-white/15 backdrop-blur-md'
          }`}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-20 z-40 bg-white animate-fade-in">
          <div className="container-page py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 px-4 rounded-2xl hover:bg-primary-50 transition-colors group"
              >
                <span className="text-lg font-medium text-ink-800 group-hover:text-primary-700">
                  {link.label}
                </span>
                <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <a href="#resultados" onClick={() => setOpen(false)} className="btn-secondary w-full">
                Consultar resultados
              </a>
              <a href="#contacto" onClick={() => setOpen(false)} className="btn-primary w-full">
                Contactar al hospital
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
