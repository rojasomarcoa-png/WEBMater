import { useState } from 'react';
import { Plus, MapPin, Clock, FileText, UserCheck, Loader2 } from 'lucide-react';
import { faqItems as fallbackFaq } from '@/data/content';
import { usePublishedFaq } from '@/hooks/useContent';
import { useReveal } from '@/hooks/useReveal';

const infoCards = [
  {
    icon: Clock,
    title: 'Horarios de atención',
    lines: ['Lun a Vie: 07:00 – 19:00', 'Sábados: 08:00 – 13:00', 'Urgencias: 24 horas'],
  },
  {
    icon: MapPin,
    title: 'Cómo llegar',
    lines: ['Cuarto anillo externo y radial 26', 'Zona Los Lotes', 'Santa Cruz de la Sierra'],
  },
  {
    icon: FileText,
    title: 'Documentos necesarios',
    lines: ['Cédula de identidad vigente', 'Carnet de asegurado', 'Órdenes médicas previas'],
  },
  {
    icon: UserCheck,
    title: 'Horario de visitas',
    lines: ['11:00 – 13:00', '16:00 – 19:00', 'Un acompañante por paciente'],
  },
];

export function PatientInfo() {
  const ref = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);
  const { items: faqData, loading: faqLoading } = usePublishedFaq();

  const faqList = faqData.length > 0
    ? faqData.map((f) => ({ question: f.question, answer: f.answer }))
    : fallbackFaq;

  return (
    <section id="pacientes" ref={ref} className="py-24 sm:py-32 bg-gradient-to-b from-white to-primary-50/50">
      <div className="container-page">
        <div className="max-w-2xl reveal">
          <span className="eyebrow">
            <span className="h-px w-6 bg-primary-400" />
            Información para pacientes
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-ink-900 text-balance">
            Todo lo que necesitas saber antes de tu visita
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Información clara y directa para que tu experiencia sea lo más sencilla posible.
          </p>
        </div>

        {/* Info cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal">
          {infoCards.map((card) => (
            <div key={card.title} className="card p-6 hover:-translate-y-1 hover:shadow-lift transition-all duration-500">
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-600">
                <card.icon className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h3 className="mt-4 font-semibold text-ink-900">{card.title}</h3>
              <ul className="mt-3 space-y-1">
                {card.lines.map((line) => (
                  <li key={line} className="text-sm text-ink-500">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 grid lg:grid-cols-[1fr_2fr] gap-12">
          <div className="reveal">
            <h3 className="text-2xl font-display font-medium text-ink-900">
              Preguntas frecuentes
            </h3>
            <p className="mt-3 text-ink-500">
              ¿No encuentras lo que buscas? Escríbenos desde la sección de contacto y te
              responderemos a la brevedad.
            </p>
          </div>

          <div className="space-y-3 reveal">
            {faqLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
              </div>
            ) : (
              faqList.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={i}
                    className={`card overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lift border-primary-200' : ''}`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-ink-900">{item.question}</span>
                      <span
                        className={`shrink-0 grid place-items-center h-8 w-8 rounded-full transition-all duration-500 ${
                          isOpen ? 'bg-primary-600 text-white rotate-45' : 'bg-primary-50 text-primary-600'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-500 ease-out"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-ink-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
