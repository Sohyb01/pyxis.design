"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { BrandImage } from "@/lib/brand/types";
import { cn } from "@/lib/utils";

export interface ColumnsMoodboardProps {
  items: readonly BrandImage[];
}

interface PositionedImage {
  item: BrandImage;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const COLUMN_GAP = 12;

function getColumnCount(viewportWidth: number) {
  if (viewportWidth < 480) return 2;
  if (viewportWidth < 1000) return 3;
  return 4;
}

function createLayout(
  items: readonly BrandImage[],
  containerWidth: number,
  viewportWidth: number,
) {
  if (containerWidth <= 0) {
    return { images: [] as PositionedImage[], height: 0 };
  }

  const columnCount = getColumnCount(viewportWidth || containerWidth);
  const columnWidth =
    (containerWidth - COLUMN_GAP * (columnCount - 1)) / columnCount;
  const columnHeights = Array.from({ length: columnCount }, () => 0);

  const images = items.map((item, index): PositionedImage => {
    let shortestColumn = 0;
    for (let column = 1; column < columnHeights.length; column += 1) {
      if (columnHeights[column] < columnHeights[shortestColumn]) {
        shortestColumn = column;
      }
    }

    const aspectRatio =
      item.width > 0 && item.height > 0 ? item.width / item.height : 1;
    const imageHeight = columnWidth / aspectRatio;
    const positioned = {
      item,
      index,
      x: shortestColumn * (columnWidth + COLUMN_GAP),
      y: columnHeights[shortestColumn],
      width: columnWidth,
      height: imageHeight,
    };

    columnHeights[shortestColumn] += imageHeight + COLUMN_GAP;
    return positioned;
  });

  return {
    images,
    height: Math.max(0, ...columnHeights) - (images.length ? COLUMN_GAP : 0),
  };
}

export function ColumnsMoodboard({ items }: ColumnsMoodboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = (width: number) => {
      const measuredWidth = Math.round(width * 100) / 100;
      setContainerWidth((current) =>
        current === measuredWidth ? current : measuredWidth,
      );
      setViewportWidth(window.innerWidth);
    };

    updateWidth(container.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateWidth(entry.contentRect.width);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const layout = useMemo(
    () => createLayout(items, containerWidth, viewportWidth),
    [containerWidth, items, viewportWidth],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-px w-full transition-[height] duration-200 motion-reduce:transition-none",
        containerWidth === 0 && "min-h-96",
      )}
      style={{ height: layout.height || undefined }}
      role="list"
      aria-label="Brand moodboard"
      aria-busy={containerWidth === 0}
    >
      {layout.images.map(({ item, index, x, y, width, height }) => {
        const failed = failedImages.has(index) || !item.src;
        const imageStyle = {
          width,
          height,
          transform: `translate3d(${x}px, ${y}px, 0)`,
        } as CSSProperties;

        return (
          <figure
            key={`${item.src}-${index}`}
            className="absolute top-0 left-0 m-0 overflow-hidden rounded-sm bg-(--brand-surface) transition-[width,height,transform] duration-200 motion-reduce:transition-none"
            style={imageStyle}
            role="listitem"
          >
            {failed ? (
              <div
                className="grid size-full place-items-center content-center gap-2 text-muted-foreground/70"
                role="img"
                aria-label={item.alt}
              >
                <ImageIcon className="size-5" aria-hidden="true" />
                <span className="text-detail">Image unavailable</span>
              </div>
            ) : (
              <Image
                className="block size-full object-cover"
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 479px) 50vw, (max-width: 999px) 34vw, 25vw"
                loading="lazy"
                draggable={false}
                onError={() => {
                  setFailedImages((current) => {
                    const next = new Set(current);
                    next.add(index);
                    return next;
                  });
                }}
              />
            )}
            <figcaption className="sr-only">{item.alt}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
