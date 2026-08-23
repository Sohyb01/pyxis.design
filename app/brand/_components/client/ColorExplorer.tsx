"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

import type { BrandColor } from "@/lib/brand/types";
import { cn } from "@/lib/utils";

import { writeTextToClipboard } from "./clipboard";

type ColorView = "mosaic" | "proportions";

export interface ColorExplorerProps {
  heading: string;
  description: string;
  colors: readonly BrandColor[];
  proportionsLabel?: string;
}

interface ConvertedColor {
  rgb: string;
  hsl: string;
  cmyk: string;
}

const POWER_FOUR_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const POWER_FOUR_IN: [number, number, number, number] = [0.64, 0, 0.78, 0];
const POWER_TWO_OUT: [number, number, number, number] = [0.33, 1, 0.68, 1];
const POWER_TWO_IN: [number, number, number, number] = [0.32, 0, 0.67, 0];
const PUNCH_MOVE: [number, number, number, number] = [0.7, 0, 0.16, 1];
const VIEW_TRANSITION_MS = 1700;

const paletteVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
    },
  },
  exit: (view: ColorView) => ({
    transition: {
      staggerChildren: view === "proportions" ? 0.025 : 0.02,
      staggerDirection: view === "proportions" ? -1 : 1,
    },
  }),
};

function hiddenClip(view: ColorView) {
  return view === "mosaic"
    ? "inset(100% 0% 0% 0%)"
    : "inset(0% 100% 0% 0%)";
}

const tileVariants: Variants = {
  hidden: (view: ColorView) => ({
    clipPath: hiddenClip(view),
  }),
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      clipPath: {
        duration: 0.9,
        ease: POWER_FOUR_OUT,
      },
    },
  },
  exit: (view: ColorView) => ({
    clipPath: hiddenClip(view),
    transition: {
      clipPath: {
        duration: 0.45,
        ease: POWER_FOUR_IN,
      },
    },
  }),
};

const labelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4,
      ease: POWER_TWO_OUT,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: POWER_TWO_IN,
    },
  },
};

function hexToRgb(hex: string) {
  const raw = hex.replace("#", "").trim();
  const normalized =
    raw.length === 3
      ? raw
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : raw;

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return { red: 0, green: 0, blue: 0 };
  }

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function convertColor(hex: string): ConvertedColor {
  const { red, green, blue } = hexToRgb(hex);
  const redUnit = red / 255;
  const greenUnit = green / 255;
  const blueUnit = blue / 255;
  const max = Math.max(redUnit, greenUnit, blueUnit);
  const min = Math.min(redUnit, greenUnit, blueUnit);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === redUnit) {
      hue = 60 * (((greenUnit - blueUnit) / delta) % 6);
    } else if (max === greenUnit) {
      hue = 60 * ((blueUnit - redUnit) / delta + 2);
    } else {
      hue = 60 * ((redUnit - greenUnit) / delta + 4);
    }
  }
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  const black = 1 - max;
  const cyan = black === 1 ? 0 : (1 - redUnit - black) / (1 - black);
  const magenta = black === 1 ? 0 : (1 - greenUnit - black) / (1 - black);
  const yellow = black === 1 ? 0 : (1 - blueUnit - black) / (1 - black);

  return {
    rgb: `${red}, ${green}, ${blue}`,
    hsl: `${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`,
    cmyk: `${Math.round(cyan * 100)}%, ${Math.round(magenta * 100)}%, ${Math.round(yellow * 100)}%, ${Math.round(black * 100)}%`,
  };
}

function ColorName({
  name,
  copied,
  reduceMotion,
}: {
  name: string;
  copied: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.span
      className="relative flex w-fit items-center text-p_ui_medium"
      variants={labelVariants}
    >
      <AnimatePresence initial={false}>
        {copied ? (
          <motion.span
            className="absolute end-full top-1/2 me-1 grid -translate-y-1/2 place-items-center [&_svg]:size-4"
            initial={reduceMotion ? false : { rotate: -35, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { rotate: 35, scale: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: POWER_FOUR_OUT }}
            aria-hidden="true"
          >
            <Check />
          </motion.span>
        ) : null}
      </AnimatePresence>

      <span className="block h-6 overflow-hidden">
        <span
          className={cn(
            "grid transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            copied && "-translate-y-6",
          )}
        >
          <span className="flex h-6 items-center">{name}</span>
          <span className="flex h-6 items-center">Copied</span>
        </span>
      </span>
    </motion.span>
  );
}

function DetailedColorValues({
  color,
  converted,
  compact = false,
}: {
  color: BrandColor;
  converted: ConvertedColor;
  compact?: boolean;
}) {
  return (
    <motion.span
      className="grid self-end text-right text-detail opacity-80"
      variants={labelVariants}
    >
      <span>{color.hex.toUpperCase()}</span>
      <span className={cn(compact && "min-[768px]:max-[1439px]:hidden")}>
        HSL: {converted.hsl}
      </span>
      <span className={cn(compact && "min-[768px]:max-[1439px]:hidden")}>
        RGB: {converted.rgb}
      </span>
      <span className={cn(compact && "min-[768px]:max-[1439px]:hidden")}>
        CMYK: {converted.cmyk}
      </span>
    </motion.span>
  );
}

function ProportionValues({
  color,
  converted,
}: {
  color: BrandColor;
  converted: ConvertedColor;
}) {
  return (
    <motion.span
      className="grid self-end text-right text-detail opacity-80"
      variants={labelVariants}
    >
      <span>{color.proportion}%</span>
      <span>{color.hex.toUpperCase()}</span>
      <span>HSL: {converted.hsl}</span>
      <span>RGB: {converted.rgb}</span>
      <span>CMYK: {converted.cmyk}</span>
    </motion.span>
  );
}

export function ColorExplorer({
  heading,
  description,
  colors,
  proportionsLabel = "Example UI distribution—not official",
}: ColorExplorerProps) {
  const [view, setView] = useState<ColorView>("mosaic");
  const [transitioning, setTransitioning] = useState(false);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const switcherId = useId().replace(/:/g, "");
  const panelId = `${switcherId}-color-panel`;
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;
  const paletteInView = useInView(paletteRef, {
    once: true,
    margin: "0px 0px -50% 0px",
  });
  const revealPalette = reduceMotion || paletteInView;
  const mosaicRows = colors.reduce(
    (rowCount, color) =>
      Math.max(rowCount, color.mosaic.rowStart + color.mosaic.rowSpan - 1),
    1,
  );
  const paletteStyle = {
    "--brand-color-panel-height": `clamp(${mosaicRows * 13}rem, ${mosaicRows * 28}vh, ${mosaicRows * 20}rem)`,
  } as CSSProperties;

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    },
    [],
  );

  const selectView = (nextView: ColorView) => {
    if (nextView === view || transitioning) return;

    setView(nextView);

    if (reduceMotion || !paletteInView) return;

    setTransitioning(true);
    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    viewTimerRef.current = setTimeout(() => {
      setTransitioning(false);
    }, VIEW_TRANSITION_MS);
  };

  const copyColor = async (color: BrandColor) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    try {
      await writeTextToClipboard(color.hex.toUpperCase());
      setCopiedName(color.name);
      setCopyError(false);
    } catch {
      setCopiedName(null);
      setCopyError(true);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopiedName(null);
      setCopyError(false);
    }, 1400);
  };

  return (
    <div>
      <header className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 pt-12 min-[1024px]:mb-20 min-[1024px]:pt-8">
        <div className="grid w-full max-w-[44ch] gap-6">
          <h2 id="colors-heading" className="text-5xl md:text-7xl">
            {heading}
          </h2>
          <p className="text-p_ui text-muted-foreground/70 text-pretty">
            {description}
          </p>
        </div>

        <LayoutGroup id={switcherId}>
          <div
            className="relative inline-flex shrink-0 items-center gap-0.5 rounded-full border border-(--brand-line) bg-(--brand-surface) p-[3px]"
            aria-label="Color view"
            role="group"
          >
            {(["mosaic", "proportions"] as const).map((option) => {
              const active = option === view;

              return (
                <button
                  type="button"
                  key={option}
                  className={cn(
                    "relative z-0 h-[29px] cursor-pointer rounded-full border-0 bg-transparent px-3 text-body transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent) motion-reduce:transition-none",
                    active
                      ? "[color:var(--brand-accent-foreground)]"
                      : "text-muted-foreground/70 hover:text-foreground",
                  )}
                  aria-pressed={active}
                  aria-controls={panelId}
                  aria-disabled={transitioning || undefined}
                  onClick={() => selectView(option)}
                >
                  {active ? (
                    <motion.span
                      className="absolute inset-0 -z-10 rounded-full bg-(--brand-accent)"
                      layoutId={`${switcherId}-color-view-selection`}
                      initial={false}
                      transition={{ duration: reduceMotion ? 0 : 0.42, ease: PUNCH_MOVE }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10">
                    {option === "mosaic" ? "Mosaic" : "Proportions"}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </header>

      <div
        ref={paletteRef}
        className="relative"
        style={paletteStyle}
        aria-busy={transitioning}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            id={panelId}
            className="relative"
            custom={view}
            initial={reduceMotion ? false : "hidden"}
            animate={revealPalette ? "visible" : "hidden"}
            exit={reduceMotion || !paletteInView ? undefined : "exit"}
          >
            {view === "proportions" ? (
              <motion.p
                className="absolute end-0 bottom-full mb-3 text-detail text-muted-foreground/70"
                variants={labelVariants}
              >
                {proportionsLabel}
              </motion.p>
            ) : null}

            <motion.div
              className={cn(
                view === "mosaic"
                  ? "grid grid-flow-dense auto-rows-[clamp(13rem,28vh,20rem)] grid-cols-6 gap-0 max-[767px]:flex max-[767px]:flex-col"
                  : "flex gap-0 border border-(--brand-line) min-[768px]:min-h-[var(--brand-color-panel-height)] max-[767px]:flex-col",
              )}
              custom={view}
              variants={paletteVariants}
              aria-label={
                view === "mosaic"
                  ? "Brand color mosaic"
                  : "Example brand color proportions"
              }
            >
              {colors.map((color, colorIndex) => {
                const copied = copiedName === color.name;
                const converted = convertColor(color.hex);
                const foreground =
                  color.foreground === "light" ? "#ffffff" : "#0a0a0a";

                if (view === "mosaic") {
                  return (
                    <motion.button
                      type="button"
                      key={color.name}
                      className={cn(
                        "relative flex min-w-0 cursor-pointer flex-col justify-between overflow-hidden border-0 py-5 text-left data-[bordered=true]:ring-1 data-[bordered=true]:ring-(--brand-line) data-[bordered=true]:ring-inset focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand-accent) max-[767px]:min-h-[clamp(9rem,22vh,13rem)] max-[767px]:px-6",
                        color.mosaic.columnSpan === 1 ? "px-2" : "px-6",
                      )}
                      custom="mosaic"
                      variants={tileVariants}
                      data-bordered={
                        color.hex.toUpperCase() === "#FFFFFF" ? "true" : undefined
                      }
                      style={{
                        backgroundColor: color.hex,
                        color: foreground,
                        gridColumn: `${color.mosaic.columnStart} / span ${color.mosaic.columnSpan}`,
                        gridRow: `${color.mosaic.rowStart} / span ${color.mosaic.rowSpan}`,
                      }}
                      aria-label={`Copy ${color.name} ${color.hex}`}
                      onClick={() => void copyColor(color)}
                    >
                      <ColorName
                        name={color.mosaicLabel ?? color.name}
                        copied={copied}
                        reduceMotion={reduceMotion}
                      />
                      <DetailedColorValues
                        color={color}
                        converted={converted}
                        compact={color.mosaic.columnSpan === 1}
                      />
                    </motion.button>
                  );
                }

                const isDominantProportion = colorIndex < 2;
                const proportionStyle = {
                  "--brand-color-proportion": `${color.proportion}%`,
                  backgroundColor: color.hex,
                  color: foreground,
                } as CSSProperties;

                return (
                  <motion.button
                    type="button"
                    key={color.name}
                    className={cn(
                      "group relative min-w-0 basis-[var(--brand-color-proportion)] shrink grow-0 cursor-pointer overflow-hidden border-0 p-0 text-left transition-[min-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand-accent) max-[767px]:min-h-44 max-[767px]:basis-auto motion-reduce:transition-none",
                      isDominantProportion
                        ? "min-[768px]:min-w-40"
                        : "min-[768px]:hover:min-w-52 min-[768px]:focus:min-w-52",
                    )}
                    custom="proportions"
                    variants={tileVariants}
                    style={proportionStyle}
                    aria-label={`Copy ${color.name} ${color.hex}, ${color.proportion} percent`}
                    onClick={() => void copyColor(color)}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 flex flex-col justify-between px-4 py-5 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                        !isDominantProportion &&
                          "min-[768px]:opacity-0 min-[768px]:group-hover:opacity-100 min-[768px]:group-focus:opacity-100",
                      )}
                    >
                      <ColorName
                        name={color.name}
                        copied={copied}
                        reduceMotion={reduceMotion}
                      />
                      <ProportionValues color={color} converted={converted} />
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copyError
          ? "Could not copy the color value"
          : copiedName
            ? `${copiedName} HEX copied`
            : ""}
      </span>
    </div>
  );
}
