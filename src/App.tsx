import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Public portal
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { QuickActions } from '@/components/QuickActions';
import { About } from '@/components/About';
import { Specialties } from '@/components/Specialties';
import { Campaigns } from '@/components/Campaigns';
import { News } from '@/components/News';
import { LabResults } from '@/components/LabResults';
import { PatientInfo } from '@/components/PatientInfo';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

// Admin panel
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminLayout, type AdminSection } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { CampaignsManager } from '@/components/admin/CampaignsManager';
import { NewsManager } from '@/components/admin/NewsManager';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { FaqManager } from '@/components/admin/FaqManager';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
}

function PublicPortal() {
  return (
    <div className="min-h-screen bg-white text-ink-900 antialiased">
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <About />
        <Specialties />
        <Campaigns />
        <LabResults />
        <PatientInfo />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function AdminPanel() {
  const { session, profile, loading, signOut } = useAuth();
  const [section, setSection] = useState<AdminSection>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50 p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-ink-900">Acceso no autorizado</h2>
          <p className="mt-2 text-ink-500">
            Tu cuenta no tiene permisos para acceder al panel administrativo. Contacta al
            administrador del sistema.
          </p>
          <button
            onClick={() => { signOut(); }}
            className="mt-6 btn-secondary"
          >
            Cerrar sesión e intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout active={section} onNavigate={setSection}>
      {section === 'dashboard' && <AdminDashboard />}
      {section === 'campaigns' && <CampaignsManager />}
      {section === 'news' && <NewsManager />}
      {section === 'services' && <ServicesManager />}
      {section === 'faq' && <FaqManager />}
    </AdminLayout>
  );
}

export default function App() {
  const hash = useHashRoute();
  const isAdmin = hash.startsWith('#/admin');

  return (
    <AuthProvider>
      {isAdmin ? <AdminPanel /> : <PublicPortal />}
    </AuthProvider>
  );
}
