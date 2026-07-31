type IconProps = {
  className?: string;
  size?: number;
};

function Badge({
  size,
  bg,
  children,
}: {
  size: number;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect x="1" y="1" width="38" height="38" rx="10" fill={bg} />
      {children}
    </svg>
  );
}

function WhatsAppIcon({ className, size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#25D366" />
      <path
        d="M13 27.5 11 29.5l1-4.3a8.6 8.6 0 1 1 1 2.3Z"
        fill="none"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 16.8c.3-.3.6-.3.9-.3h.7c.2 0 .5 0 .7.5l.9 2.1c.1.3.1.5 0 .8l-.6.8c-.1.2-.1.3 0 .5.5 1 1.8 2.3 2.8 2.8.2.1.3.1.5 0l.8-.6c.3-.1.5-.1.8 0l2.1.9c.5.2.5.5.5.7v.7c0 .3 0 .6-.3.9-.4.4-1.4 1-2.6.6-2.6-.8-5-2.9-6.5-5.9-.6-1.1-.3-2.2.3-2.5Z"
        fill="#fff"
      />
    </svg>
  );
}

function MailIcon({ size = 40 }: IconProps) {
  return (
    <Badge size={size} bg="#ffffff">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="none" stroke="#e5e5e5" strokeWidth={1} />
      <path
        d="M7 13.5c0-1.4 1.1-2.5 2.5-2.5h21c1.4 0 2.5 1.1 2.5 2.5v13c0 1.4-1.1 2.5-2.5 2.5h-21A2.5 2.5 0 0 1 7 26.5v-13Z"
        fill="#fff"
        stroke="#EA4335"
        strokeWidth={1.5}
      />
      <path d="M8 13 20 22 32 13" fill="none" stroke="#EA4335" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Badge>
  );
}

function CalendarIcon({ size = 40 }: IconProps) {
  return (
    <Badge size={size} bg="#ffffff">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="none" stroke="#e5e5e5" strokeWidth={1} />
      <path d="M8 12.5C8 11.1 9.1 10 10.5 10h19c1.4 0 2.5 1.1 2.5 2.5V29a2 2 0 0 1-2 2h-20a2 2 0 0 1-2-2V12.5Z" fill="#fff" stroke="#DADCE0" strokeWidth={1.2} />
      <path d="M8 15h24" stroke="#4285F4" strokeWidth={2.2} />
      <rect x="14.5" y="18.5" width="6" height="6" rx="1" fill="#4285F4" />
      <rect x="21.5" y="18.5" width="5" height="6" rx="1" fill="#EA4335" opacity={0.85} />
      <path d="M13.5 8v5M26.5 8v5" stroke="#9AA0A6" strokeWidth={1.8} strokeLinecap="round" />
    </Badge>
  );
}

function WorkflowIcon({ size = 40 }: IconProps) {
  return (
    <Badge size={size} bg="#EA4B71">
      <circle cx="12" cy="13" r="3.2" fill="#fff" />
      <circle cx="28" cy="13" r="3.2" fill="#fff" />
      <circle cx="20" cy="28" r="3.2" fill="#fff" />
      <path d="M15 13h10M14 15.5 18.5 25M26 15.5 21.5 25" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
    </Badge>
  );
}

function CameraIcon({ className, size = 40 }: IconProps) {
  const gradId = "ig-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="40" x2="40" y2="0">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="35%" stopColor="#D62976" />
          <stop offset="70%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill={`url(#${gradId})`} />
      <rect x="10.5" y="10.5" width="19" height="19" rx="6" fill="none" stroke="#fff" strokeWidth={1.8} />
      <circle cx="20" cy="20" r="5" fill="none" stroke="#fff" strokeWidth={1.8} />
      <circle cx="26.2" cy="13.8" r="1.4" fill="#fff" />
    </svg>
  );
}

function SparkIcon({ className, size = 40 }: IconProps) {
  const gradId = "ai-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6D5BFF" />
          <stop offset="100%" stopColor="#2E7BFF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill={`url(#${gradId})`} />
      <path
        d="M20 8c.8 4.6 4 7.8 8.6 8.6-4.6.8-7.8 4-8.6 8.6-.8-4.6-4-7.8-8.6-8.6 4.6-.8 7.8-4 8.6-8.6Z"
        fill="#fff"
      />
      <path
        d="M29.5 25c.4 1.9 1.5 3 3.4 3.4-1.9.4-3 1.5-3.4 3.4-.4-1.9-1.5-3-3.4-3.4 1.9-.4 3-1.5 3.4-3.4Z"
        fill="#fff"
        opacity={0.85}
      />
    </svg>
  );
}

function TableIcon({ size = 40 }: IconProps) {
  return (
    <Badge size={size} bg="#0F9D58">
      <rect x="9" y="9" width="22" height="22" rx="2.5" fill="#fff" />
      <path d="M9 16h22M9 24h22M17.3 9v22M24.6 9v22" stroke="#0F9D58" strokeWidth={1.6} />
    </Badge>
  );
}

function GlobeIcon({ size = 40 }: IconProps) {
  return (
    <Badge size={size} bg="#111111">
      <circle cx="20" cy="20" r="12.5" fill="none" stroke="#fff" strokeWidth={1.8} />
      <path
        d="M7.5 20h25M20 7.5c3.5 3.3 5.2 7.5 5.2 12.5S23.5 29.2 20 32.5c-3.5-3.3-5.2-7.5-5.2-12.5S16.5 10.8 20 7.5Z"
        fill="none"
        stroke="#fff"
        strokeWidth={1.6}
      />
    </Badge>
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
