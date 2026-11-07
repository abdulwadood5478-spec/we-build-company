interface WebuildLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export function WebuildLogo({
  size = 'md',
  className = '',
  showSubtitle = true,
  subtitleText = 'GROUP AUSTRALIA',
}: WebuildLogoProps) {
  const dimensions = {
    sm: { height: 28, iconSize: 24, fontSize: '15px', subFontSize: '8px' },
    md: { height: 38, iconSize: 32, fontSize: '20px', subFontSize: '9px' },
    lg: { height: 48, iconSize: 40, fontSize: '25px', subFontSize: '10px' },
    xl: { height: 60, iconSize: 52, fontSize: '32px', subFontSize: '12px' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Webuild Signature Dynamic Engineering Mark */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="wb-red-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff382e" />
              <stop offset="100%" stopColor="#c5160e" />
            </linearGradient>
            <linearGradient id="wb-red-depth" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#960e08" />
              <stop offset="100%" stopColor="#e2231a" />
            </linearGradient>
          </defs>

          {/* Dynamic Helical Ribbon (Webuild infrastructure helix) */}
          {/* Back Loop */}
          <path
            d="M20 70C15 62 14 42 24 28C34 14 55 12 70 20C82 26 88 40 85 54C82 66 70 78 54 82C40 85 28 80 20 70Z"
            stroke="url(#wb-red-depth)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Main Kinetic Ribbon */}
          <path
            d="M16 55C14 40 22 25 36 18C52 10 72 14 82 28C92 42 90 62 76 74C64 84 46 86 32 80L84 26"
            stroke="url(#wb-red-main)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Central Forward Momentum Fin */}
          <path
            d="M38 76L68 46"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            style={{
              fontSize: dimensions.fontSize,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            we<span style={{ color: '#e2231a' }}>build</span>
          </span>
        </div>
        {showSubtitle && (
          <span
            className="tracking-[0.25em] font-semibold text-slate-400 uppercase mt-1"
            style={{
              fontSize: dimensions.subFontSize,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
}
