"use client";

import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ScreenEdgeBordersProps = {
  className?: string;
  lineClassName?: string;
  thickness?: number | string;
  horizontalExtend?: number | string;
  verticalExtend?: number | string;
  stopAtOtherBorders?: boolean;
  dashed?: boolean;
  dashLength?: number;
  dashGap?: number;
  showTop?: boolean;
  showBottom?: boolean;
  showLeft?: boolean;
  showRight?: boolean;
};

const lineColorEdge =
  "color-mix(in srgb, var(--muted-foreground) 6%, transparent)";
const lineColor =
  "color-mix(in srgb, var(--muted-foreground) 30%, transparent)";
const horizontalGradient = `linear-gradient(90deg, ${lineColorEdge} 0%, ${lineColor} 100%)`;
const verticalGradient = `linear-gradient(180deg, ${lineColorEdge} 0%, ${lineColor} 100%)`;
const horizontalGradientReverse = `linear-gradient(90deg, ${lineColor} 0%, ${lineColorEdge} 100%)`;
const verticalGradientReverse = `linear-gradient(180deg, ${lineColor} 0%, ${lineColorEdge} 100%)`;

const INSTANCE_ATTR = "data-screen-edge-borders";
const INSTANCE_ID_ATTR = "data-screen-edge-borders-id";
const REFRESH_EVENT = "screen-edge-borders:refresh";

type Extents = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const MIN_NEIGHBOR_DISTANCE_PX = 1.5;

const overlaps = (startA: number, endA: number, startB: number, endB: number) =>
  Math.min(endA, endB) > Math.max(startA, startB);

const resolveLengthPx = (value: number | string, viewportSize: number) => {
  if (typeof value === "number") {
    return value;
  }

  const trimmed = value.trim();

  if (trimmed.endsWith("vw") || trimmed.endsWith("vh")) {
    const ratio = Number.parseFloat(trimmed.slice(0, -2));
    if (Number.isFinite(ratio)) {
      return (viewportSize * ratio) / 100;
    }
  }

  if (trimmed.endsWith("px")) {
    const px = Number.parseFloat(trimmed.slice(0, -2));
    if (Number.isFinite(px)) {
      return px;
    }
  }

  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    return numeric;
  }

  return viewportSize;
};

const createDashMaskStyle = (
  direction: "horizontal" | "vertical",
  dashLength: number,
  dashGap: number,
): CSSProperties => {
  const step = Math.max(1, dashLength + dashGap);
  const dash = Math.max(1, dashLength);
  const gradient =
    direction === "horizontal"
      ? `repeating-linear-gradient(90deg, #000 0px, #000 ${dash}px, transparent ${dash}px, transparent ${step}px)`
      : `repeating-linear-gradient(180deg, #000 0px, #000 ${dash}px, transparent ${dash}px, transparent ${step}px)`;

  return {
    WebkitMaskImage: gradient,
    maskImage: gradient,
    WebkitMaskRepeat: "repeat",
    maskRepeat: "repeat",
  };
};

export default function ScreenEdgeBorders({
  className,
  lineClassName,
  thickness = 1,
  horizontalExtend = "200vw",
  verticalExtend = "100vh",
  stopAtOtherBorders = true,
  dashed = false,
  dashLength = 8,
  dashGap = 6,
  showTop = true,
  showBottom = true,
  showLeft = true,
  showRight = true,
}: ScreenEdgeBordersProps) {
  const instanceId = useId().replace(/[:]/g, "");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lineThickness =
    typeof thickness === "number" ? `${thickness}px` : thickness;
  const [computedExtents, setComputedExtents] = useState<Extents | null>(null);

  useEffect(() => {
    if (!stopAtOtherBorders) {
      return;
    }

    const updateExtents = () => {
      const node = rootRef.current;
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxHorizontal = resolveLengthPx(horizontalExtend, viewportWidth);
      const maxVertical = resolveLengthPx(verticalExtend, viewportHeight);

      let left = Math.max(0, Math.min(rect.left, maxHorizontal));
      let right = Math.max(
        0,
        Math.min(viewportWidth - rect.right, maxHorizontal),
      );
      let top = Math.max(0, Math.min(rect.top, maxVertical));
      let bottom = Math.max(
        0,
        Math.min(viewportHeight - rect.bottom, maxVertical),
      );

      const others = Array.from(
        document.querySelectorAll<HTMLElement>(`[${INSTANCE_ATTR}]`),
      ).filter(
        (element) =>
          element !== node &&
          element.dataset.screenEdgeBordersId !== instanceId &&
          element.isConnected,
      );

      let nearestLeft: number | null = null;
      let nearestRight: number | null = null;
      let nearestTop: number | null = null;
      let nearestBottom: number | null = null;

      for (const other of others) {
        const otherRect = other.getBoundingClientRect();

        if (overlaps(rect.top, rect.bottom, otherRect.top, otherRect.bottom)) {
          if (otherRect.right <= rect.left) {
            const distance = rect.left - otherRect.right;
            if (
              distance > MIN_NEIGHBOR_DISTANCE_PX &&
              (nearestLeft === null || distance < nearestLeft)
            ) {
              nearestLeft = distance;
            }
          }

          if (otherRect.left >= rect.right) {
            const distance = otherRect.left - rect.right;
            if (
              distance > MIN_NEIGHBOR_DISTANCE_PX &&
              (nearestRight === null || distance < nearestRight)
            ) {
              nearestRight = distance;
            }
          }
        }

        if (overlaps(rect.left, rect.right, otherRect.left, otherRect.right)) {
          if (otherRect.bottom <= rect.top) {
            const distance = rect.top - otherRect.bottom;
            if (
              distance > MIN_NEIGHBOR_DISTANCE_PX &&
              (nearestTop === null || distance < nearestTop)
            ) {
              nearestTop = distance;
            }
          }

          if (otherRect.top >= rect.bottom) {
            const distance = otherRect.top - rect.bottom;
            if (
              distance > MIN_NEIGHBOR_DISTANCE_PX &&
              (nearestBottom === null || distance < nearestBottom)
            ) {
              nearestBottom = distance;
            }
          }
        }
      }

      if (nearestLeft !== null) left = Math.min(left, nearestLeft);
      if (nearestRight !== null) right = Math.min(right, nearestRight);
      if (nearestTop !== null) top = Math.min(top, nearestTop);
      if (nearestBottom !== null) bottom = Math.min(bottom, nearestBottom);

      setComputedExtents((previous) => {
        if (
          previous &&
          Math.abs(previous.left - left) < 0.5 &&
          Math.abs(previous.right - right) < 0.5 &&
          Math.abs(previous.top - top) < 0.5 &&
          Math.abs(previous.bottom - bottom) < 0.5
        ) {
          return previous;
        }

        return { left, right, top, bottom };
      });
    };

    let rafId = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateExtents);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const rootNode = rootRef.current;
    if (rootNode) {
      resizeObserver.observe(rootNode);
    }
    resizeObserver.observe(document.body);

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener(REFRESH_EVENT, scheduleUpdate);

    scheduleUpdate();
    window.dispatchEvent(new Event(REFRESH_EVENT));

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener(REFRESH_EVENT, scheduleUpdate);
      window.dispatchEvent(new Event(REFRESH_EVENT));
    };
  }, [horizontalExtend, instanceId, stopAtOtherBorders, verticalExtend]);

  const leftExtend =
    stopAtOtherBorders && computedExtents?.left !== undefined
      ? `${computedExtents.left}px`
      : typeof horizontalExtend === "number"
        ? `${horizontalExtend}px`
        : horizontalExtend;
  const rightExtend =
    stopAtOtherBorders && computedExtents?.right !== undefined
      ? `${computedExtents.right}px`
      : typeof horizontalExtend === "number"
        ? `${horizontalExtend}px`
        : horizontalExtend;
  const topExtend =
    stopAtOtherBorders && computedExtents?.top !== undefined
      ? `${computedExtents.top}px`
      : typeof verticalExtend === "number"
        ? `${verticalExtend}px`
        : verticalExtend;
  const bottomExtend =
    stopAtOtherBorders && computedExtents?.bottom !== undefined
      ? `${computedExtents.bottom}px`
      : typeof verticalExtend === "number"
        ? `${verticalExtend}px`
        : verticalExtend;

  const horizontalDashStyle = dashed
    ? createDashMaskStyle("horizontal", dashLength, dashGap)
    : undefined;
  const verticalDashStyle = dashed
    ? createDashMaskStyle("vertical", dashLength, dashGap)
    : undefined;

  return (
    <div
      ref={rootRef}
      {...{
        [INSTANCE_ATTR]: "",
        [INSTANCE_ID_ATTR]: instanceId,
      }}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
    >
      {showTop && (
        <div
          className={cn("absolute", lineClassName)}
          style={{
            top: 0,
            left: `calc(-1 * ${leftExtend})`,
            width: `calc(100% + ${leftExtend} + ${rightExtend})`,
            height: lineThickness,
          }}
        >
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: leftExtend,
              background: horizontalGradient,
              ...horizontalDashStyle,
            }}
          />
          <div
            className="absolute top-0 h-full"
            style={{
              left: leftExtend,
              width: `calc(100% - ${leftExtend} - ${rightExtend})`,
              background: lineColor,
              ...horizontalDashStyle,
            }}
          />
          <div
            className="absolute top-0 h-full"
            style={{
              left: `calc(100% - ${rightExtend})`,
              width: rightExtend,
              background: horizontalGradientReverse,
              ...horizontalDashStyle,
            }}
          />
        </div>
      )}

      {showBottom && (
        <div
          className={cn("absolute", lineClassName)}
          style={{
            bottom: 0,
            left: `calc(-1 * ${leftExtend})`,
            width: `calc(100% + ${leftExtend} + ${rightExtend})`,
            height: lineThickness,
          }}
        >
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: leftExtend,
              background: horizontalGradient,
              ...horizontalDashStyle,
            }}
          />
          <div
            className="absolute top-0 h-full"
            style={{
              left: leftExtend,
              width: `calc(100% - ${leftExtend} - ${rightExtend})`,
              background: lineColor,
              ...horizontalDashStyle,
            }}
          />
          <div
            className="absolute top-0 h-full"
            style={{
              left: `calc(100% - ${rightExtend})`,
              width: rightExtend,
              background: horizontalGradientReverse,
              ...horizontalDashStyle,
            }}
          />
        </div>
      )}

      {showLeft && (
        <div
          className={cn("absolute", lineClassName)}
          style={{
            left: 0,
            top: `calc(-1 * ${topExtend})`,
            height: `calc(100% + ${topExtend} + ${bottomExtend})`,
            width: lineThickness,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: topExtend,
              background: verticalGradient,
              ...verticalDashStyle,
            }}
          />
          <div
            className="absolute left-0 w-full"
            style={{
              top: topExtend,
              height: `calc(100% - ${topExtend} - ${bottomExtend})`,
              background: lineColor,
              ...verticalDashStyle,
            }}
          />
          <div
            className="absolute left-0 w-full"
            style={{
              top: `calc(100% - ${bottomExtend})`,
              height: bottomExtend,
              background: verticalGradientReverse,
              ...verticalDashStyle,
            }}
          />
        </div>
      )}

      {showRight && (
        <div
          className={cn("absolute", lineClassName)}
          style={{
            right: 0,
            top: `calc(-1 * ${topExtend})`,
            height: `calc(100% + ${topExtend} + ${bottomExtend})`,
            width: lineThickness,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: topExtend,
              background: verticalGradient,
              ...verticalDashStyle,
            }}
          />
          <div
            className="absolute left-0 w-full"
            style={{
              top: topExtend,
              height: `calc(100% - ${topExtend} - ${bottomExtend})`,
              background: lineColor,
              ...verticalDashStyle,
            }}
          />
          <div
            className="absolute left-0 w-full"
            style={{
              top: `calc(100% - ${bottomExtend})`,
              height: bottomExtend,
              background: verticalGradientReverse,
              ...verticalDashStyle,
            }}
          />
        </div>
      )}
    </div>
  );
}
