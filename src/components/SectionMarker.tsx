type SectionMarkerProps = {
  label: string;
  number?: string;
  className?: string;
  // Cópia decorativa já aberta (sem animação de entrada).
  estatico?: boolean;
};

// ( nome ) 00X: os parênteses se abrem e o número sobe pela própria linha
// quando o marcador chega na zona de leitura (MotionRoot). Sem movimento,
// aparece completo.
export default function SectionMarker({ label, number, className = "mb-6", estatico = false }: SectionMarkerProps) {
  return (
    <p
      data-entra={estatico ? undefined : "marcador"}
      className={`eyebrow marcador ${estatico ? "is-in" : ""} ${className}`}
    >
      <span aria-hidden="true">(</span>
      <span className="marcador-nome">
        <span>{label}</span>
      </span>
      <span aria-hidden="true">)</span>
      {number && (
        <span className="marcador-num" data-num={number}>
          <span>{number}</span>
        </span>
      )}
    </p>
  );
}
