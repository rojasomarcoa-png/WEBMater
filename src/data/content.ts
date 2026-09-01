export type IconName =
  | 'file-text'
  | 'stethoscope'
  | 'info'
  | 'clipboard-list'
  | 'megaphone'
  | 'phone'
  | 'heart'
  | 'baby'
  | 'microscope'
  | 'activity'
  | 'syringe'
  | 'scan'
  | 'flower'
  | 'shield'
  | 'clock'
  | 'map-pin'
  | 'mail'
  | 'calendar'
  | 'users'
  | 'sparkles';

export interface Service {
  icon: IconName;
  title: string;
  description: string;
}

export interface QuickAction {
  icon: IconName;
  title: string;
  description: string;
  href: string;
  accent: 'primary' | 'accent' | 'rose' | 'amber';
}

export interface Campaign {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  status: 'active' | 'upcoming';
}

export interface NewsItem {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const quickActions: QuickAction[] = [
  {
    icon: 'file-text',
    title: 'Consultar resultados',
    description: 'Accede a tus exámenes de laboratorio de forma segura y privada.',
    href: '#resultados',
    accent: 'primary',
  },
  {
    icon: 'stethoscope',
    title: 'Ver especialidades',
    description: 'Conoce las áreas médicas disponibles para tu atención.',
    href: '#especialidades',
    accent: 'accent',
  },
  {
    icon: 'info',
    title: 'Información para pacientes',
    description: 'Horarios, documentos, requisitos y recomendaciones.',
    href: '#pacientes',
    accent: 'rose',
  },
  {
    icon: 'clipboard-list',
    title: 'Requisitos y documentos',
    description: 'Todo lo que necesitas para tu cita o internación.',
    href: '#pacientes',
    accent: 'amber',
  },
  {
    icon: 'megaphone',
    title: 'Campañas de salud',
    description: 'Participa en nuestras campañas activas y preventivas.',
    href: '#campanas',
    accent: 'primary',
  },
  {
    icon: 'phone',
    title: 'Contactar al hospital',
    description: 'Teléfonos, correos y ubicación para llegar a nosotros.',
    href: '#contacto',
    accent: 'accent',
  },
];

export const services: Service[] = [
  {
    icon: 'heart',
    title: 'Ginecología',
    description: 'Atención integral de la salud reproductiva y prevención de enfermedades.',
  },
  {
    icon: 'baby',
    title: 'Obstetricia',
    description: 'Control prenatal, seguimiento del embarazo y atención del parto.',
  },
  {
    icon: 'flower',
    title: 'Maternidad',
    description: 'Espacios y cuidados para la madre y el recién nacido durante el posparto.',
  },
  {
    icon: 'baby',
    title: 'Neonatología',
    description: 'Cuidado especializado para recién nacidos, incluyendo unidad de cuidados intensivos.',
  },
  {
    icon: 'users',
    title: 'Pediatría',
    description: 'Atención médica para niñas y niños en sus primeras etapas de vida.',
  },
  {
    icon: 'microscope',
    title: 'Laboratorio',
    description: 'Análisis clínicos con resultados confiables y acceso seguro en línea.',
  },
  {
    icon: 'scan',
    title: 'Diagnóstico por imágenes',
    description: 'Ecografías, radiografía y estudios complementarios para un diagnóstico preciso.',
  },
  {
    icon: 'syringe',
    title: 'Vacunación',
    description: 'Esquemas de vacunación para madres, recién nacidos y mujeres en todas las etapas.',
  },
];

export const campaigns: Campaign[] = [
  {
    image: 'https://images.pexels.com/photos/7088531/pexels-photo-7088531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Prevención',
    title: 'Prevención del cáncer de cuello uterino',
    excerpt: 'Conoce los signos de alerta, la importancia del Papanicolaou y la vacuna contra el VPH.',
    date: 'Agosto 2026',
    status: 'active',
  },
  {
    image: 'https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Maternidad',
    title: 'Lactancia materna: el mejor inicio',
    excerpt: 'Talleres prácticos y acompañamiento para una lactancia exitosa y sin complicaciones.',
    date: 'Septiembre 2026',
    status: 'active',
  },
  {
    image: 'https://images.pexels.com/photos/7108418/pexels-photo-7108418.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Control prenatal',
    title: 'Control prenatal esencial',
    excerpt: 'Por qué cada trimestre importa. Cronograma de controles y signos que no debes ignorar.',
    date: 'Octubre 2026',
    status: 'upcoming',
  },
];

export const newsItems: NewsItem[] = [
  {
    image: 'https://images.pexels.com/photos/9054999/pexels-photo-9054999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Institucional',
    title: 'Equipo médico del hospital reconoce a profesionales destacadas',
    excerpt: 'Por su dedicación y excelencia en la atención a mujeres y recién nacidos.',
    date: '22 ago 2026',
    author: 'Dirección Médica',
  },
  {
    image: 'https://images.pexels.com/photos/6627687/pexels-photo-6627687.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Laboratorio',
    title: 'Modernización del laboratorio clínico',
    excerpt: 'Nuevos equipos amplían nuestra capacidad de análisis y reducen tiempos de espera.',
    date: '14 ago 2026',
    author: 'Departamento de Laboratorio',
  },
  {
    image: 'https://images.pexels.com/photos/3279203/pexels-photo-3279203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Neonatología',
    title: 'Nueva sala de cuidado canguro abrió sus puertas',
    excerpt: 'Un espacio pensado para el vínculo entre madre y bebé prematuro.',
    date: '02 ago 2026',
    author: 'Área de Neonatología',
  },
];

export const faqItems: FaqItem[] = [
  {
    question: '¿Cuáles son los horarios de atención?',
    answer:
      'La atención ambulatoria es de lunes a viernes de 07:00 a 19:00 y los sábados de 08:00 a 13:00. El servicio de urgencias y maternidad funciona las 24 horas, todos los días del año.',
  },
  {
    question: '¿Qué documentos necesito para mi primera cita?',
    answer:
      'Documento de identidad vigente, carnet de asegurado (si corresponde) y cualquier examen o documento médico previo relacionado con tu consulta.',
  },
  {
    question: '¿Cuál es el horario de visita en maternidad?',
    answer:
      'Las visitas en el área de maternidad están permitidas de 11:00 a 13:00 y de 16:00 a 19:00. Solo se permite el ingreso de un acompañante por paciente, y los hermanos menores de 12 años no pueden ingresar al área de neonatología.',
  },
  {
    question: '¿Cómo llego al hospital?',
    answer:
      'Estamos ubicados en el cuarto anillo externo y radial 26, zona Los Lotes, Santa Cruz de la Sierra. Puedes consultar el mapa en la sección de contacto o abrir la navegación directamente desde tu teléfono.',
  },
  {
    question: '¿Puedo consultar mis resultados de laboratorio en línea?',
    answer:
      'Sí. Ingresa a "Consultar resultados", identifica tu cuenta con los datos que el hospital te proporcionó y podrás ver únicamente tus propios resultados. Ningún dato médico se expone públicamente.',
  },
  {
    question: '¿Qué debo llevar para la internación?',
    answer:
      'Ropa cómoda, artículos de higiene personal, documento de identidad, órdenes médicas previas y, en caso de maternidad, el paquete de ropa para el recién nacido que se indica en la guía de internación.',
  },
];

export const stats: Stat[] = [
  { value: '+40', label: 'años cuidando vidas' },
  { value: '24/7', label: 'urgencias y maternidad' },
  { value: '+15', label: 'especialidades' },
  { value: '+8 mil', label: 'atenciones al año' },
];
