import {
  SiWhatsapp,
  SiGooglecalendar,
  SiGmail,
  SiInstagram,
  SiN8N,
  SiPix,
} from "react-icons/si";
import { OpenAIIcon } from "@/components/icons/OpenAIIcon";

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
  openai: OpenAIIcon,
  pix: SiPix,
};
