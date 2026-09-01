import { useState } from 'react';
import { HeartPulse, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary-600">
              <HeartPulse className="h-7 w-7 text-white" strokeWidth={2.2} />
            </span>
            <div className="leading-tight">
              <p className="font-display font-medium text-primary-800">Hospital de la Mujer</p>
              <p className="text-xs text-ink-400 uppercase tracking-wider">Panel administrativo</p>
            </div>
          </div>

          <h1 className="text-2xl font-display font-medium text-ink-900">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-ink-500">
            Ingresa con tu cuenta de personal autorizado.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-300" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@hospitaldelamujer.edu.bo"
                  className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 pl-11 pr-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-primary-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-300" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-ink-100 bg-ink-50/50 pl-11 pr-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-primary-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Ingresando…
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <a
            href="#/"
            className="mt-6 inline-block text-sm text-ink-400 hover:text-primary-600 transition-colors"
          >
            ← Volver al portal público
          </a>
        </div>
      </div>

      {/* Right: branding */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-ink-900 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
        <img
          src="https://images.pexels.com/photos/7088531/pexels-photo-7088531.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-md text-white p-12">
          <h2 className="text-3xl font-display font-medium text-balance leading-tight">
            Gestiona el contenido del portal desde un solo lugar
          </h2>
          <p className="mt-4 text-white/70 text-lg leading-relaxed">
            Campañas, noticias, servicios, preguntas frecuentes y más — todo administrable sin
            necesidad de un programador.
          </p>
        </div>
      </div>
    </div>
  );
}
