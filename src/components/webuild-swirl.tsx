interface WebuildSwirlProps {
  size?: number;
  className?: string;
}

export function WebuildSwirl({ size = 44, className = '' }: WebuildSwirlProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="Webuild swirl emblem"
    >
      <defs>
        <linearGradient id="wb-red-swirl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef3327" />
          <stop offset="100%" stopColor="#cc1309" />
        </linearGradient>
      </defs>

      {/* Ribbon 1 - Top left accent */}
      <path
        d="M26 36C28 28 36 20 46 17C43 23 41 29 42 35C37 34 31 35 26 36Z"
        fill="url(#wb-red-swirl)"
      />

      {/* Ribbon 2 - Upper primary sweep */}
      <path
        d="M32 44C34 32 44 22 58 19C52 27 49 37 51 46C44 44 38 43 32 44Z"
        fill="url(#wb-red-swirl)"
      />

      {/* Ribbon 3 - Center main vortex */}
      <path
        d="M36 57C39 42 50 30 68 25C61 36 57 48 61 60C52 57 43 56 36 57Z"
        fill="url(#wb-red-swirl)"
      />

      {/* Ribbon 4 - Lower primary sweep */}
      <path
        d="M44 71C48 56 59 44 79 36C71 50 67 64 72 77C62 73 52 71 44 71Z"
        fill="url(#wb-red-swirl)"
      />

      {/* Ribbon 5 - Bottom right fin */}
      <path
        d="M56 83C60 70 70 59 89 51C81 65 78 79 84 90C74 86 64 84 56 83Z"
        fill="url(#wb-red-swirl)"
      />

      {/* Ribbon 6 - Tail flick */}
      <path
        d="M71 90C74 81 82 73 95 68C89 79 87 88 92 95C85 93 78 91 71 90Z"
        fill="url(#wb-red-swirl)"
      />
    </svg>
  );
}
