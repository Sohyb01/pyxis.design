"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type AnimationEase = NonNullable<Transition["ease"]>;

type AnimatedGlowSvgPathProps = {
  src: string;
  width?: number | string;
  orientation?: "vertical" | "horizontal";
  delay?: number;
  duration?: number;
  ease?: AnimationEase;
  viewportAmount?: number | "some" | "all";
  viewportMargin?: string;
  className?: string;
  backgroundClassName?: string;
  foregroundClassName?: string;
};

type ParsedSvg = {
  viewBox: string;
  minX: number;
  minY: number;
  width: number;
  height: number;
  innerMarkup: string;
};

const parseViewBox = (
  value: string | null,
): [number, number, number, number] | null => {
  if (!value) return null;
  const parts = value
    .split(/[,\s]+/)
    .map((part) => Number(part))
    .filter((part) => Number.isFinite(part));

  if (parts.length !== 4) return null;
  return [parts[0], parts[1], parts[2], parts[3]];
};

const normalizeMarkupToCurrentColor = (svgText: string): ParsedSvg | null => {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.documentElement;

  if (!svg || svg.nodeName.toLowerCase() !== "svg") return null;

  const parsedViewBox =
    parseViewBox(svg.getAttribute("viewBox")) ??
    (() => {
      const width = Number(svg.getAttribute("width"));
      const height = Number(svg.getAttribute("height"));
      if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
      return [0, 0, width, height] as [number, number, number, number];
    })();

  if (!parsedViewBox) return null;
  const [minX, minY, width, height] = parsedViewBox;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll("*").forEach((node) => {
    if (!(node instanceof SVGElement)) return;

    const fill = node.getAttribute("fill");
    if (fill && fill !== "none") node.setAttribute("fill", "currentColor");

    const stroke = node.getAttribute("stroke");
    if (stroke && stroke !== "none")
      node.setAttribute("stroke", "currentColor");

    if (!fill && !stroke && node.tagName.toLowerCase() === "path") {
      node.setAttribute("fill", "currentColor");
    }
  });

  return {
    viewBox: `${minX} ${minY} ${width} ${height}`,
    minX,
    minY,
    width,
    height,
    innerMarkup: clone.innerHTML,
  };
};

export function AnimatedGlowSvgPath({
  src,
  width,
  orientation = "horizontal",
  delay = 0,
  duration = 1.2,
  ease = [0.16, 1, 0.3, 1],
  viewportAmount = "some",
  viewportMargin = "0px",
  className,
  backgroundClassName,
  foregroundClassName,
}: AnimatedGlowSvgPathProps) {
  const [parsed, setParsed] = useState<ParsedSvg | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const clipId = useId();
  const isHorizontal = orientation === "horizontal";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const response = await fetch(src);
      if (!response.ok) return;
      const svgText = await response.text();
      const normalized = normalizeMarkupToCurrentColor(svgText);
      if (!isMounted) return;
      setParsed(normalized);
    };

    load().catch(() => {
      if (isMounted) setParsed(null);
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  useEffect(() => {
    if (!parsed || hasEnteredView) return;
    const node = containerRef.current;
    if (!node) return;

    const frame = window.requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const isPartiallyVisible =
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.top < window.innerHeight;

      if (isPartiallyVisible) {
        setHasEnteredView(true);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [parsed, hasEnteredView]);

  const initialClip = useMemo(() => {
    if (!parsed) return {};
    if (isHorizontal) {
      return { width: 0, height: parsed.height };
    }
    return { height: 0, width: parsed.width };
  }, [isHorizontal, parsed]);

  const inViewClip = useMemo(() => {
    if (!parsed) return {};
    return { width: parsed.width, height: parsed.height };
  }, [parsed]);

  const widthStyle = useMemo(
    () =>
      width === undefined
        ? undefined
        : { width: typeof width === "number" ? `${width}px` : width },
    [width],
  );

  if (!parsed) {
    return <></>;
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative bg-transparent pointer-events-none select-none",
        width === undefined && "w-full",
        className,
      )}
      style={widthStyle}
      onViewportEnter={() => setHasEnteredView(true)}
      viewport={{
        once: true,
        amount: viewportAmount,
        margin: viewportMargin,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldReduceMotion || hasEnteredView ? 1 : 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: "easeOut",
      }}
    >
      <svg
        viewBox={parsed.viewBox}
        className="block h-auto w-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <motion.rect
              x={parsed.minX}
              y={parsed.minY}
              initial={shouldReduceMotion ? inViewClip : initialClip}
              animate={shouldReduceMotion || hasEnteredView ? inViewClip : initialClip}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration, delay, ease }
              }
            />
          </clipPath>
        </defs>

        <g
          className={cn("text-muted-foreground", backgroundClassName)}
          dangerouslySetInnerHTML={{ __html: parsed.innerMarkup }}
        />

        <g
          className={cn("text-foreground", foregroundClassName)}
          clipPath={`url(#${clipId})`}
          dangerouslySetInnerHTML={{ __html: parsed.innerMarkup }}
        />
      </svg>
    </motion.div>
  );
}
