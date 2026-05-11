import { BookOpen, Calculator, Briefcase, Shield, Award, Layers } from "lucide-react";
import type { CourseCategory } from "@/integrations/supabase/courses";

type Theme = {
  bg: string;
  accent: string;
  text: string;
  pattern: string;
};

const THEMES: Record<CourseCategory, Theme> = {
  foundations: {
    bg: "#0B1A3A",
    accent: "#C9922A",
    text: "#FFFFFF",
    pattern: "rgba(201,146,42,0.18)",
  },
  tax: { bg: "#C9922A", accent: "#0B1A3A", text: "#0B1A3A", pattern: "rgba(11,26,58,0.12)" },
  operations: {
    bg: "#2D6A4F",
    accent: "#F5E6C8",
    text: "#FFFFFF",
    pattern: "rgba(245,230,200,0.20)",
  },
  protection: {
    bg: "#7C2D12",
    accent: "#F5E6C8",
    text: "#FFFFFF",
    pattern: "rgba(245,230,200,0.18)",
  },
  exit: { bg: "#4C1D95", accent: "#C9922A", text: "#FFFFFF", pattern: "rgba(201,146,42,0.20)" },
  bundle: { bg: "#0F172A", accent: "#C9922A", text: "#FFFFFF", pattern: "rgba(201,146,42,0.22)" },
};

const ICONS: Record<CourseCategory, typeof BookOpen> = {
  foundations: BookOpen,
  tax: Calculator,
  operations: Briefcase,
  protection: Shield,
  exit: Award,
  bundle: Layers,
};

export type CourseThumbnailProps = {
  category: CourseCategory;
  title: string;
  level?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function CourseThumbnail({
  category,
  title,
  level,
  size = "md",
  className = "",
}: CourseThumbnailProps) {
  const theme = THEMES[category];
  const Icon = ICONS[category];

  const titleSize = size === "lg" ? "text-[22px]" : size === "sm" ? "text-[13px]" : "text-[17px]";
  const iconSize = size === "lg" ? 36 : size === "sm" ? 20 : 28;
  const padding = size === "lg" ? "p-8" : size === "sm" ? "p-4" : "p-6";

  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-xl ${padding} flex flex-col justify-between ${className}`}
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* Decorative radial pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 125"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id={`g-${category}`} cx="80%" cy="20%" r="60%">
            <stop offset="0%" stopColor={theme.pattern} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="200" height="125" fill={`url(#g-${category})`} />
        {/* Subtle grid pattern */}
        <g opacity="0.06" stroke={theme.accent} strokeWidth="0.3">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" x2="200" y1={i * 12} y2={i * 12} />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 12} x2={i * 12} y1="0" y2="125" />
          ))}
        </g>
      </svg>

      <div className="relative flex items-start justify-between">
        <div
          className="rounded-lg p-2"
          style={{ background: `${theme.accent}1A`, border: `1px solid ${theme.accent}50` }}
        >
          <Icon size={iconSize} style={{ color: theme.accent }} strokeWidth={1.5} />
        </div>
        {level && (
          <span
            className="text-[10px] font-semibold tracking-[0.12em] uppercase px-2 py-1 rounded"
            style={{
              background: `${theme.accent}1A`,
              color: theme.accent,
              border: `1px solid ${theme.accent}40`,
            }}
          >
            {level}
          </span>
        )}
      </div>

      <div className="relative">
        <p
          className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-2 opacity-70"
          style={{ color: theme.accent }}
        >
          {CATEGORY_DISPLAY[category]}
        </p>
        <h3 className={`${titleSize} font-bold leading-tight`} style={{ color: theme.text }}>
          {title}
        </h3>
      </div>
    </div>
  );
}

const CATEGORY_DISPLAY: Record<CourseCategory, string> = {
  foundations: "Foundations",
  tax: "Tax Strategy",
  operations: "Operations",
  protection: "Asset Protection",
  exit: "Exit Planning",
  bundle: "Complete Bundle",
};
