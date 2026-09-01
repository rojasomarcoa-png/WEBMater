import {
  Activity,
  Baby,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Flower2,
  Heart,
  Info,
  Mail,
  MapPin,
  Megaphone,
  Microscope,
  Phone,
  Scan,
  Shield,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/data/content';

const icons: Record<IconName, LucideIcon> = {
  'file-text': FileText,
  stethoscope: Stethoscope,
  info: Info,
  'clipboard-list': ClipboardList,
  megaphone: Megaphone,
  phone: Phone,
  heart: Heart,
  baby: Baby,
  microscope: Microscope,
  activity: Activity,
  syringe: Syringe,
  scan: Scan,
  flower: Flower2,
  shield: Shield,
  clock: Clock,
  'map-pin': MapPin,
  mail: Mail,
  calendar: Calendar,
  users: Users,
  sparkles: Sparkles,
};

export function Icon({ name, ...props }: { name: IconName } & React.ComponentProps<LucideIcon>) {
  const Cmp = icons[name];
  return <Cmp {...props} />;
}
