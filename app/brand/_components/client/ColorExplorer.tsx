"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

import type { BrandColor } from "@/lib/brand/types";
import { getBrandColorFormats } from "@/lib/brand/values";
import { cn } from "@/lib/utils";

import { BrandSegmentedControl } from "./BrandSegmentedControl";
import { writeTextToClipboard } from "./clipboard";

type ColorView = "mosaic" | "proportions";
type ColorFormat = "hex" | "hsl" | "rgb" | "cmyk";

interface ColorCopyState {
  name: string;
  format: ColorFormat;
}

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
const VIEW_TRANSITION_MS = 1700;
const COLOR_VIEW_OPTIONS = [
  { value: "mosaic", label: "Mosaic" },
  { value: "proportions", label: "Proportions" },
] as const;

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
  return view === "mosaic" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
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

function convertColor(hex: string): ConvertedColor {
  const formats = getBrandColorFormats(hex);

  return {
    rgb: formats.rgb.slice(4, -1),
    hsl: formats.hsl.slice(4, -1),
    cmyk: formats.cmyk.slice(5, -1),
  };
}

function colorCopyValue(
  color: BrandColor,
  converted: ConvertedColor,
  format: ColorFormat,
) {
  if (format === "hex") return color.hex.toUpperCase();
  if (format === "hsl") return `hsl(${converted.hsl})`;
  if (format === "rgb") return `rgb(${converted.rgb})`;
  return `cmyk(${converted.cmyk})`;
}

function colorCopyMessage(format: ColorFormat) {
  if (format === "hex") return "Copied hex code!";
  return `Copied ${format.toUpperCase()} format!`;
}

function ColorName({
  name,
  copiedMessage,
}: {
  name: string;
  copiedMessage: string | null;
}) {
  const copied = copiedMessage !== null;

  return (
    <motion.span
      className="pointer-events-none relative z-10 flex w-fit items-center text-subtle whitespace-nowrap"
      variants={labelVariants}
    >
      <span className="block h-6 overflow-hidden">
        <span
          className={cn(
            "grid transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            copied && "-translate-y-6",
          )}
        >
          <span className="flex h-6 items-center">{name}</span>
          <span className="flex h-6 items-center gap-2">
            <Check className="size-4 shrink-0" aria-hidden="true" />
            {copiedMessage}
          </span>
        </span>
      </span>
    </motion.span>
  );
}

function ColorFormatValue({
  colorName,
  format,
  children,
  onCopy,
  className,
}: {
  colorName: string;
  format: ColorFormat;
  children: ReactNode;
  onCopy: (format: ColorFormat) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group/color-value pointer-events-auto relative w-fit cursor-pointer justify-self-end border-0 bg-transparent p-0 text-right text-inherit focus-visible:outline-none",
        className,
      )}
      aria-label={`Copy ${colorName} ${format === "hex" ? "hex code" : `${format.toUpperCase()} format`}`}
      onClick={() => onCopy(format)}
    >
      <span>{children}</span>
      <span
        className="absolute right-0 bottom-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover/color-value:scale-x-100 group-focus-visible/color-value:scale-x-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </button>
  );
}

function DetailedColorValues({
  color,
  converted,
  onCopy,
  compact = false,
}: {
  color: BrandColor;
  converted: ConvertedColor;
  onCopy: (format: ColorFormat) => void;
  compact?: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none relative z-10 grid self-end text-right text-detail opacity-80"
      variants={labelVariants}
    >
      <ColorFormatValue colorName={color.name} format="hex" onCopy={onCopy}>
        {color.hex.toUpperCase()}
      </ColorFormatValue>
      <ColorFormatValue
        format="hsl"
        colorName={color.name}
        onCopy={onCopy}
        className={cn(compact && "min-[768px]:max-[1439px]:hidden")}
      >
        HSL: {converted.hsl}
      </ColorFormatValue>
      <ColorFormatValue
        format="rgb"
        colorName={color.name}
        onCopy={onCopy}
        className={cn(compact && "min-[768px]:max-[1439px]:hidden")}
      >
        RGB: {converted.rgb}
      </ColorFormatValue>
      <ColorFormatValue
        format="cmyk"
        colorName={color.name}
        onCopy={onCopy}
        className={cn(compact && "min-[768px]:max-[1439px]:hidden")}
      >
        CMYK: {converted.cmyk}
      </ColorFormatValue>
    </motion.div>
  );
}

function ProportionValues({
  color,
  converted,
  onCopy,
}: {
  color: BrandColor;
  converted: ConvertedColor;
  onCopy: (format: ColorFormat) => void;
}) {
  return (
    <motion.div
      className="pointer-events-none relative z-10 grid self-end text-right text-detail opacity-80"
      variants={labelVariants}
    >
      <span>{color.proportion}%</span>
      <ColorFormatValue colorName={color.name} format="hex" onCopy={onCopy}>
        {color.hex.toUpperCase()}
      </ColorFormatValue>
      <ColorFormatValue colorName={color.name} format="hsl" onCopy={onCopy}>
        HSL: {converted.hsl}
      </ColorFormatValue>
      <ColorFormatValue colorName={color.name} format="rgb" onCopy={onCopy}>
        RGB: {converted.rgb}
      </ColorFormatValue>
      <ColorFormatValue colorName={color.name} format="cmyk" onCopy={onCopy}>
        CMYK: {converted.cmyk}
      </ColorFormatValue>
    </motion.div>
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
  const [copiedColor, setCopiedColor] = useState<ColorCopyState | null>(null);
  const [copyError, setCopyError] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const explorerId = useId().replace(/:/g, "");
  const panelId = `${explorerId}-color-panel`;
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

  const copyColor = async (color: BrandColor, format: ColorFormat) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const converted = convertColor(color.hex);

    try {
      await writeTextToClipboard(colorCopyValue(color, converted, format));
      setCopiedColor({ name: color.name, format });
      setCopyError(false);
    } catch {
      setCopiedColor(null);
      setCopyError(true);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopiedColor(null);
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

        <BrandSegmentedControl
          value={view}
          options={COLOR_VIEW_OPTIONS}
          onValueChange={selectView}
          ariaLabel="Color view"
          controlsId={panelId}
          disabled={transitioning}
        />
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
                const copiedMessage =
                  copiedColor?.name === color.name
                    ? colorCopyMessage(copiedColor.format)
                    : null;
                const converted = convertColor(color.hex);
                const foreground =
                  color.foreground === "light" ? "#ffffff" : "#0a0a0a";

                if (view === "mosaic") {
                  return (
                    <motion.div
                      key={color.name}
                      className={cn(
                        "relative flex min-w-0 flex-col justify-between overflow-hidden border-0 py-5 text-left data-[bordered=true]:ring-1 data-[bordered=true]:ring-(--brand-line) data-[bordered=true]:ring-inset max-[767px]:min-h-[clamp(9rem,22vh,13rem)] max-[767px]:px-6",
                        color.mosaic.columnSpan === 1 ? "px-2" : "px-6",
                      )}
                      custom="mosaic"
                      variants={tileVariants}
                      data-bordered={
                        color.hex.toUpperCase() === "#FFFFFF"
                          ? "true"
                          : undefined
                      }
                      style={{
                        backgroundColor: color.hex,
                        color: foreground,
                        gridColumn: `${color.mosaic.columnStart} / span ${color.mosaic.columnSpan}`,
                        gridRow: `${color.mosaic.rowStart} / span ${color.mosaic.rowSpan}`,
                      }}
                    >
                      <button
                        type="button"
                        className="absolute inset-0 z-0 cursor-pointer border-0 bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand-accent)"
                        aria-label={`Copy ${color.name} hex code ${color.hex}`}
                        onClick={() => void copyColor(color, "hex")}
                      />
                      <ColorName
                        name={color.mosaicLabel ?? color.name}
                        copiedMessage={copiedMessage}
                      />
                      <DetailedColorValues
                        color={color}
                        converted={converted}
                        onCopy={(format) => void copyColor(color, format)}
                        compact={color.mosaic.columnSpan === 1}
                      />
                    </motion.div>
                  );
                }

                const isDominantProportion = colorIndex < 2;
                const proportionStyle = {
                  "--brand-color-proportion": `${color.proportion}%`,
                  backgroundColor: color.hex,
                  color: foreground,
                } as CSSProperties;

                return (
                  <motion.div
                    key={color.name}
                    className={cn(
                      "group relative min-w-0 basis-[var(--brand-color-proportion)] shrink grow-0 overflow-hidden border-0 p-0 text-left transition-[min-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-[767px]:min-h-44 max-[767px]:basis-auto motion-reduce:transition-none",
                      isDominantProportion
                        ? "min-[768px]:min-w-40"
                        : "min-[768px]:hover:min-w-52 min-[768px]:focus-within:min-w-52",
                    )}
                    custom="proportions"
                    variants={tileVariants}
                    style={proportionStyle}
                  >
                    <button
                      type="button"
                      className="absolute inset-0 z-0 cursor-pointer border-0 bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand-accent)"
                      aria-label={`Copy ${color.name} hex code ${color.hex}, ${color.proportion} percent`}
                      onClick={() => void copyColor(color, "hex")}
                    />
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 flex flex-col justify-between px-4 py-5 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                        !isDominantProportion &&
                          "min-[768px]:opacity-0 min-[768px]:group-hover:opacity-100 min-[768px]:group-focus-within:opacity-100",
                      )}
                    >
                      <ColorName
                        name={color.name}
                        copiedMessage={copiedMessage}
                      />
                      <ProportionValues
                        color={color}
                        converted={converted}
                        onCopy={(format) => void copyColor(color, format)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copyError
          ? "Could not copy the color value"
          : copiedColor
            ? `${copiedColor.name}: ${colorCopyMessage(copiedColor.format)}`
            : ""}
      </span>
    </div>
  );
}
