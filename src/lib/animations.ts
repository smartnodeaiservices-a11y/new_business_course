// ============================================================================
// SHARED MOTION VARIANTS
// ============================================================================
// One source of truth for entrance animations across the marketing surface.
// Designed to be:
//   - smooth      → soft out-expo curve, sub-second duration
//   - lightweight → only opacity + transform (GPU-accelerated, no layout)
//   - smart       → enters once on first scroll-in (viewport.once: true)
// ============================================================================

import type { Variants, Transition } from "motion/react";

// Out-expo curve. Same feel as Apple's product page entrances — fast start,
// gentle settle. Keep it shared so every section breathes the same way.
const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const baseTransition: Transition = {
  duration: 0.65,
  ease: EASE,
};

// ---------- Section-level entrance ----------
// Use on a single block (heading + body, or a card). Soft but visible lift —
// 28px is enough to read as motion without feeling jumpy.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

// Plain fade — for backgrounds, dividers, and anything where movement would
// feel jumpy (large hero images, marquees).
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

// Subtle scale-in for cards / video frames. Avoid on text.
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

// ---------- Stagger container + item ----------
// Wrap a grid/list with `staggerContainer` and the children with `staggerItem`
// to get a visible cascade. delayChildren keeps the first item in lockstep
// with the parent so the section feels intentional, not laggy.
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

// ---------- Default viewport options ----------
// `once: true` so animations don't replay when the user scrolls past and
// returns. `amount: 0.15` = trigger as soon as 15% of the element is visible —
// reliably fires for short and tall sections alike.
export const viewportOnce = { once: true, amount: 0.15 } as const;
