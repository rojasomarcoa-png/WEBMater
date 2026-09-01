import { MapPin, Phone, Mail, Clock, Navigation, Facebook, Instagram, Youtube } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Cuarto anillo externo y radial 26, zona Los Lotes',
    sub: 'Santa Cruz de la Sierra, Bolivia',
  },
  {
    icon: Phone,
    label: 'Teléfonos',
    value: '(591) 3 345-6789',
    sub: 'Urgencias: (591) 3 345-6790',
  },
  {
    icon: Mail,
    label: 'Correo institucional',
    value: 'info@hospitaldelamujer.edu.bo',
    sub: 'Lun a Vie, respuesta en 24 h',
  },
  {
    icon: Clock,
    label: 'Horario general',
    value: 'Lun a Vie: 07:00 – 19:00',
    sub: 'Urgencias y maternidad: 24/7',
  },
];

export function Contact() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="contacto" ref={ref} className="py-24 sm:py-32">
      <div className="container-page">
        <div className="max-w-2xl reveal">
          <span className="eyebrow">
            <span className="h-px w-6 bg-primary-400" />
            Contacto y ubicación
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink-900 text-balance">
            Estamos aquí para ayudarte
          </h2>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-4 reveal">
            {contactInfo.map((info) => (
              <div key={info.label} className="card p-6 flex items-start gap-4 hover:shadow-lift transition-shadow duration-500">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 shrink-0">
                  <info.icon className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    {info.label}
                  </p>
                  <p className="mt-1 font-semibold text-ink-900">{info.value}</p>
                  <p className="text-sm text-ink-500">{info.sub}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Redes sociales oficiales
              </p>
              <div className="mt-4 flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Youtube, label: 'YouTube' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="grid place-items-center h-11 w-11 rounded-xl bg-ink-50 text-ink-600 hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="reveal">
            <div className="card overflow-hidden h-full min-h-[420px] relative group">
              <iframe
                title="Ubicación del Hospital de la Mujer"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-63.181%2C-17.815%2C-63.141%2C-17.775&layer=mapnik&marker=-17.795%2C-63.161"
                className="absolute inset-0 h-full w-full grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white rounded-2xl shadow-lift p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary-600 text-white shrink-0">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">
                      Hospital de la Mujer
                    </p>
                    <p className="text-xs text-ink-500 truncate">Santa Cruz de la Sierra</p>
                  </div>
                </div>
                <a
                  href="https://www.openstreetmap.org/?mlat=-17.795&mlon=-63.161#map=15/-17.795/-63.161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2.5 !px-4 text-sm shrink-0"
                >
                  <Navigation className="h-4 w-4" />
                  Cómo llegar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
