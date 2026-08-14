const PHRASE = "do nada nasce tudo";

export default function Marquee() {
  const items = Array.from({ length: 8 }, () => PHRASE);

  return (
    <div className="marquee-viewport overflow-hidden border-y border-white/10 py-6">
      <div className="marquee-track">
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className="mx-6 whitespace-nowrap text-[clamp(20px,4vw,36px)] font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {text}
            <span
              aria-hidden="true"
              className="mx-6 inline-block align-middle text-black/30"
            >
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
