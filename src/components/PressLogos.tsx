// Press-bar logos — image URLs pulled from atomicfunnels.com's "whiteslider"
// section. Two source pools (row A: iili.io, row B: clickfunnels CDN) feed
// the two-direction marquee in AsSeenOnSection.
//
// Each LP seeds shuffleSeeded() with a different number so the order varies
// per variant while staying stable across re-renders.

export type PressLogo = { name: string; src: string };

// Row A — sourced from atomicfunnels.com slide-track (left-scrolling).
export const PRESS_LOGOS_ROW_A: PressLogo[] = [
  { name: "logo-a-1", src: "https://iili.io/HFXqWdB.png" },
  { name: "logo-a-2", src: "https://iili.io/HFXqMgV.png" },
  { name: "logo-a-3", src: "https://iili.io/HFXqG0Q.png" },
  { name: "logo-a-4", src: "https://iili.io/HFXqEqx.png" },
  { name: "logo-a-5", src: "https://iili.io/HFmFR1I.png" },
  { name: "logo-a-6", src: "https://iili.io/HFXqNzg.png" },
  { name: "logo-a-7", src: "https://iili.io/HFXqOXa.png" },
  { name: "logo-a-8", src: "https://iili.io/HFXqeLJ.png" },
];

// Row B — sourced from atomicfunnels.com slide-track-right (right-scrolling).
export const PRESS_LOGOS_ROW_B: PressLogo[] = [
  {
    name: "logo-b-1",
    src: "https://images.clickfunnels.com/14/0f901339ab4c4584237210de8d1860/HFGgZUg.png",
  },
  {
    name: "logo-b-2",
    src: "https://images.clickfunnels.com/2f/558cff087745baa20b53ab85fd74d6/HF16rRj.png",
  },
  {
    name: "logo-b-3",
    src: "https://images.clickfunnels.com/1a/2de7e301674733b12a1e56e081cedc/HF16ei7.png",
  },
  {
    name: "logo-b-4",
    src: "https://images.clickfunnels.com/44/f03fe71db943df822aac9dd75e6cb7/HFGgLf1-1-.png",
  },
  {
    name: "logo-b-5",
    src: "https://images.clickfunnels.com/8c/9d168ee163493d97c825c8e5ff4995/HFGgQ0F-1-.png",
  },
  {
    name: "logo-b-6",
    src: "https://images.clickfunnels.com/63/962121d9e248ffba4f269138fc016a/HF164Ox.png",
  },
  {
    name: "logo-b-7",
    src: "https://images.clickfunnels.com/22/a2600bc3db4fabbce9225051a5dbdb/HFGgDJa.png",
  },
  {
    name: "logo-b-8",
    src: "https://images.clickfunnels.com/69/e7d5e2411b4effb3e8a1906dc60e81/HF166DQ.png",
  },
  {
    name: "logo-b-9",
    src: "https://images.clickfunnels.com/4e/3ccd36ac6a46a2b5b2a84a457f9024/HF16SUu.png",
  },
  {
    name: "logo-b-10",
    src: "https://images.clickfunnels.com/0c/eaa6497cd54e7091472720e0bbd1a3/HFGgiiP.png",
  },
];

// All logos combined (used when a single shuffled bar is preferred).
export const PRESS_LOGOS_ALL: PressLogo[] = [
  ...PRESS_LOGOS_ROW_A,
  ...PRESS_LOGOS_ROW_B,
];

// Deterministic seeded shuffle so each LP variant gets a stable, "random-feeling"
// order without re-shuffling on every render.
export function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const out = arr.slice();
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const j = Math.floor(r * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
