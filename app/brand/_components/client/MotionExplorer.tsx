"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type {
  BrandMotionConfig,
  BrandMotionEase,
  BrandMotionExample,
  BrandMotionMedia,
} from "@/lib/brand/types";
import {
  getBrandMotionSnippets,
  type BrandMotionSnippetFormat,
} from "@/lib/brand/values";
import { cn } from "@/lib/utils";

import { writeTextToClipboard } from "./clipboard";

export interface MotionExplorerProps {
  brandSlug: string;
  motionConfig: BrandMotionConfig;
}

const snippetFormats: readonly {
  value: BrandMotionSnippetFormat;
  label: string;
}[] = [
  { value: "css", label: "CSS" },
  { value: "gsap", label: "GSAP" },
  { value: "react", label: "React" },
];

const moveOvalPositions = [
  { left: "76%", top: "50%" },
  { left: "62%", top: "71%" },
  { left: "38%", top: "71%" },
  { left: "24%", top: "50%" },
  { left: "38%", top: "29%" },
  { left: "62%", top: "29%" },
] as const;

function seconds(milliseconds: number) {
  return Number((milliseconds / 1000).toFixed(3));
}

function MotionImage({
  media,
  sizes,
  loading,
}: {
  media: BrandMotionMedia;
  sizes: string;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !media.src) {
    return (
      <div
        className="grid h-full w-full place-items-center bg-(--brand-surface) text-detail text-muted-foreground/70"
        role="img"
        aria-label={`${media.alt} unavailable`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      loading={loading}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function EaseCodeDisclosure({
  brandSlug,
  ease,
}: {
  brandSlug: string;
  ease: BrandMotionEase;
}) {
  const [expanded, setExpanded] = useState(false);
  const [format, setFormat] = useState<BrandMotionSnippetFormat>("css");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId().replace(/:/g, "");
  const snippets = getBrandMotionSnippets(brandSlug, ease);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const selectFormat = (nextFormat: BrandMotionSnippetFormat) => {
    setFormat(nextFormat);
    setCopied(false);
    setCopyError(false);
  };

  const copySnippet = async () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    try {
      await writeTextToClipboard(snippets[format]);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 1400);
  };

  return (
    <div className="min-w-0">
      <button
        type="button"
        className="w-fit cursor-pointer border-b border-muted-foreground/70 text-muted-foreground/70 py-1 text-detail focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent)"
        aria-expanded={expanded}
        aria-controls={`${id}-ease-code`}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Hide code" : "Copy this ease"}
      </button>

      {expanded ? (
        <div id={`${id}-ease-code`} className="mt-4 min-w-0 pb-4">
          <div
            className="flex min-w-0 gap-1"
            role="tablist"
            aria-label={`${ease.name} code format`}
          >
            {snippetFormats.map((item) => (
              <button
                type="button"
                key={item.value}
                id={`${id}-${item.value}-tab`}
                className={cn(
                  "cursor-pointer border-b py-1 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent)",
                  item.value === format
                    ? "border-(--brand-accent) [color:var(--brand-accent)]"
                    : "border-transparent text-muted-foreground/70",
                )}
                role="tab"
                aria-selected={item.value === format}
                aria-controls={`${id}-code-panel`}
                tabIndex={item.value === format ? 0 : -1}
                onClick={() => selectFormat(item.value)}
                onKeyDown={(event) => {
                  const currentIndex = snippetFormats.findIndex(
                    (candidate) => candidate.value === item.value,
                  );
                  let nextIndex = currentIndex;

                  if (event.key === "ArrowRight") {
                    nextIndex = (currentIndex + 1) % snippetFormats.length;
                  } else if (event.key === "ArrowLeft") {
                    nextIndex =
                      (currentIndex - 1 + snippetFormats.length) %
                      snippetFormats.length;
                  } else if (event.key === "Home") {
                    nextIndex = 0;
                  } else if (event.key === "End") {
                    nextIndex = snippetFormats.length - 1;
                  } else {
                    return;
                  }

                  event.preventDefault();
                  const nextFormat = snippetFormats[nextIndex].value;
                  selectFormat(nextFormat);
                  window.requestAnimationFrame(() => {
                    document.getElementById(`${id}-${nextFormat}-tab`)?.focus();
                  });
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            id={`${id}-code-panel`}
            className="min-w-0 pt-4"
            role="tabpanel"
            aria-labelledby={`${id}-${format}-tab`}
          >
            <code className="block min-w-0 overflow-x-auto whitespace-pre-wrap break-words text-detail">
              {snippets[format]}
            </code>
          </div>

          <div className="flex justify-start pt-4">
            <button
              type="button"
              className="cursor-pointer border-b border-(--brand-line) py-1 text-body text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent)"
              onClick={() => void copySnippet()}
            >
              {copyError ? "Copy failed" : copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copyError
          ? `Could not copy ${ease.name} ${format} ease`
          : copied
            ? `${ease.name} ${format} ease copied`
            : ""}
      </span>
    </div>
  );
}

function EnterStage({ ease }: { ease: BrandMotionEase }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;

    const styles = getComputedStyle(tile);
    const accent = styles.getPropertyValue("--display-brand-accent").trim();
    const gray = styles.getPropertyValue("--brand-line").trim();
    const easing = `cubic-bezier(${ease.bezier.join(", ")})`;

    if (!shouldAnimate) {
      tile.style.transform = "scale(1)";
      tile.style.backgroundColor = accent;
      return;
    }

    const animation = tile.animate(
      [
        {
          transform: "scale(1)",
          backgroundColor: accent,
          easing,
          offset: 0,
        },
        {
          transform: "scale(0.6)",
          backgroundColor: gray,
          offset: 0.18,
        },
        {
          transform: "scale(0.6)",
          backgroundColor: gray,
          easing,
          offset: 0.5,
        },
        {
          transform: "scale(1)",
          backgroundColor: accent,
          offset: 0.68,
        },
        {
          transform: "scale(1)",
          backgroundColor: accent,
          offset: 1,
        },
      ],
      {
        duration: ease.durationMs * 5.5,
        iterations: Number.POSITIVE_INFINITY,
      },
    );

    return () => animation.cancel();
  }, [ease.bezier, ease.durationMs, shouldAnimate]);

  return (
    <div
      ref={stageRef}
      className="grid aspect-square place-items-center overflow-clip rounded-sm bg-(--brand-surface)"
      role="img"
      aria-label={`${ease.name} motion demonstration`}
      data-motion-ease={ease.id}
    >
      <div
        ref={tileRef}
        className="aspect-5/3 rounded-[2px] bg-(--brand-line)"
        style={{ width: "43%" }}
      />
    </div>
  );
}

function MoveStage({ ease }: { ease: BrandMotionEase }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;
  const easing = [...ease.bezier] as [number, number, number, number];
  const staggerMs = ease.staggerMs ?? 45;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    const slowestDurationMs = ease.durationMs + 5 * 35;
    const cycleMs = slowestDurationMs + 5 * staggerMs + 1000;
    const initialPause = setTimeout(() => {
      setStep(1);
      interval = setInterval(() => {
        setStep((current) => (current + 1) % moveOvalPositions.length);
      }, cycleMs);
    }, 1000);

    return () => {
      clearTimeout(initialPause);
      if (interval) clearInterval(interval);
    };
  }, [ease.durationMs, shouldAnimate, staggerMs]);

  return (
    <div
      ref={stageRef}
      className="relative aspect-square overflow-clip rounded-sm bg-(--brand-surface)"
      role="img"
      aria-label={`${ease.name} motion demonstration`}
      data-motion-ease={ease.id}
    >
      {moveOvalPositions.map((_, index) => {
        const visibleStep = shouldAnimate ? step : 0;
        const position =
          moveOvalPositions[(index + visibleStep) % moveOvalPositions.length];

        return (
          <motion.span
            key={index}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-[2px]",
              index === 0 ? "bg-(--display-brand-accent)" : "bg-(--brand-line)",
            )}
            style={{ width: "16.5%", height: "16.5%" }}
            animate={{ left: position.left, top: position.top }}
            transition={
              shouldAnimate
                ? {
                    duration: seconds(ease.durationMs + index * 35),
                    delay: index * seconds(staggerMs),
                    ease: easing,
                  }
                : { duration: 0 }
            }
          />
        );
      })}
    </div>
  );
}

function CarouselExampleStage({
  ease,
  example,
}: {
  ease: BrandMotionEase;
  example: Extract<BrandMotionExample, { kind: "carousel" }>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const durationMs = example.durationMs ?? ease.durationMs;
  const slides = [
    example.images.at(-1)!,
    ...example.images,
    example.images[0],
    example.images[1],
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const positionFor = (index: number) => `translateX(-${index * 45}%)`;

    if (reduceMotion) {
      track.style.transform = positionFor(1);
      return;
    }

    const holdMs = 1000;
    const segmentMs = holdMs + durationMs;
    const totalMs = segmentMs * example.images.length;
    const easing = `cubic-bezier(${ease.bezier.join(", ")})`;
    const keyframes: Keyframe[] = [{ transform: positionFor(1), offset: 0 }];

    example.images.forEach((_, index) => {
      const segmentStart = index * segmentMs;
      keyframes.push({
        transform: positionFor(index + 1),
        offset: (segmentStart + holdMs) / totalMs,
        easing,
      });
      keyframes.push({
        transform: positionFor(index + 2),
        offset: (segmentStart + segmentMs) / totalMs,
      });
    });

    const animation = track.animate(keyframes, {
      duration: totalMs,
      iterations: Number.POSITIVE_INFINITY,
    });

    return () => animation.cancel();
  }, [durationMs, ease.bezier, example.images, reduceMotion, slides.length]);

  return (
    <div className="absolute inset-0">
      <div
        ref={trackRef}
        className="absolute inset-0 flex w-full items-center"
        style={{ left: "30%" }}
      >
        {slides.map((media, index) => (
          <div
            className="aspect-9/16 shrink-0"
            key={`${media.src}-${index}`}
            style={{ width: "40%", marginRight: "5%" }}
          >
            <div className="relative h-full overflow-clip rounded-sm">
              <MotionImage
                media={media}
                sizes="(min-width: 1280px) 14vw, 56vw"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EaseDemonstration({
  brandSlug,
  ease,
  index,
}: {
  brandSlug: string;
  ease: BrandMotionEase;
  index: number;
}) {
  return (
    <article className="flex min-w-0 flex-col gap-4">
      {index === 0 ? <EnterStage ease={ease} /> : <MoveStage ease={ease} />}
      <div className="grid gap-1">
        <h4 className="text-large">{ease.name}</h4>
        <p className="max-w-[44ch] text-body text-muted-foreground/70 text-pretty">
          {ease.description}
        </p>
      </div>
      <EaseCodeDisclosure brandSlug={brandSlug} ease={ease} />
    </article>
  );
}

function ExampleStage({
  ease,
  example,
}: {
  ease: BrandMotionEase;
  example: BrandMotionExample;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;
  const easing = [...ease.bezier] as [number, number, number, number];
  const duration = seconds(example.durationMs ?? ease.durationMs);

  return (
    <div
      ref={stageRef}
      className="relative aspect-3/4 overflow-clip rounded-sm bg-(--brand-surface)"
      role="img"
      aria-label={`${example.label} motion example using the ${ease.name} ease`}
      data-motion-ease={ease.id}
    >
      {example.kind === "exchange" ? (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="relative aspect-9/16 w-1/2"
            style={{ transformStyle: "preserve-3d" }}
            animate={
              shouldAnimate
                ? { rotateY: [0, 0, 180, 180, 360, 360] }
                : { rotateY: 0 }
            }
            transition={
              shouldAnimate
                ? {
                    duration: duration * 6,
                    ease: easing,
                    repeat: Number.POSITIVE_INFINITY,
                    times: [0, 0.2, 0.34, 0.68, 0.82, 1],
                  }
                : undefined
            }
          >
            <div
              className="absolute inset-0 overflow-clip rounded-sm"
              style={{ backfaceVisibility: "hidden" }}
            >
              <MotionImage
                media={example.images[0]}
                sizes="(min-width: 1280px) 20vw, 70vw"
              />
            </div>
            <div
              className="absolute inset-0 overflow-clip rounded-sm"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <MotionImage
                media={example.images[1]}
                sizes="(min-width: 1280px) 20vw, 70vw"
              />
            </div>
          </motion.div>
        </div>
      ) : null}

      {example.kind === "carousel" ? (
        <CarouselExampleStage ease={ease} example={example} />
      ) : null}

      {example.kind === "toggle" ? (
        <div className="grid h-full place-items-center">
          <div className="flex h-12 w-28 items-center rounded-full bg-(--brand-background) p-1">
            <motion.span
              className="block size-10 rounded-full bg-(--display-brand-accent)"
              animate={shouldAnimate ? { x: [0, 64, 64, 0] } : { x: 64 }}
              transition={
                shouldAnimate
                  ? {
                      duration: duration * 2,
                      ease: easing,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                      times: [0, 0.35, 0.65, 1],
                    }
                  : undefined
              }
            />
          </div>
        </div>
      ) : null}

      {example.kind === "reveal" ? (
        <div className="flex h-full flex-col justify-center gap-3 px-12 py-16">
          {Array.from({ length: 4 }, (_, index) => (
            <motion.div
              className="flex items-center gap-3"
              key={index}
              animate={
                shouldAnimate
                  ? { y: [16, 0, 0, 16], opacity: [0, 1, 1, 0] }
                  : { y: 0, opacity: 1 }
              }
              transition={
                shouldAnimate
                  ? {
                      duration: duration * 4.6,
                      delay: index * seconds(ease.staggerMs ?? 80),
                      ease: easing,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 0.7,
                      times: [0, 0.2, 0.82, 1],
                    }
                  : undefined
              }
            >
              <div
                className="size-9 shrink-0 rounded-md bg-(--brand-line)"
                aria-hidden="true"
              />
              <div className="grid flex-1 gap-2">
                <span className="h-2 w-3/4 rounded-sm bg-(--brand-line)" />
                <span className="h-2 w-1/2 rounded-sm bg-(--brand-line)" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CurvePlot({ ease }: { ease: BrandMotionEase }) {
  const [x1, y1, x2, y2] = ease.bezier;
  const gridLines = Array.from({ length: 11 }, (_, index) => (index + 1) / 12);
  const path = `M0,1 C${x1},${1 - y1} ${x2},${1 - y2} 1,0`;

  return (
    <div className="relative aspect-square w-39">
      <svg
        className="h-full w-full"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${ease.name} cubic Bézier curve`}
      >
        <rect
          x="0"
          y="0"
          width="1"
          height="1"
          fill="none"
          stroke="var(--brand-line)"
          strokeWidth="0.0035"
        />
        <g stroke="var(--brand-line)" strokeWidth="0.0015" aria-hidden="true">
          {gridLines.map((position) => (
            <g key={position}>
              <line x1={position} y1="0" x2={position} y2="1" />
              <line x1="0" y1={position} x2="1" y2={position} />
            </g>
          ))}
        </g>
        <path
          d={path}
          fill="none"
          stroke="var(--brand-foreground)"
          strokeWidth="0.004"
        />
        <circle cx="1" cy="0" r="0.04" fill="var(--display-brand-accent)" />
      </svg>
    </div>
  );
}

function CurvePreview({ ease }: { ease: BrandMotionEase }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;
  const easing = [...ease.bezier] as [number, number, number, number];

  return (
    <div ref={previewRef} className="relative h-4 w-39" aria-hidden="true">
      <span className="absolute top-1/2 right-0 left-0 h-px bg-(--brand-line)" />
      <motion.span
        className="absolute top-0 size-3 rounded-[2px] bg-(--display-brand-accent)"
        animate={shouldAnimate ? { x: [0, 155] } : { x: 155 }}
        transition={
          shouldAnimate
            ? {
                duration: seconds(ease.durationMs),
                ease: easing,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }
            : undefined
        }
      />
    </div>
  );
}

function CurveCard({
  brandSlug,
  ease,
}: {
  brandSlug: string;
  ease: BrandMotionEase;
}) {
  return (
    <article className="flex w-39 min-w-0 flex-col gap-5">
      <CurvePlot ease={ease} />
      <CurvePreview ease={ease} />
      <h4 className="text-detail text-muted-foreground/70">{ease.name}</h4>
      <EaseCodeDisclosure brandSlug={brandSlug} ease={ease} />
    </article>
  );
}

export function MotionExplorer({
  brandSlug,
  motionConfig,
}: MotionExplorerProps) {
  const easesById = new Map(
    motionConfig.eases.map((ease) => [ease.id, ease] as const),
  );

  return (
    <div className="grid gap-52">
      <section aria-labelledby="motion-demonstrations-heading">
        <h3
          id="motion-demonstrations-heading"
          className="mb-4 text-detail text-muted-foreground/70"
        >
          {motionConfig.labels.demonstrations}
        </h3>
        <div className="grid gap-x-5 gap-y-10 md:grid-cols-2">
          {motionConfig.eases.map((ease, index) => (
            <EaseDemonstration
              key={ease.id}
              brandSlug={brandSlug}
              ease={ease}
              index={index}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="motion-examples-heading">
        <h3
          id="motion-examples-heading"
          className="mb-4 text-detail text-muted-foreground/70"
        >
          {motionConfig.labels.examples}
        </h3>
        <div className="grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-4">
          {motionConfig.examples.map((example) => {
            const ease = easesById.get(example.easeId);
            if (!ease) return null;

            return (
              <article className="flex min-w-0 flex-col gap-4" key={example.id}>
                <ExampleStage ease={ease} example={example} />
                <h4 className="text-body_medium">{example.label}</h4>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="motion-curves-heading">
        <h3
          id="motion-curves-heading"
          className="mb-4 text-detail text-muted-foreground/70"
        >
          {motionConfig.labels.curves}
        </h3>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-5">
          <div className="grid min-w-0 justify-start gap-5 md:grid-cols-2 lg:col-span-5">
            {motionConfig.eases.map((ease) => (
              <CurveCard brandSlug={brandSlug} ease={ease} key={ease.id} />
            ))}
          </div>

          <div className="grid content-start gap-4 lg:col-span-6 lg:col-start-7">
            {motionConfig.curveNarrative.map((paragraph) => (
              <p
                className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty"
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
