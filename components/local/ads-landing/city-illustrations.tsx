/**
 * Faint hero backdrops for city-specific ad landings. Each illustration is a
 * stylised silhouette in `currentColor`, designed to render at a wrapper
 * opacity of ~6-8% so it reads as place identity without competing with the
 * headline/CTA.
 */

interface SkylineProps {
  className?: string;
}

export function SFSkyline({ className }: SkylineProps) {
  return (
    <svg
      viewBox="0 0 1200 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYEnd meet"
      className={className}
      aria-hidden
    >
      {/* Far hills */}
      <path
        d="M 0 250 Q 90 225 180 235 Q 270 245 380 220 Q 490 195 620 215 Q 750 235 880 215 Q 1010 195 1110 215 Q 1170 225 1200 230"
        strokeWidth="1.5"
        opacity="0.55"
      />

      {/* Water / horizon */}
      <line
        x1="0"
        y1="265"
        x2="1200"
        y2="265"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Bridge deck */}
      <line x1="40" y1="190" x2="1160" y2="190" />

      {/* Left tower */}
      <line x1="282" y1="60" x2="282" y2="250" />
      <line x1="322" y1="60" x2="322" y2="250" />
      <line x1="282" y1="60" x2="322" y2="60" />
      <line x1="282" y1="100" x2="322" y2="100" />
      <line x1="282" y1="140" x2="322" y2="140" />

      {/* Right tower */}
      <line x1="878" y1="60" x2="878" y2="250" />
      <line x1="918" y1="60" x2="918" y2="250" />
      <line x1="878" y1="60" x2="918" y2="60" />
      <line x1="878" y1="100" x2="918" y2="100" />
      <line x1="878" y1="140" x2="918" y2="140" />

      {/* Main suspension cable */}
      <path d="M 40 190 Q 160 60, 302 60 Q 600 200, 898 60 Q 1040 60, 1160 190" />

      {/* Suspender cables */}
      <line x1="120" y1="120" x2="120" y2="190" opacity="0.5" />
      <line x1="200" y1="80" x2="200" y2="190" opacity="0.5" />
      <line x1="400" y1="100" x2="400" y2="190" opacity="0.5" />
      <line x1="500" y1="140" x2="500" y2="190" opacity="0.5" />
      <line x1="600" y1="170" x2="600" y2="190" opacity="0.5" />
      <line x1="700" y1="140" x2="700" y2="190" opacity="0.5" />
      <line x1="800" y1="100" x2="800" y2="190" opacity="0.5" />
      <line x1="1000" y1="80" x2="1000" y2="190" opacity="0.5" />
      <line x1="1080" y1="120" x2="1080" y2="190" opacity="0.5" />
    </svg>
  );
}

export function NYCSkyline({ className }: SkylineProps) {
  return (
    <svg
      viewBox="0 0 1200 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYEnd meet"
      className={className}
      aria-hidden
    >
      {/* Ground / horizon */}
      <line
        x1="0"
        y1="265"
        x2="1200"
        y2="265"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Far-left rises */}
      <rect x="20" y="200" width="50" height="65" />
      <rect x="80" y="180" width="40" height="85" />
      <rect x="130" y="210" width="50" height="55" />
      <rect x="190" y="170" width="40" height="95" />
      <rect x="240" y="195" width="50" height="70" />

      {/* Empire State Building — stepped Art Deco */}
      <rect x="310" y="135" width="60" height="130" />
      <rect x="322" y="105" width="36" height="30" />
      <rect x="332" y="80" width="16" height="25" />
      <line x1="340" y1="80" x2="340" y2="40" />

      {/* Mid buildings */}
      <rect x="395" y="190" width="50" height="75" />
      <rect x="455" y="170" width="50" height="95" />
      <rect x="515" y="200" width="40" height="65" />

      {/* Chrysler Building — spire & crown */}
      <rect x="570" y="150" width="50" height="115" />
      <path d="M 570 150 L 595 115 L 620 150" />
      <path d="M 580 130 L 595 105 L 610 130" />
      <line x1="595" y1="105" x2="595" y2="55" />

      {/* More mid */}
      <rect x="640" y="195" width="50" height="70" />
      <rect x="700" y="175" width="50" height="90" />
      <rect x="760" y="200" width="40" height="65" />
      <rect x="810" y="180" width="50" height="85" />

      {/* One World Trade Center — tapered, antenna */}
      <path d="M 880 145 L 880 265 L 935 265 L 935 145 Z" />
      <path d="M 880 145 L 907 110 L 935 145" />
      <line x1="907" y1="110" x2="907" y2="50" />

      {/* Right buildings */}
      <rect x="960" y="200" width="50" height="65" />
      <rect x="1020" y="175" width="50" height="90" />
      <rect x="1080" y="195" width="40" height="70" />
      <rect x="1130" y="210" width="50" height="55" />
    </svg>
  );
}
