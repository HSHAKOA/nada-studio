import {
  SiWhatsapp,
  SiGooglecalendar,
  SiGmail,
  SiInstagram,
  SiN8N,
  SiPix,
} from "react-icons/si";
import { Sparkles } from "lucide-react";

type IconProps = {
  className?: string;
  size?: number;
};

export const ecosystemIcons: Record<
  string,
  React.ComponentType<IconProps>
> = {
  whatsapp: SiWhatsapp,
  calendar: SiGooglecalendar,
  mail: SiGmail,
  instagram: SiInstagram,
  n8n: SiN8N,
  spark: Sparkles,
  pix: SiPix,
};
