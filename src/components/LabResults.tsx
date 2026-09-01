import { useState } from 'react';
import { Lock, FileText, Download, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

export function LabResults() {
  const ref = useReveal<HTMLDivElement>();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="resultados" ref={ref} className="py-24 sm:py-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary-700 via-primary-800 to-ink-900 px-6 py-16 sm:px-16 sm:py-20 shadow-lift reveal">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
                <Lock className="h-3.5 w-3.5 text-accent-300" />
                Acceso seguro
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-display font-medium text-balance leading-tight">
                Consulta tus resultados de laboratorio
              </h2>
              <p className="mt-4 text-white/75 text-lg leading-relaxed">
                Ingresa con los datos que el hospital te proporcionó. Solo tú puedes ver tus propios
                resultados; ningún dato médico se expone públicamente.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  'Identificación segura y validada',
                  'Resultados disponibles 24 horas',
                  'Descarga de documentos autorizada',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-accent-500/30 ring-1 ring-accent-400/40">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-200" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl p-8 shadow-glow">
              {!submitted ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-600">
                      <FileText className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink-900">Acceder a mis resultados</h3>
                      <p className="text-sm text-ink-500">Ingresa tus datos de paciente</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="doc" className="block text-sm font-medium text-ink-700 mb-1.5">
                        Documento de identidad
                      </label>
                      <input
                        id="doc"
                        type="text"
                        required
                        placeholder="Ej. 1234567"
                        className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-primary-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-ink-700 mb-1.5">
                        Código de acceso
                      </label>
                      <input
                        id="code"
                        type="text"
                        required
                        placeholder="Código proporcionado por el hospital"
                        className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-primary-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Consultar resultados
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  <p className="mt-5 flex items-start gap-2 text-xs text-ink-400 leading-relaxed">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    Si no tienes tu código de acceso, acércate a admisión con tu documento de
                    identidad para obtenerlo.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-primary-50 text-primary-600">
                    <ShieldCheck className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink-900">Identificación verificada</h3>
                  <p className="mt-2 text-sm text-ink-500">
                    Este es un portal de demostración. La integración real con el sistema de
                    laboratorio del hospital mostrará aquí únicamente tus resultados autorizados.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 btn-secondary"
                  >
                    <Download className="h-4 w-4" />
                    Descargar resultados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
