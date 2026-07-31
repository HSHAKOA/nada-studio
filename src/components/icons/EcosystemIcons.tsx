type IconProps = {
  className?: string;
  size?: number;
};

function iconBase(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function WhatsAppIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <path d="M6.5 17.5 5 19.5l2.1-.6a7.5 7.5 0 1 0-2.6-2.4Z" />
      <path d="M9.2 9.6c.2 2.4 2.2 4.4 4.6 4.6.6 0 1.1-.4 1.1-1v-.5l-2-1-.6.8a4.6 4.6 0 0 1-2-2l.8-.6-1-2h-.5c-.6 0-1 .5-1 1.1Z" />
    </svg>
  );
}

function MailIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4.5 6.5 12 12.5l7.5-6" />
    </svg>
  );
}

function CalendarIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
      <path d="M4 10h16M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

function WorkflowIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M8 7h8M7.4 8.7 10.6 15M16.6 8.7 13.4 15" />
    </svg>
  );
}

function CameraIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <rect x="3.5" y="6.5" width="17" height="13" rx="3" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M8.5 6.5 9.7 4.5h4.6l1.2 2" />
    </svg>
  );
}

function SparkIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <path d="M12 3.5c.5 3 2.5 5 5.5 5.5-3 .5-5 2.5-5.5 5.5-.5-3-2.5-5-5.5-5.5 3-.5 5-2.5 5.5-5.5Z" />
      <path d="M18.5 15c.3 1.4 1.1 2.2 2.5 2.5-1.4.3-2.2 1.1-2.5 2.5-.3-1.4-1.1-2.2-2.5-2.5 1.4-.3 2.2-1.1 2.5-2.5Z" />
    </svg>
  );
}

function TableIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15M15 4.5v15" />
    </svg>
  );
}

function GlobeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...iconBase(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5S14.4 18.7 12 21c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z" />
    </svg>
  );
}

export const ecosystemIcons: Record<string, (props: IconProps) => React.ReactElement> = {
  whatsapp: WhatsAppIcon,
  mail: MailIcon,
  calendar: CalendarIcon,
  workflow: WorkflowIcon,
  camera: CameraIcon,
  spark: SparkIcon,
  table: TableIcon,
  globe: GlobeIcon,
};
