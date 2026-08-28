"use client";

import { useId, useRef } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface BrandSegmentedControlOption<TValue extends string> {
  value: TValue;
  label: string;
  id?: string;
  controlsId?: string;
}

export interface BrandSegmentedControlProps<TValue extends string> {
  value: TValue;
  options: readonly BrandSegmentedControlOption<TValue>[];
  onValueChange: (value: TValue) => void;
  ariaLabel: string;
  semantics?: "group" | "tabs";
  controlsId?: string;
  disabled?: boolean;
  className?: string;
}

const SWITCHER_EASE: [number, number, number, number] = [0.7, 0, 0.16, 1];

export function BrandSegmentedControl<TValue extends string>({
  value,
  options,
  onValueChange,
  ariaLabel,
  semantics = "group",
  controlsId,
  disabled = false,
  className,
}: BrandSegmentedControlProps<TValue>) {
  const switcherId = useId().replace(/:/g, "");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion() === true;

  const selectOption = (option: BrandSegmentedControlOption<TValue>) => {
    if (disabled || option.value === value) return;
    onValueChange(option.value);
  };

  return (
    <LayoutGroup id={switcherId}>
      <div
        className={cn(
          "relative inline-flex shrink-0 items-center gap-0.5 rounded-full border border-(--brand-line) bg-(--brand-surface) p-[3px]",
          className,
        )}
        aria-label={ariaLabel}
        aria-orientation={semantics === "tabs" ? "horizontal" : undefined}
        role={semantics === "tabs" ? "tablist" : "group"}
      >
        {options.map((option, index) => {
          const active = option.value === value;

          return (
            <button
              type="button"
              key={option.value}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              id={option.id}
              className={cn(
                "relative z-0 h-[29px] cursor-pointer rounded-full border-0 bg-transparent px-3 text-body transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent) motion-reduce:transition-none",
                active
                  ? "[color:var(--brand-accent-foreground)]"
                  : "text-muted-foreground/70 hover:text-foreground",
              )}
              role={semantics === "tabs" ? "tab" : undefined}
              aria-selected={semantics === "tabs" ? active : undefined}
              aria-pressed={semantics === "group" ? active : undefined}
              aria-controls={option.controlsId ?? controlsId}
              aria-disabled={disabled || undefined}
              tabIndex={semantics === "tabs" ? (active ? 0 : -1) : undefined}
              onClick={() => selectOption(option)}
              onKeyDown={(event) => {
                if (semantics !== "tabs" || disabled) return;

                let nextIndex: number | null = null;
                if (event.key === "ArrowRight") {
                  nextIndex = (index + 1) % options.length;
                } else if (event.key === "ArrowLeft") {
                  nextIndex = (index - 1 + options.length) % options.length;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = options.length - 1;
                }

                if (nextIndex === null) return;
                event.preventDefault();
                onValueChange(options[nextIndex].value);
                buttonRefs.current[nextIndex]?.focus();
              }}
            >
              {active ? (
                <motion.span
                  className="absolute inset-0 -z-10 rounded-full bg-(--brand-accent)"
                  layoutId={`${switcherId}-selection`}
                  initial={false}
                  transition={{
                    duration: reduceMotion ? 0 : 0.42,
                    ease: SWITCHER_EASE,
                  }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
