"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FileQuestion, ImageIcon } from "lucide-react";

import type { BrandDownloadAsset } from "@/lib/brand/types";

export interface DownloadAssetRowProps extends BrandDownloadAsset {
  previewSrc?: string;
  showFileSize?: boolean;
  containPreview?: boolean;
}

interface Dimensions {
  width: number;
  height: number;
}

interface AssetState {
  source: string;
  dimensions: Dimensions | null;
  metadataFailed: boolean;
  previewFailed: boolean;
}

interface FileSizeState {
  source: string;
  bytes: number | null;
  failed: boolean;
}

function getFileDetails(src: string) {
  const pathname = src.split(/[?#]/, 1)[0] ?? "";
  const encodedName = pathname.split("/").filter(Boolean).at(-1) ?? "";
  let fileName = encodedName;

  try {
    fileName = decodeURIComponent(encodedName);
  } catch {
    // Preserve the encoded name if it cannot be decoded safely.
  }

  const extension = fileName.includes(".")
    ? (fileName.split(".").at(-1) ?? "FILE").toUpperCase()
    : "FILE";

  return { extension, fileName };
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    const value =
      kilobytes >= 10 ? Math.round(kilobytes) : kilobytes.toFixed(1);
    return `${value} KB`;
  }

  const megabytes = kilobytes / 1024;
  const value = megabytes >= 10 ? Math.round(megabytes) : megabytes.toFixed(1);
  return `${value} MB`;
}

export function DownloadAssetRow({
  label,
  src,
  previewSrc,
  showFileSize = false,
  containPreview = false,
}: DownloadAssetRowProps) {
  const sourceForPreview = previewSrc ?? src;
  const [assetState, setAssetState] = useState<AssetState>(() => ({
    source: sourceForPreview,
    dimensions: null,
    metadataFailed: !sourceForPreview,
    previewFailed: !sourceForPreview,
  }));
  const [fileSizeState, setFileSizeState] = useState<FileSizeState>(() => ({
    source: src,
    bytes: null,
    failed: !src,
  }));
  const { extension, fileName } = useMemo(() => getFileDetails(src), [src]);

  const currentState =
    assetState.source === sourceForPreview
      ? assetState
      : {
          source: sourceForPreview,
          dimensions: null,
          metadataFailed: !sourceForPreview,
          previewFailed: !sourceForPreview,
        };
  const currentFileSizeState =
    fileSizeState.source === src
      ? fileSizeState
      : { source: src, bytes: null, failed: !src };

  useEffect(() => {
    if (!sourceForPreview) return;

    const image = new window.Image();
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setAssetState({
          source: sourceForPreview,
          dimensions: {
            width: image.naturalWidth,
            height: image.naturalHeight,
          },
          metadataFailed: false,
          previewFailed: false,
        });
      } else {
        setAssetState({
          source: sourceForPreview,
          dimensions: null,
          metadataFailed: true,
          previewFailed: true,
        });
      }
    };
    image.onerror = () => {
      setAssetState({
        source: sourceForPreview,
        dimensions: null,
        metadataFailed: true,
        previewFailed: true,
      });
    };
    image.src = sourceForPreview;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [sourceForPreview]);

  useEffect(() => {
    if (!showFileSize || !src) return;

    const controller = new AbortController();

    const readFileSize = async () => {
      try {
        const headResponse = await fetch(src, {
          method: "HEAD",
          signal: controller.signal,
        });
        const contentLength = Number(
          headResponse.headers.get("content-length"),
        );

        if (
          headResponse.ok &&
          Number.isFinite(contentLength) &&
          contentLength > 0
        ) {
          setFileSizeState({
            source: src,
            bytes: contentLength,
            failed: false,
          });
          return;
        }

        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error(`Unable to load ${src}`);

        const file = await response.blob();
        setFileSizeState({ source: src, bytes: file.size, failed: false });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setFileSizeState({ source: src, bytes: null, failed: true });
      }
    };

    void readFileSize();

    return () => controller.abort();
  }, [showFileSize, src]);

  const dimensionLabel = currentState.dimensions
    ? `${currentState.dimensions.width} × ${currentState.dimensions.height}`
    : currentState.metadataFailed
      ? "Dimensions unavailable"
      : "Reading dimensions…";
  const fileSizeLabel =
    currentFileSizeState.bytes !== null
      ? formatFileSize(currentFileSizeState.bytes)
      : currentFileSizeState.failed
        ? "Size unavailable"
        : "Reading size…";

  return (
    <article className="grid min-h-24 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-(--brand-line) px-1 py-2 last:border-b min-[640px]:grid-cols-[5rem_minmax(0,1fr)_auto] min-[640px]:gap-4 min-[640px]:px-2 min-[900px]:grid-cols-12">
      <div className="relative aspect-4/3 w-13 overflow-hidden rounded-sm bg-(--brand-surface) min-[640px]:w-20 min-[900px]:col-span-1">
        {sourceForPreview && !currentState.previewFailed ? (
          <Image
            src={sourceForPreview}
            alt=""
            fill
            sizes="5rem"
            className={containPreview ? "object-contain p-3" : "object-cover"}
            unoptimized
            onError={() =>
              setAssetState((current) => ({
                source: sourceForPreview,
                dimensions:
                  current.source === sourceForPreview
                    ? current.dimensions
                    : null,
                metadataFailed:
                  current.source === sourceForPreview
                    ? current.metadataFailed
                    : true,
                previewFailed: true,
              }))
            }
          />
        ) : (
          <div
            className="grid size-full place-items-center text-muted-foreground/70"
            aria-hidden="true"
          >
            {sourceForPreview ? (
              <ImageIcon className="size-5" />
            ) : (
              <FileQuestion className="size-5" />
            )}
          </div>
        )}
      </div>

      <div className="min-w-0 min-[900px]:col-span-4">
        <h3 className="truncate text-p_ui_medium">{label}</h3>
        <p className="mt-1 flex flex-wrap gap-1 text-detail text-muted-foreground/70 min-[900px]:hidden">
          <span>{extension}</span>
          {showFileSize ? (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{fileSizeLabel}</span>
            </>
          ) : null}
          <span aria-hidden="true">&middot;</span>
          <span>{dimensionLabel}</span>
        </p>
      </div>

      <span className="hidden text-detail text-muted-foreground/70 min-[900px]:col-span-1 min-[900px]:block">
        {extension}
      </span>
      <span className="hidden text-detail text-muted-foreground/70 min-[900px]:col-span-2 min-[900px]:block">
        {showFileSize ? fileSizeLabel : null}
      </span>
      <span className="hidden text-detail text-muted-foreground/70 min-[900px]:col-span-2 min-[900px]:block">
        {dimensionLabel}
      </span>

      {src ? (
        <a
          className="cursor-pointer border-b border-(--brand-line) py-1 text-body text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent) min-[900px]:col-span-2 min-[900px]:justify-self-end"
          href={src}
          download={fileName || true}
          aria-label={`Download ${label}, ${extension}${showFileSize ? `, ${fileSizeLabel}` : ""}, ${dimensionLabel}`}
        >
          Download
        </a>
      ) : (
        <span
          className="inline-flex min-h-10 items-center justify-center px-2 text-body text-muted-foreground/70 min-[640px]:px-3 min-[900px]:col-span-2 min-[900px]:justify-self-end"
          aria-disabled="true"
        >
          Unavailable
        </span>
      )}
    </article>
  );
}
