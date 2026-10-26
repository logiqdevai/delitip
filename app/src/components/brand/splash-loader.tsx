"use client";

import { type FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrandMark } from "@/components/brand/brand-mark";

const TILE_COLUMNS = 14;
const TILE_ROWS = 28;
const QR_SIZE = 17;
const FINDER_SIZE = 5;
const LOGO_CLEARANCE = 5;
const HOLD_MS = 1400;
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

const isLogoZone = (row: number, col: number): boolean => {
  const start = Math.floor((QR_SIZE - LOGO_CLEARANCE) / 2);
  return (
    row >= start &&
    row < start + LOGO_CLEARANCE &&
    col >= start &&
    col < start + LOGO_CLEARANCE
  );
};

const QR_MODULES = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const row = Math.floor(i / QR_SIZE);
  const col = i % QR_SIZE;
  if (isFinderZone(row, col)) return isFinderModule(row, col);
  if (isLogoZone(row, col)) return false;
  return hash(i + 1) > 0.5;
});

export const SplashLoader: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(false), HOLD_MS);
    return () => window.clearTimeout(timeout);
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
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="relative">
              <svg
                viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
                className="size-56 text-ink-charcoal"
                shapeRendering="crispEdges"
                aria-hidden
              >
                {QR_MODULES.map((isDark, i) =>
                  isDark ? (
                    <rect
                      key={i}
                      x={i % QR_SIZE}
                      y={Math.floor(i / QR_SIZE)}
                      width={1}
                      height={1}
                      fill="currentColor"
                    />
                  ) : null
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrandMark size="lg" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
