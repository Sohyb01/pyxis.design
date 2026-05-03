"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedGlowSvgPath } from "@/components/ui/animated-glow-svg-path";
import type { Transition } from "framer-motion";

type AnimationEase = NonNullable<Transition["ease"]>;
type ParsedSvg = {
  src: string;
  viewBox: string;
  width: number;
  height: number;
  innerMarkup: string;
};

type BackgroundGraphicProps = {
  src: string;
  width: number | string;
  className?: string;
  alt?: string;
  gradientFrom?: string;
  gradientTo?: string;
  animated?: boolean;
  orientation?: "vertical" | "horizontal";
  delay?: number;
  duration?: number;
  ease?: AnimationEase;
  viewportAmount?: number | "some" | "all";
  viewportMargin?: string;
  backgroundClassName?: string;
  foregroundClassName?: string;
};

const normalizePublicPath = (src: string) => {
  if (src.startsWith("/")) {
    return src;
  }

  return `/${src}`;
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

type ColorMode = "currentColor" | "gradient";

const shouldSkipColorization = (node: SVGElement) =>
  Boolean(
    node.closest(
      "defs,mask,clipPath,pattern,linearGradient,radialGradient,filter",
    ),
  );

const normalizeMarkup = (
  svgText: string,
  {
    mode,
    gradientId,
  }: {
    mode: ColorMode;
    gradientId?: string;
  },
): ParsedSvg | null => {
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
    if (shouldSkipColorization(node)) return;

    const colorValue =
      mode === "gradient" && gradientId ? `url(#${gradientId})` : "currentColor";

    const fill = node.getAttribute("fill");
    if (fill && fill !== "none") node.setAttribute("fill", colorValue);

    const stroke = node.getAttribute("stroke");
    if (stroke && stroke !== "none") node.setAttribute("stroke", colorValue);

    if (!fill && !stroke && node.tagName.toLowerCase() === "path") {
      node.setAttribute("fill", colorValue);
    }
  });

  return {
    src: "",
    viewBox: `${minX} ${minY} ${width} ${height}`,
    width,
    height,
    innerMarkup: clone.innerHTML,
  };
};

const isSvgPath = (src: string) => /\.svg($|\?)/i.test(src);

const splitAnimatedClasses = (className?: string) => {
  if (!className) {
    return {
      containerClassName: undefined,
      inferredBackgroundClassName: undefined,
      inferredForegroundClassName: undefined,
    };
  }

  const tokens = className.split(/\s+/).filter(Boolean);
  const containerTokens: string[] = [];
  const inferredBackgroundTokens: string[] = [];
  const inferredForegroundTokens: string[] = [];

  for (const token of tokens) {
    const segments = token.split(":");
    const utility = segments[segments.length - 1];

    if (utility.startsWith("bg-")) {
      segments[segments.length - 1] = `text-${utility.slice(3)}`;
      inferredBackgroundTokens.push(segments.join(":"));
      containerTokens.push(token);
      continue;
    }

    if (utility.startsWith("text-")) {
      inferredForegroundTokens.push(token);
    }

    containerTokens.push(token);
  }

  return {
    containerClassName:
      containerTokens.length > 0 ? containerTokens.join(" ") : undefined,
    inferredBackgroundClassName:
      inferredBackgroundTokens.length > 0
        ? inferredBackgroundTokens.join(" ")
        : undefined,
    inferredForegroundClassName:
      inferredForegroundTokens.length > 0
        ? inferredForegroundTokens.join(" ")
        : undefined,
  };
};

export const BackgroundGraphic = ({
  src,
  width,
  className,
  alt = "",
  gradientFrom,
  gradientTo,
  animated = false,
  orientation = "horizontal",
  delay = 0,
  duration,
  ease,
  viewportAmount,
  viewportMargin,
  backgroundClassName,
  foregroundClassName,
}: BackgroundGraphicProps) => {
  const normalizedSrc = normalizePublicPath(src);
  const rawGradientId = useId();
  const gradientId = useMemo(
    () =>
      `background-graphic-gradient-${rawGradientId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawGradientId],
  );
  const hasGradient = Boolean(gradientFrom && gradientTo);
  const [parsedSvg, setParsedSvg] = useState<ParsedSvg | null>(null);
  const shouldInlineSvg = !animated && isSvgPath(normalizedSrc);

  const widthStyle = useMemo(
    () => ({
      width: typeof width === "number" ? `${width}px` : width,
    }),
    [width],
  );

  useEffect(() => {
    if (!shouldInlineSvg) return;

    let isMounted = true;

    const load = async () => {
      const response = await fetch(normalizedSrc);
      if (!response.ok) return;
      const svgText = await response.text();
      const normalized = normalizeMarkup(svgText, {
        mode: hasGradient ? "gradient" : "currentColor",
        gradientId: hasGradient ? gradientId : undefined,
      });
      if (!isMounted) return;
      setParsedSvg(normalized ? { ...normalized, src: normalizedSrc } : null);
    };

    load().catch(() => {
      if (isMounted) setParsedSvg(null);
    });

    return () => {
      isMounted = false;
    };
  }, [normalizedSrc, shouldInlineSvg, hasGradient, gradientId]);

  if (animated) {
    const {
      containerClassName,
      inferredBackgroundClassName,
      inferredForegroundClassName,
    } =
      splitAnimatedClasses(className);

    return (
      <AnimatedGlowSvgPath
        src={normalizedSrc}
        width={width}
        orientation={orientation}
        delay={delay}
        duration={duration}
        ease={ease}
        viewportAmount={viewportAmount}
        viewportMargin={viewportMargin}
        className={containerClassName}
        backgroundClassName={cn(inferredBackgroundClassName, backgroundClassName)}
        foregroundClassName={cn(inferredForegroundClassName, foregroundClassName)}
      />
    );
  }

  if (shouldInlineSvg) {
    if (!parsedSvg || parsedSvg.src !== normalizedSrc) {
      return <></>;
    }

    return (
      <div
        className={cn(
          "relative bg-transparent pointer-events-none select-none text-foreground",
          className,
        )}
        style={widthStyle}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        <svg viewBox={parsedSvg.viewBox} className="block h-auto w-full">
          {hasGradient && (
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradientFrom} />
                <stop offset="100%" stopColor={gradientTo} />
              </linearGradient>
            </defs>
          )}
          <g dangerouslySetInnerHTML={{ __html: parsedSvg.innerMarkup }} />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={normalizedSrc}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn("pointer-events-none select-none", className)}
      style={widthStyle}
    />
  );
};

export default BackgroundGraphic;
