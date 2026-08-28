"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import type { BrandLogoVariant } from "@/lib/brand/types";

import { MediaPlaceholder } from "../shared";

export interface ClearSpaceArtworkProps {
  variant: BrandLogoVariant;
}

interface ImageState {
  source: string;
  width: number;
  height: number;
  failed: boolean;
}

interface ContainerSize {
  width: number;
  height: number;
}

export function ClearSpaceArtwork({ variant }: ClearSpaceArtworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const patternId = `clear-space-${useId().replace(/:/g, "")}`;
  const source = variant.src ?? "";
  const [imageState, setImageState] = useState<ImageState>(() => ({
    source,
    width: 0,
    height: 0,
    failed: !source,
  }));
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  });

  const currentImageState =
    imageState.source === source
      ? imageState
      : { source, width: 0, height: 0, failed: !source };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const bounds = container.getBoundingClientRect();
      setContainerSize({ width: bounds.width, height: bounds.height });
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!source) return;

    const image = new window.Image();
    image.onload = () => {
      setImageState({
        source,
        width: image.naturalWidth,
        height: image.naturalHeight,
        failed: image.naturalWidth === 0 || image.naturalHeight === 0,
      });
    };
    image.onerror = () => {
      setImageState({ source, width: 0, height: 0, failed: true });
    };
    image.src = source;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [source]);

  const canRender =
    currentImageState.width > 0 &&
    currentImageState.height > 0 &&
    containerSize.width > 0 &&
    containerSize.height > 0;

  let diagram: ReactNode = null;

  if (canRender) {
    const aspectRatio = currentImageState.width / currentImageState.height;
    const availableWidth = Math.max(containerSize.width - 24, 1);
    const availableHeight = Math.max(containerSize.height - 120, 1);
    const logoHeight = Math.max(
      24,
      Math.min(
        availableWidth / (aspectRatio + 2.1),
        availableHeight / 3.1,
        140,
      ),
    );
    const logoWidth = logoHeight * aspectRatio;
    const unit = logoHeight / 2;
    const boundOffset = unit * 1.1;
    const boundWidth = logoWidth + unit * 2;
    const boundHeight = logoHeight + unit * 2;
    const canvasWidth = boundWidth + boundOffset * 2;
    const canvasHeight = boundHeight + boundOffset * 2;
    const logoX = boundOffset + unit;
    const logoY = boundOffset + unit;
    const cornerSize = unit;
    const fontSize = Math.max(10, unit * 0.28);
    const guideInset = unit * 0.12;
    const corners = [
      [boundOffset, boundOffset],
      [boundOffset + boundWidth, boundOffset],
      [boundOffset, boundOffset + boundHeight],
      [boundOffset + boundWidth, boundOffset + boundHeight],
    ] as const;

    diagram = (
      <svg
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        width={canvasWidth}
        height={canvasHeight}
        className="max-h-full max-w-full overflow-visible"
        role="img"
        aria-label={`${variant.title} clear space diagram. One x equals half the logo height.`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id={patternId}
            width={8}
            height={8}
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={8}
              stroke="var(--brand-line)"
              strokeWidth={1}
            />
          </pattern>
        </defs>

        <path
          d={`M ${boundOffset} ${boundOffset} h ${boundWidth} v ${boundHeight} h ${-boundWidth} Z M ${logoX} ${logoY} h ${logoWidth} v ${logoHeight} h ${-logoWidth} Z`}
          fill={`url(#${patternId})`}
          fillRule="evenodd"
        />
        <rect
          x={boundOffset}
          y={boundOffset}
          width={boundWidth}
          height={boundHeight}
          fill="none"
          stroke="var(--brand-line)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        {[logoY, logoY + logoHeight].map((guideY) => (
          <line
            key={guideY}
            x1={guideInset}
            y1={guideY}
            x2={canvasWidth - guideInset}
            y2={guideY}
            stroke="var(--brand-line)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}

        <image
          href={source}
          x={logoX}
          y={logoY}
          width={logoWidth}
          height={logoHeight}
          preserveAspectRatio="xMidYMid meet"
        />

        {[logoY, logoY + logoHeight].flatMap((guideY) => [
          <text
            key={`start-${guideY}`}
            x={guideInset}
            y={guideY - fontSize * 0.4}
            fill="var(--brand-muted)"
            fontSize={fontSize}
          >
            1x
          </text>,
          <text
            key={`end-${guideY}`}
            x={canvasWidth - guideInset}
            y={guideY - fontSize * 0.4}
            fill="var(--brand-muted)"
            fontSize={fontSize}
            textAnchor="end"
          >
            1x
          </text>,
        ])}

        {corners.map(([centerX, centerY]) => (
          <g key={`${centerX}-${centerY}`}>
            <rect
              x={centerX - cornerSize / 2}
              y={centerY - cornerSize / 2}
              width={cornerSize}
              height={cornerSize}
              fill="var(--brand-accent)"
            />
            <text
              x={centerX}
              y={centerY}
              fill="var(--brand-accent-foreground)"
              fontSize={fontSize}
              textAnchor="middle"
              dominantBaseline="central"
            >
              1x
            </text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative grid size-full min-h-64 place-items-center overflow-hidden pb-24"
    >
      {currentImageState.failed ? (
        <MediaPlaceholder
          className="min-h-40 w-full max-w-80"
          label={`${variant.title} artwork not supplied`}
        />
      ) : (
        diagram
      )}
    </div>
  );
}
