"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useTransformScroll
 *
 * Maps scroll progress within a pinned section to a normalised `t` value (0 → 1).
 * - Works in BOTH scroll directions (scrub is reversible)
 * - Uses GSAP ScrollTrigger with `scrub: 1` for smooth, lag-free tracking
 * - Cleans up all GSAP instances on unmount
 *
 * Usage:
 *   const { t, triggerRef } = useTransformScroll();
 *   <div ref={triggerRef} style={{ height: "300vh" }}>
 *     ...canvas (position: sticky inside)
 *   </div>
 */
export function useTransformScroll(scrollDistance = "250vh") {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const gsapCtxRef = useRef<ReturnType<typeof import("gsap").gsap.context> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!triggerRef.current || !isMounted) return;

      const ctx = gsap.context(() => {
        // Proxy object so GSAP can tween a plain value
        const proxy = { value: 0 };

        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: "top top",
          end: scrollDistance + " top",
          scrub: 1,
          pin: false, // We handle pinning via CSS `position: sticky`
          onUpdate(self) {
            if (isMounted) {
              setT(self.progress);
            }
          },
        });

        // Keep proxy alive to satisfy linter
        void proxy;
      });

      gsapCtxRef.current = ctx;
    };

    init();

    return () => {
      isMounted = false;
      gsapCtxRef.current?.revert();
    };
  }, [scrollDistance]);

  return { t, triggerRef };
}

/**
 * Lerp helper — used by the scene to interpolate part positions/rotations.
 */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Smooth step — gives an ease-in-out feel to each part's animation window.
 */
export function smoothStep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Compute per-part t value from global t, with offset and width defining
 * when this part begins and finishes its motion.
 *
 * offset: 0-1 — how far into the global animation this part starts
 * width:  0-1 — what fraction of the total animation this part spans
 */
export function partT(globalT: number, offset: number, width: number) {
  return smoothStep(Math.max(0, Math.min(1, (globalT - offset) / width)));
}
