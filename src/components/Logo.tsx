import { Link } from "@tanstack/react-router";

export function Logo({ dark = false }: { dark?: boolean }) {
  const navy = "#1B2F5E";
  const gold = "#C9922A";
  const wordColor = dark ? "#FFFFFF" : navy;
  const subColor = dark ? "rgba(255,255,255,0.7)" : navy;
  const shieldFill = dark ? "#FFFFFF" : navy;
  const shieldStroke = dark ? "#FFFFFF" : navy;

  return (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 2 L36 8 V20 C36 29 28.5 35.5 20 38 C11.5 35.5 4 29 4 20 V8 Z"
          fill="none"
          stroke={shieldStroke}
          strokeWidth="2"
        />
        {/* bar chart */}
        <rect x="11" y="22" width="3.5" height="8" fill={shieldFill} />
        <rect x="16.5" y="18" width="3.5" height="12" fill={shieldFill} />
        <rect x="22" y="14" width="3.5" height="16" fill={shieldFill} />
        {/* gold arrow */}
        <path d="M10 26 L18 18 L24 22 L30 14" stroke={gold} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 14 L30 19 M30 14 L25 14" stroke={gold} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-semibold tracking-[0.08em] uppercase" style={{ color: wordColor }}>
          New Business Course
        </span>
        <span
          className="text-[8px] tracking-[0.22em] uppercase mt-1 pt-[2px] pb-[1px]"
          style={{
            color: gold,
            borderTop: `1px solid ${gold}`,
            borderBottom: `1px solid ${gold}`,
            opacity: dark ? 0.95 : 1,
          }}
        >
          Florida · CPA-Backed
        </span>
        <span className="sr-only" style={{ color: subColor }}>brand</span>
      </div>
    </Link>
  );
}
