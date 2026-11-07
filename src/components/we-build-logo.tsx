interface WeBuildLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: number;
  className?: string;
  showSubtitle?: boolean;
}

export function WeBuildLogo({
  size = 'md',
  height,
  className = '',
  showSubtitle = false,
}: WeBuildLogoProps) {
  const defaultHeights = {
    sm: 34,
    md: 48,
    lg: 64,
    xl: 82,
  };

  const finalHeight = height ?? defaultHeights[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Webuild Logo Image from Attached Asset - Scaled bigger & ultra clear */}
      <img
        src="/assets/aistudio/image_ac625b2a.png"
        alt="Webuild"
        style={{
          height: `${finalHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          imageRendering: '-webkit-optimize-contrast',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
      {showSubtitle && (
        <span
          className="text-slate-600 font-extrabold uppercase tracking-widest pl-2.5 border-l-2 border-slate-300 font-mono text-[11px]"
        >
          AUSTRALIA
        </span>
      )}
    </div>
  );
}
