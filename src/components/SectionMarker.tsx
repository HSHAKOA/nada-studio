type SectionMarkerProps = {
  label: string;
  number: string;
};

export default function SectionMarker({ label, number }: SectionMarkerProps) {
  return (
    <div className="eyebrow mb-6">
      <span>
        ( {label} ) {number}
      </span>
    </div>
  );
}
