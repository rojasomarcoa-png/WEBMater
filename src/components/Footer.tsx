import { HeartPulse, MapPin, Phone, Mail, Shield, FileText, ChevronRight } from 'lucide-react';

const footerLinks = [
  {
    title: 'Portal',
    links: ['Inicio', 'El Hospital', 'Servicios', 'Especialidades', 'Campañas'],
  },
  {
    title: 'Pacientes',
    links: ['Información para pacientes', 'Consultar resultados', 'Requisitos', 'Horarios', 'Contacto'],
  },
  {
    title: 'Institucional',
    links: ['Noticias', 'Transparencia', 'Políticas de privacidad', 'Términos de uso'],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-200">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

      <div className="container-page py-16">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-11 w-11 rounded-2xl bg-primary-600">
                <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.2} />
              </span>
              <div className="leading-tight">
                <p className="font-display font-medium text-white">Hospital de la Mujer</p>
                <p className="text-xs text-ink-400 uppercase tracking-wider">Dr. Percy Boland R.</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-ink-400 leading-relaxed max-w-xs">
              Hospital de referencia en salud de la mujer y neonatología en Santa Cruz de la Sierra,
              Bolivia.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5 text-ink-300">
                <MapPin className="h-4 w-4 text-primary-400 shrink-0" />
                Zona Los Lotes, Santa Cruz de la Sierra
              </p>
              <p className="flex items-center gap-2.5 text-ink-300">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                (591) 3 345-6789
              </p>
              <p className="flex items-center gap-2.5 text-ink-300">
                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                info@hospitaldelamujer.edu.bo
              </p>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm text-ink-400 hover:text-primary-300 transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-ink-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500 text-center sm:text-left">
            © {new Date().getFullYear()} Hospital de la Mujer Dr. Percy Boland Rodríguez. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary-500" />
              Portal seguro
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-700" />
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary-500" />
              Políticas
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-700" />
            <a href="#/admin" className="text-ink-600 hover:text-primary-400 transition-colors">
              Acceso personal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
