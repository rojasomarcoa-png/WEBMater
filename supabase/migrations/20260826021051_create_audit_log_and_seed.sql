/*
# Create audit log and seed initial content

## Purpose
1. Adds an audit_log table to track all administrative content changes (who,
   what, when) — required by the specification's editorial workflow.
2. Seeds the content tables with the data currently hardcoded in the frontend
   so the public portal works from the database on day one.

## New Tables

### audit_log
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users) — who made the change
- `action` (text) — 'create', 'update', 'delete', 'publish', 'archive'
- `entity_type` (text) — 'campaign', 'news', 'service', 'faq', 'page', 'profile'
- `entity_id` (uuid, nullable) — the row that was changed
- `summary` (text) — human-readable description
- `created_at` (timestamptz)

## Security
- RLS on audit_log: admins can read all entries; all authenticated users can
  insert (the system logs actions automatically); nobody can update or delete
  (immutable audit trail).

## Seed Data
- 8 services (matching current frontend)
- 3 campaigns (matching current frontend)
- 3 news items (matching current frontend)
- 6 FAQ items (matching current frontend)

## Notes
1. Seed data is inserted with published=true so the public portal shows it.
2. The audit_log is append-only — no UPDATE or DELETE policies are created.
*/

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  summary text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can read the full audit log
DROP POLICY IF EXISTS "admin_select_audit" ON audit_log;
CREATE POLICY "admin_select_audit"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Any authenticated user can insert audit entries (system-generated)
DROP POLICY IF EXISTS "staff_insert_audit" ON audit_log;
CREATE POLICY "staff_insert_audit"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log (entity_type, entity_id);

-- ===================== SEED: SERVICES =====================
INSERT INTO services (icon_name, title, description, sort_order, is_published)
VALUES
  ('heart', 'Ginecología', 'Atención integral de la salud reproductiva y prevención de enfermedades.', 1, true),
  ('baby', 'Obstetricia', 'Control prenatal, seguimiento del embarazo y atención del parto.', 2, true),
  ('flower', 'Maternidad', 'Espacios y cuidados para la madre y el recién nacido durante el posparto.', 3, true),
  ('baby', 'Neonatología', 'Cuidado especializado para recién nacidos, incluyendo unidad de cuidados intensivos.', 4, true),
  ('users', 'Pediatría', 'Atención médica para niñas y niños en sus primeras etapas de vida.', 5, true),
  ('microscope', 'Laboratorio', 'Análisis clínicos con resultados confiables y acceso seguro en línea.', 6, true),
  ('scan', 'Diagnóstico por imágenes', 'Ecografías, radiografía y estudios complementarios para un diagnóstico preciso.', 7, true),
  ('syringe', 'Vacunación', 'Esquemas de vacunación para madres, recién nacidos y mujeres en todas las etapas.', 8, true)
ON CONFLICT DO NOTHING;

-- ===================== SEED: CAMPAIGNS =====================
INSERT INTO campaigns (title, excerpt, body, image_url, category, status, published_at)
VALUES
  (
    'Prevención del cáncer de cuello uterino',
    'Conoce los signos de alerta, la importancia del Papanicolaou y la vacuna contra el VPH.',
    'Contenido detallado de la campaña pendiente de carga por el equipo del hospital.',
    'https://images.pexels.com/photos/7088531/pexels-photo-7088531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Prevención',
    'publicado',
    now()
  ),
  (
    'Lactancia materna: el mejor inicio',
    'Talleres prácticos y acompañamiento para una lactancia exitosa y sin complicaciones.',
    'Contenido detallado de la campaña pendiente de carga por el equipo del hospital.',
    'https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Maternidad',
    'publicado',
    now()
  ),
  (
    'Control prenatal esencial',
    'Por qué cada trimestre importa. Cronograma de controles y signos que no debes ignorar.',
    'Contenido detallado de la campaña pendiente de carga por el equipo del hospital.',
    'https://images.pexels.com/photos/7108418/pexels-photo-7108418.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Control prenatal',
    'publicado',
    now()
  )
ON CONFLICT DO NOTHING;

-- ===================== SEED: NEWS =====================
INSERT INTO news (title, excerpt, body, image_url, category, author, status, published_at)
VALUES
  (
    'Equipo médico del hospital reconoce a profesionales destacadas',
    'Por su dedicación y excelencia en la atención a mujeres y recién nacidos.',
    'Contenido detallado pendiente de carga por el equipo del hospital.',
    'https://images.pexels.com/photos/9054999/pexels-photo-9054999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Institucional',
    'Dirección Médica',
    'publicado',
    now()
  ),
  (
    'Modernización del laboratorio clínico',
    'Nuevos equipos amplían nuestra capacidad de análisis y reducen tiempos de espera.',
    'Contenido detallado pendiente de carga por el equipo del hospital.',
    'https://images.pexels.com/photos/6627687/pexels-photo-6627687.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Laboratorio',
    'Departamento de Laboratorio',
    'publicado',
    now()
  ),
  (
    'Nueva sala de cuidado canguro abrió sus puertas',
    'Un espacio pensado para el vínculo entre madre y bebé prematuro.',
    'Contenido detallado pendiente de carga por el equipo del hospital.',
    'https://images.pexels.com/photos/3279203/pexels-photo-3279203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'Neonatología',
    'Área de Neonatología',
    'publicado',
    now()
  )
ON CONFLICT DO NOTHING;

-- ===================== SEED: FAQ =====================
INSERT INTO faq_items (question, answer, sort_order, is_published)
VALUES
  (
    '¿Cuáles son los horarios de atención?',
    'La atención ambulatoria es de lunes a viernes de 07:00 a 19:00 y los sábados de 08:00 a 13:00. El servicio de urgencias y maternidad funciona las 24 horas, todos los días del año.',
    1, true
  ),
  (
    '¿Qué documentos necesito para mi primera cita?',
    'Documento de identidad vigente, carnet de asegurado (si corresponde) y cualquier examen o documento médico previo relacionado con tu consulta.',
    2, true
  ),
  (
    '¿Cuál es el horario de visita en maternidad?',
    'Las visitas en el área de maternidad están permitidas de 11:00 a 13:00 y de 16:00 a 19:00. Solo se permite el ingreso de un acompañante por paciente, y los hermanos menores de 12 años no pueden ingresar al área de neonatología.',
    3, true
  ),
  (
    '¿Cómo llego al hospital?',
    'Estamos ubicados en el cuarto anillo externo y radial 26, zona Los Lotes, Santa Cruz de la Sierra. Puedes consultar el mapa en la sección de contacto o abrir la navegación directamente desde tu teléfono.',
    4, true
  ),
  (
    '¿Puedo consultar mis resultados de laboratorio en línea?',
    'Sí. Ingresa a "Consultar resultados", identifica tu cuenta con los datos que el hospital te proporcionó y podrás ver únicamente tus propios resultados. Ningún dato médico se expone públicamente.',
    5, true
  ),
  (
    '¿Qué debo llevar para la internación?',
    'Ropa cómoda, artículos de higiene personal, documento de identidad, órdenes médicas previas y, en caso de maternidad, el paquete de ropa para el recién nacido que se indica en la guía de internación.',
    6, true
  )
ON CONFLICT DO NOTHING;
