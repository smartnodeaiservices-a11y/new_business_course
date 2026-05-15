import { createElement, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/animations";

type RevealTag = "div" | "section" | "article" | "li" | "header" | "footer";
type RevealKind = "fadeUp" | "scaleIn";

const variantMap: Record<RevealKind, Variants> = {
  fadeUp,
  scaleIn,
};

type RevealProps = {
  as?: RevealTag;
  kind?: RevealKind;
  /** Override default 0s delay — useful when chaining outside a stagger. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Single-element entrance. Use on a heading, card, or paragraph that should
 * lift in once when it enters the viewport. Honors prefers-reduced-motion.
 */
export function Reveal({
  as = "div",
  kind = "fadeUp",
  delay,
  className,
  children,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, children);
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={variantMap[kind]}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={delay !== undefined ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

type StaggerTag = "div" | "section" | "ul" | "ol";

type RevealStaggerProps = {
  as?: StaggerTag;
  className?: string;
  children: ReactNode;
};

/**
 * Wrap a grid/list. Direct children should be `<RevealItem>` or any element
 * that opts into the `variants` system. Plays a soft cascade.
 */
export function RevealStagger({
  as = "div",
  className,
  children,
}: RevealStaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, children);
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}

type ItemTag = "div" | "li" | "article" | "section";

type RevealItemProps = {
  as?: ItemTag;
  className?: string;
  children: ReactNode;
};

/**
 * Child of <RevealStagger>. Inherits the parent's variants and animates
 * with the staggered delay automatically.
 */
export function RevealItem({
  as = "div",
  className,
  children,
}: RevealItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, children);
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} variants={staggerItem}>
      {children}
    </MotionTag>
  );
}
