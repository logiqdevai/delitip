"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const TILE_COLUMNS = 14;
const TILE_ROWS = 28;
const QR_SIZE = 17;
const FINDER_SIZE = 5;
const MIN_HOLD_MS = 1200;
const MAX_HOLD_MS = 8000;
const BUILD_DURATION_S = 1.5;
const BUILD_JITTER_S = 0.12;
const CYCLE_MS = 2400;
const MODULE_POP_S = 0.18;
const DISSOLVE_SPREAD_S = 0.6;
const TILE_DURATION_S = 0.25;

const hash = (n: number): number => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const isFinderModule = (row: number, col: number): boolean => {
  const edge = QR_SIZE - FINDER_SIZE;
  const inCorner =
    (row < FINDER_SIZE && col < FINDER_SIZE) ||
    (row < FINDER_SIZE && col >= edge) ||
    (row >= edge && col < FINDER_SIZE);
  if (!inCorner) return false;
  const r = row % edge;
  const c = col % edge;
  const onRing =
    r === 0 || c === 0 || r === FINDER_SIZE - 1 || c === FINDER_SIZE - 1;
  const inCenter = r === 2 && c === 2;
  return onRing || inCenter;
};

const isFinderZone = (row: number, col: number): boolean => {
  const edge = QR_SIZE - FINDER_SIZE;
  return (
    (row < FINDER_SIZE && col < FINDER_SIZE) ||
    (row < FINDER_SIZE && col >= edge) ||
    (row >= edge && col < FINDER_SIZE)
  );
};

const buildQrModules = (cycle: number) =>
  Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
    const row = Math.floor(i / QR_SIZE);
    const col = i % QR_SIZE;
    const isDark = isFinderZone(row, col)
      ? isFinderModule(row, col)
      : hash(i + 1 + cycle * 97) > 0.5;
    if (!isDark) return null;
    const delay =
      (i / (QR_SIZE * QR_SIZE)) * BUILD_DURATION_S +
      hash(i + 500 + cycle) * BUILD_JITTER_S;
    return { row, col, delay };
  }).filter((module) => module !== null);

export const SplashLoader: FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [cycle, setCycle] = useState(0);
  const qrModules = useMemo(() => buildQrModules(cycle), [cycle]);

  useEffect(() => {
    const interval = window.setInterval(
      () => setCycle((current) => current + 1),
      CYCLE_MS
    );
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const close = () => setIsVisible(false);
    const startedAt = performance.now();
    const closeWhenLoaded = () => {
      const remaining = Math.max(0, MIN_HOLD_MS - (performance.now() - startedAt));
      window.setTimeout(close, remaining);
    };

    const failsafe = window.setTimeout(close, MAX_HOLD_MS);
    if (document.readyState === "complete") {
      closeWhenLoaded();
    } else {
      window.addEventListener("load", closeWhenLoaded, { once: true });
    }

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("load", closeWhenLoaded);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] overflow-hidden"
          role="status"
          aria-label="Loading"
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${TILE_COLUMNS}, 1fr)`,
              gridAutoRows: `calc(100vw / ${TILE_COLUMNS})`,
            }}
          >
            {Array.from({ length: TILE_COLUMNS * TILE_ROWS }).map((_, index) => (
              <motion.div
                key={index}
                className="bg-electric-lime"
                exit={{
                  scale: 0,
                  transition: {
                    duration: TILE_DURATION_S,
                    ease: "easeIn",
                    delay: hash(index + 101) * DISSOLVE_SPREAD_S,
                  },
                }}
              />
            ))}
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="text-5xl font-extrabold tracking-tight text-black">
              delitip
            </span>
            <svg
              viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
              className="size-16 text-ink-charcoal"
              shapeRendering="crispEdges"
              aria-hidden
            >
              {qrModules.map(({ row, col, delay }) => (
                <motion.rect
                  key={`${cycle}-${row}-${col}`}
                  x={col}
                  y={row}
                  width={1}
                  height={1}
                  fill="currentColor"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay,
                    duration: MODULE_POP_S,
                    ease: "easeOut",
                  }}
                />
              ))}
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
