"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Lifecycle of a bounded intro animation. */
export type IntroPhase = "running" | "leaving" | "done";

export type UseIntroProgressOptions = {
  /**
   * `false` skips the intro entirely: nothing animates and `phase` stays
   * "done". Used for a mount that happens after the intro already played.
   */
  enabled: boolean;
  /** Time to travel 0 → 100, in ms. */
  durationMs?: number;
  /** Fade-out window; the overlay should stay mounted for this long. */
  fadeMs?: number;
  /** How long the finished bar is held when motion is reduced. */
  reducedMotionHoldMs?: number;
};

export type UseIntroProgressResult = {
  /** Integer 0–100. Reaches exactly 100 before `phase` becomes "leaving". */
  progress: number;
  phase: IntroPhase;
};

const DEFAULT_DURATION_MS = 1500;
const DEFAULT_FADE_MS = 400;
const DEFAULT_REDUCED_MOTION_HOLD_MS = 400;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * The media query as an external store, so the answer arrives *after* mount:
 * `false` for the server render and the hydration render (which must agree with
 * the server), then the real preference in a follow-up render.
 */
function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

const readReducedMotion = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
const readReducedMotionOnServer = () => false;

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    readReducedMotion,
    readReducedMotionOnServer,
  );
}

/**
 * easeOutCubic — quick off the mark, gentle at the end, and exactly `1` at `1`,
 * so the bar always lands on 100% instead of approaching it asymptotically.
 */
function easeOutCubic(ratio: number): number {
  return 1 - (1 - ratio) ** 3;
}

/**
 * Drives a bounded 0 → 100 progress value for a short intro and reports when
 * the overlay should fade out.
 *
 * The value is purely time-based: no network, no resource counting, no
 * randomness — so the intro always takes `durationMs` however slow the page's
 * data or images are, and the percentage can never disagree with the bar. A
 * timer (not the animation) retires the overlay, so a backgrounded tab, where
 * `requestAnimationFrame` is suspended, can never leave it stuck on screen.
 * Every timer, frame and listener is released on unmount.
 */
export function useIntroProgress({
  enabled,
  durationMs = DEFAULT_DURATION_MS,
  fadeMs = DEFAULT_FADE_MS,
  reducedMotionHoldMs = DEFAULT_REDUCED_MOTION_HOLD_MS,
}: UseIntroProgressOptions): UseIntroProgressResult {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dismissed, setDismissed] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;

    // Reduced motion: the render value is already 100%, so there is nothing to
    // animate — hold the finished state briefly and leave.
    if (prefersReducedMotion) {
      const hold = window.setTimeout(
        () => setFinished(true),
        reducedMotionHoldMs,
      );
      return () => window.clearTimeout(hold);
    }

    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const ratio = Math.min(1, (now - startedAt) / durationMs);
      setProgress(Math.round(easeOutCubic(ratio) * 100));

      if (ratio < 1) {
        frame = window.requestAnimationFrame(step);
      } else {
        setFinished(true);
      }
    };

    frame = window.requestAnimationFrame(step);

    // Belt and braces: if the animation never reports back (a suspended or
    // throttled tab), the overlay still completes and retires.
    const failsafe = window.setTimeout(() => {
      window.cancelAnimationFrame(frame);
      setProgress(100);
      setFinished(true);
    }, durationMs + fadeMs);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
    };
  }, [
    enabled,
    prefersReducedMotion,
    durationMs,
    fadeMs,
    reducedMotionHoldMs,
  ]);

  // Unmount once the fade has had time to finish. Reduced motion has no fade to
  // wait for, so it retires immediately.
  useEffect(() => {
    if (!finished) return;

    const done = window.setTimeout(
      () => setDismissed(true),
      prefersReducedMotion ? 0 : fadeMs,
    );
    return () => window.clearTimeout(done);
  }, [finished, fadeMs, prefersReducedMotion]);

  const phase: IntroPhase = dismissed
    ? "done"
    : finished
      ? "leaving"
      : "running";

  return { progress: prefersReducedMotion ? 100 : progress, phase };
}
