"use client";

import { useId, useState } from "react";

import type {
  BrandTypeface,
  BrandTypographyConfig,
  BrandTypographySeparateBody,
  BrandTypographySystem,
  BrandTypeScaleItem,
} from "@/lib/brand/types";
import { cn } from "@/lib/utils";

import { BrandSegmentedControl } from "./BrandSegmentedControl";

export interface TypographyExplorerProps {
  typography: BrandTypographyConfig;
}

type TypefaceLookup = ReadonlyMap<string, BrandTypeface>;

function createTypefaceLookup(typography: BrandTypographyConfig) {
  const typefaces = new Map<string, BrandTypeface>();

  typography.typefaces.forEach((typeface) => {
    if (typefaces.has(typeface.id)) {
      throw new Error(
        `Brand typography configuration contains the duplicate typeface ID "${typeface.id}".`,
      );
    }

    typefaces.set(typeface.id, typeface);
  });

  return typefaces;
}

function resolveTypeface(
  typefaces: TypefaceLookup,
  typefaceId: string,
  systemId: string,
  usage: "heading" | "body",
) {
  const typeface = typefaces.get(typefaceId);

  if (!typeface) {
    throw new Error(
      `Typography system "${systemId}" references the missing ${usage} typeface "${typefaceId}".`,
    );
  }

  return typeface;
}

function resolveWeights(
  typeface: BrandTypeface,
  values: readonly number[],
  systemId: string,
  usage: "heading" | "body",
) {
  return values.map((value) => {
    const weight = typeface.weights.find((item) => item.value === value);

    if (!weight) {
      throw new Error(
        `Typography system "${systemId}" requests ${usage} specimen weight ${value}, but typeface "${typeface.id}" does not provide it.`,
      );
    }

    return weight;
  });
}

function TypefaceName({
  typeface,
  system,
  compact = false,
}: {
  typeface: BrandTypeface;
  system: BrandTypographySystem;
  compact?: boolean;
}) {
  return (
    <h3
      className="break-words"
      lang={system.lang}
      dir={system.direction}
      style={{
        fontFamily: typeface.cssFamily,
        fontSize: compact
          ? "clamp(2.5rem, 5vw, 4rem)"
          : "clamp(4rem, 6.5vw, 8rem)",
        fontWeight: 500,
        lineHeight: compact ? 1 : 0.92,
        letterSpacing:
          system.direction === "rtl"
            ? "normal"
            : !compact
              ? "-0.06em"
              : undefined,
      }}
    >
      {typeface.nativeName ?? typeface.displayName}
    </h3>
  );
}

function HeadingSpecimen({
  system,
  typeface,
}: {
  system: BrandTypographySystem;
  typeface: BrandTypeface;
}) {
  const weights = resolveWeights(
    typeface,
    system.heading.specimenWeightValues,
    system.id,
    "heading",
  );
  const sheetStep = 77.3685 / weights.length;

  return (
    <div className="grid gap-12 min-[1280px]:aspect-[5/2.8] min-[1280px]:max-h-[54rem] min-[1280px]:grid-cols-12 min-[1280px]:items-stretch min-[1280px]:gap-x-6">
      <div className="flex min-w-0 flex-col min-[1280px]:col-span-6 min-[1280px]:grid min-[1280px]:h-full min-[1280px]:grid-cols-6 min-[1280px]:grid-rows-[1fr_auto_auto_auto] min-[1280px]:gap-x-6">
        <div className="pt-2 min-[1280px]:col-span-full">
          <TypefaceName typeface={typeface} system={system} />
        </div>

        <dl className="mt-24 grid grid-cols-3 gap-4 border-t border-(--brand-line) pt-5 text-subtle text-muted-foreground/70 min-[1280px]:col-span-full min-[1280px]:mt-0 min-[1280px]:grid-cols-6 min-[1280px]:gap-x-6">
          <div className="min-w-0 min-[1280px]:col-span-2">
            <dt className="sr-only">Role</dt>
            <dd>{system.heading.role}</dd>
          </div>
          <div className="min-w-0 min-[1280px]:col-span-2">
            <dt className="sr-only">Source</dt>
            <dd>{typeface.source}</dd>
          </div>
          <div className="min-w-0 min-[1280px]:col-span-2 min-[1280px]:col-start-5 min-[1280px]:text-right min-[1280px]:whitespace-nowrap">
            <dt className="sr-only">Styles</dt>
            <dd>{typeface.styleCount}</dd>
          </div>
        </dl>

        <p className="mb-3 max-w-[44ch] pt-2.5 pb-3 text-subtle text-muted-foreground/70 text-pretty min-[1280px]:col-span-2 min-[1280px]:col-start-3">
          {system.heading.description}
        </p>

        <p
          className="break-words whitespace-pre-line border-t border-(--brand-line) pt-6 min-[1280px]:col-span-full"
          lang={system.lang}
          dir={system.direction}
          style={{
            fontFamily: typeface.cssFamily,
            fontSize: "clamp(2rem, 2.45vw, 2.75rem)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: system.direction === "rtl" ? "normal" : undefined,
          }}
        >
          {system.heading.charset}
        </p>
      </div>

      <div
        className="relative min-h-[34rem] overflow-hidden min-[1280px]:col-span-6 min-[1280px]:min-h-0"
        aria-label={`${typeface.displayName} weight specimens`}
        role="list"
      >
        {weights.map((weight, index) => (
          <div
            className="absolute inset-y-0 right-0 border-l border-(--brand-line) bg-(--brand-background) px-3 py-4 min-[640px]:px-5"
            key={weight.value}
            role="listitem"
            style={{
              left: `${index * sheetStep}%`,
              zIndex: index + 1,
            }}
          >
            <div className="flex items-center justify-between gap-2 text-detail">
              <span>{weight.name}</span>
              {index === weights.length - 1 ? (
                <span>{weight.value}</span>
              ) : null}
            </div>
            <span
              className="absolute bottom-0 left-2 block"
              lang={system.lang}
              dir={system.direction}
              aria-hidden="true"
              style={{
                fontFamily: typeface.cssFamily,
                fontSize: "clamp(10rem, 24vw, 32rem)",
                fontWeight: weight.value,
                lineHeight: 1,
                letterSpacing:
                  system.direction === "rtl" ? "normal" : undefined,
                transform:
                  system.direction === "ltr"
                    ? "translateY(0.1em)"
                    : "translateY(-0.03em)",
              }}
            >
              {system.heading.specimenGlyph}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeparateBodySpecimen({
  body,
  system,
  typeface,
}: {
  body: BrandTypographySeparateBody;
  system: BrandTypographySystem;
  typeface: BrandTypeface;
}) {
  const weights = resolveWeights(
    typeface,
    body.specimenWeightValues,
    system.id,
    "body",
  );

  return (
    <div className="mt-36 grid gap-12 border-t border-(--brand-line) pt-10 min-[900px]:grid-cols-12 min-[900px]:gap-x-6">
      <div className="min-[900px]:col-span-6">
        <TypefaceName typeface={typeface} system={system} compact />
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-detail text-muted-foreground/70">
          <div>
            <dt className="sr-only">Role</dt>
            <dd>{body.role}</dd>
          </div>
          <div>
            <dt className="sr-only">Source</dt>
            <dd>{typeface.source}</dd>
          </div>
          <div>
            <dt className="sr-only">Styles</dt>
            <dd>{typeface.styleCount}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-5 min-[900px]:col-span-6">
        <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
          {body.description}
        </p>
        <p
          lang={system.lang}
          dir={system.direction}
          style={{
            fontFamily: typeface.cssFamily,
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: system.direction === "rtl" ? "normal" : undefined,
          }}
        >
          {body.sample}
        </p>
        <ul
          className="flex flex-wrap gap-x-6 gap-y-2 text-p"
          aria-label={`${typeface.displayName} weights`}
        >
          {weights.map((weight) => (
            <li
              key={weight.value}
              lang={system.lang}
              dir={system.direction}
              style={{
                fontFamily: typeface.cssFamily,
                fontWeight: weight.value,
                letterSpacing:
                  system.direction === "rtl" ? "normal" : undefined,
              }}
            >
              {weight.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScaleSample({
  item,
  system,
  headingTypeface,
  bodyTypeface,
  compact,
}: {
  item: BrandTypeScaleItem;
  system: BrandTypographySystem;
  headingTypeface: BrandTypeface;
  bodyTypeface: BrandTypeface;
  compact: boolean;
}) {
  const typeface = item.usage === "heading" ? headingTypeface : bodyTypeface;

  return (
    <div
      className={cn(
        "min-w-0",
        compact
          ? "flex flex-col gap-2"
          : "grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4",
      )}
    >
      <span className="text-detail text-muted-foreground/70" dir="ltr">
        {item.role} <span aria-hidden="true">·</span> {item.sizePx}/
        {item.lineHeightPx}
      </span>
      <span
        className="min-w-0 break-words"
        lang={system.lang}
        dir={system.direction}
        style={{
          fontFamily: typeface.cssFamily,
          fontSize: item.sizePx,
          fontWeight: item.weight,
          lineHeight: `${item.lineHeightPx}px`,
          letterSpacing: system.direction === "rtl" ? "normal" : undefined,
        }}
      >
        {item.sample}
      </span>
    </div>
  );
}

function TypeScale({
  system,
  headingTypeface,
  bodyTypeface,
  hasSeparateBodySpecimen,
}: {
  system: BrandTypographySystem;
  headingTypeface: BrandTypeface;
  bodyTypeface: BrandTypeface;
  hasSeparateBodySpecimen: boolean;
}) {
  const displayScale = system.scale.filter((item) => item.sizePx >= 20);
  const textScale = system.scale.filter((item) => item.sizePx < 20);

  return (
    <div
      className={cn(
        "grid gap-16 min-[900px]:grid-cols-12 min-[900px]:gap-x-6",
        hasSeparateBodySpecimen ? "mt-40" : "mt-36",
      )}
    >
      <div className="flex min-w-0 flex-col gap-10 min-[900px]:col-span-8">
        {displayScale.map((item) => (
          <ScaleSample
            key={`${item.role}-${item.usage}`}
            item={item}
            system={system}
            headingTypeface={headingTypeface}
            bodyTypeface={bodyTypeface}
            compact={false}
          />
        ))}
      </div>

      <div className="flex flex-col gap-10 min-[900px]:col-span-3 min-[900px]:col-start-10 min-[900px]:self-end">
        {textScale.map((item) => (
          <ScaleSample
            key={`${item.role}-${item.usage}`}
            item={item}
            system={system}
            headingTypeface={headingTypeface}
            bodyTypeface={bodyTypeface}
            compact
          />
        ))}
      </div>
    </div>
  );
}

function TypographySystemPanel({
  system,
  typefaces,
  panelId,
  tabId,
  active,
}: {
  system: BrandTypographySystem;
  typefaces: TypefaceLookup;
  panelId: string;
  tabId: string;
  active: boolean;
}) {
  const headingTypeface = resolveTypeface(
    typefaces,
    system.heading.typefaceId,
    system.id,
    "heading",
  );
  const bodyTypeface =
    system.body.mode === "shared"
      ? headingTypeface
      : resolveTypeface(typefaces, system.body.typefaceId, system.id, "body");

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={active ? 0 : -1}
      hidden={!active}
      className="outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-accent)"
    >
      <HeadingSpecimen system={system} typeface={headingTypeface} />

      {system.body.mode === "separate" ? (
        <SeparateBodySpecimen
          body={system.body}
          system={system}
          typeface={bodyTypeface}
        />
      ) : null}

      <TypeScale
        system={system}
        headingTypeface={headingTypeface}
        bodyTypeface={bodyTypeface}
        hasSeparateBodySpecimen={system.body.mode === "separate"}
      />
    </div>
  );
}

export function TypographyExplorer({ typography }: TypographyExplorerProps) {
  const explorerId = useId().replace(/:/g, "");
  const [activeSystemId, setActiveSystemId] = useState(
    typography.defaultSystemId,
  );
  const typefaces = createTypefaceLookup(typography);
  const defaultIndex = typography.systems.findIndex(
    (system) => system.id === typography.defaultSystemId,
  );

  if (defaultIndex === -1) {
    throw new Error(
      `Brand typography default system "${typography.defaultSystemId}" does not exist.`,
    );
  }

  const activeIndex = typography.systems.findIndex(
    (system) => system.id === activeSystemId,
  );
  const selectedIndex = activeIndex === -1 ? defaultIndex : activeIndex;

  return (
    <div>
      <header className="mb-24 grid gap-6 pt-12 min-[900px]:grid-cols-12 min-[900px]:gap-x-6 min-[1024px]:pt-8">
        <h2
          id="typography-heading"
          className="text-5xl min-[900px]:col-span-full lg:text-7xl"
        >
          {typography.heading}
        </h2>
        <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty min-[900px]:col-span-7">
          {typography.description}
        </p>

        <BrandSegmentedControl
          className="w-fit min-[900px]:col-span-5 min-[900px]:self-end min-[900px]:justify-self-end"
          value={typography.systems[selectedIndex].id}
          options={typography.systems.map((system) => ({
            value: system.id,
            label: system.label,
            id: `${explorerId}-${system.id}-tab`,
            controlsId: `${explorerId}-${system.id}-panel`,
          }))}
          onValueChange={setActiveSystemId}
          ariaLabel="Typography language"
          semantics="tabs"
        />
      </header>

      {typography.systems.map((system, index) => (
        <TypographySystemPanel
          key={system.id}
          system={system}
          typefaces={typefaces}
          panelId={`${explorerId}-${system.id}-panel`}
          tabId={`${explorerId}-${system.id}-tab`}
          active={index === selectedIndex}
        />
      ))}
    </div>
  );
}
