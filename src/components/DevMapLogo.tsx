interface DevMapLogoProps {
  className?: string;
  size?: number;
}

export default function DevMapLogo({ className = "", size = 40 }: DevMapLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Map pin background circle */}
      <circle cx="50" cy="35" r="28" fill="url(#gradient1)" />

      {/* Map pin pointer */}
      <path
        d="M50 63C50 63 22 42 22 35C22 19.536 34.536 7 50 7C65.464 7 78 19.536 78 35C78 42 50 63 50 63Z"
        fill="url(#gradient2)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Code brackets inside pin */}
      <path
        d="M40 30L35 35L40 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 30L65 35L60 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M53 28L47 42"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Map route line */}
      <path
        d="M50 63Q30 70 20 85Q15 90 20 95"
        stroke="url(#gradient3)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 63Q70 70 80 85Q85 90 80 95"
        stroke="url(#gradient3)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Route dots */}
      <circle cx="20" cy="95" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="75" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="80" cy="95" r="4" fill="currentColor" opacity="0.8" />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="22" y1="7" x2="78" y2="63">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="gradient2" x1="22" y1="7" x2="78" y2="63">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="gradient3" x1="20" y1="63" x2="80" y2="95">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
