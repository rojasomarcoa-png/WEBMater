import { type ReactNode } from 'react';
import {
  HeartPulse,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Stethoscope,
  HelpCircle,
  LogOut,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export type AdminSection = 'dashboard' | 'campaigns' | 'news' | 'services' | 'faq';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campañas', icon: Megaphone },
  { id: 'news', label: 'Noticias', icon: Newspaper },
  { id: 'services', label: 'Servicios', icon: Stethoscope },
  { id: 'faq', label: 'Preguntas frecuentes', icon: HelpCircle },
];

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  publicador: 'Publicador',
  revisor: 'Revisor',
  colaborador: 'Colaborador',
};

export function AdminLayout({
  active,
  onNavigate,
  children,
}: {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  children: ReactNode;
}) {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-ink-50/60 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-ink-100 flex flex-col fixed lg:sticky top-0 h-screen z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-20 border-b border-ink-100">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary-600">
            <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-display font-medium text-primary-800">Hospital de la Mujer</p>
            <p className="text-[0.65rem] text-ink-400 uppercase tracking-wider">CMS interno</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-ink-100 space-y-1">
          <a
            href="#/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            Ver portal público
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Cerrar sesión
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-t border-ink-100">
          <p className="text-sm font-semibold text-ink-900 truncate">
            {profile?.full_name || profile?.email}
          </p>
          <p className="text-xs text-primary-600 font-medium">
            {roleLabels[profile?.role ?? 'colaborador'] ?? 'Colaborador'}
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:ml-0 ml-64">
        <div className="p-6 lg:p-10 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
