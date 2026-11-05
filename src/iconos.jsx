const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function Robot({ tamano = 32, ...resto }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 32 32" {...trazo} {...resto}>
      <line x1="16" y1="3" x2="16" y2="8" />
      <circle cx="16" cy="3" r="1.5" />
      <rect x="5" y="8" width="22" height="18" rx="6" />
      <circle cx="12" cy="17" r="2" />
      <circle cx="20" cy="17" r="2" />
    </svg>
  );
}
