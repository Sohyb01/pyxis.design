"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface BrandNavigationItem {
  id: string;
  label: string;
}

export interface BrandNavigationProps {
  brandName: string;
  fontClassName: string;
  guidelinesLabel: string;
  sections: readonly BrandNavigationItem[];
  themeStyle: CSSProperties;
  children: ReactNode;
}

function sectionNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function BrandNavigation({
  brandName,
  fontClassName,
  guidelinesLabel,
  sections,
  themeStyle,
  children,
}: BrandNavigationProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [railHandleVisible, setRailHandleVisible] = useState(false);
  const frameRef = useRef<number | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const railHandleAnchorRef = useRef<HTMLDivElement>(null);
  const railHandleFocusedRef = useRef(false);
  const lastPointerXRef = useRef(-1);

  const updateActiveSection = useCallback(() => {
    const marker = (document.body.clientHeight || window.innerHeight) * 0.3;
    let nextId = sections[0]?.id ?? "";

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (!element) continue;

      if (element.getBoundingClientRect().top <= marker) {
        nextId = section.id;
      } else {
        break;
      }
    }

    setActiveId((current) => (current === nextId ? current : nextId));
  }, [sections]);

  const syncRailHandleVisibility = useCallback(() => {
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    const anchorLeft =
      railHandleAnchorRef.current?.getBoundingClientRect().left ?? 0;
    const pointerX = lastPointerXRef.current;
    const pointerNearRail = pointerX >= 0 && pointerX <= anchorLeft + 64;
    const nextVisible =
      !hoverCapable || railHandleFocusedRef.current || pointerNearRail;

    setRailHandleVisible((current) =>
      current === nextVisible ? current : nextVisible,
    );
  }, []);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover)");
    let pointerFrame: number | null = null;

    const scheduleUpdate = () => {
      if (pointerFrame !== null) return;

      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = null;
        syncRailHandleVisibility();
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      lastPointerXRef.current = event.clientX;
      scheduleUpdate();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    hoverQuery.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", scheduleUpdate);
      hoverQuery.removeEventListener("change", scheduleUpdate);
      if (pointerFrame !== null) {
        window.cancelAnimationFrame(pointerFrame);
      }
    };
  }, [syncRailHandleVisibility]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const reducedMotionFrame = window.requestAnimationFrame(
        syncRailHandleVisibility,
      );
      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    const duration = collapsed ? 500 : 700;
    const startedAt = window.performance.now();
    let transitionFrame: number;

    const followRail = (now: number) => {
      syncRailHandleVisibility();
      if (now - startedAt < duration) {
        transitionFrame = window.requestAnimationFrame(followRail);
      }
    };

    transitionFrame = window.requestAnimationFrame(followRail);

    return () => window.cancelAnimationFrame(transitionFrame);
  }, [collapsed, syncRailHandleVisibility]);

  useEffect(() => {
    const scrollRoot = document.body;
    const observedElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateActiveSection();
      });
    };

    const observer = new IntersectionObserver(scheduleUpdate, {
      root: scrollRoot,
      rootMargin: "-15% 0px -65% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    observedElements.forEach((element) => observer.observe(element));
    scrollRoot.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    scheduleUpdate();

    return () => {
      observer.disconnect();
      scrollRoot.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, [sections, updateActiveSection]);

  const navigateTo = useCallback((id: string, closeDrawer = false) => {
    const target = document.getElementById(id);
    if (!target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scrollToTarget = () => {
      const scrollRoot = document.body;
      const scrollMarginTop =
        Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;

      scrollRoot.scrollTo({
        top:
          scrollRoot.scrollTop +
          target.getBoundingClientRect().top -
          scrollMarginTop,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    setActiveId(id);

    if (closeDrawer) {
      setMobileOpen(false);
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }
      navigationTimerRef.current = window.setTimeout(scrollToTarget, 450);
      return;
    }

    scrollToTarget();
  }, []);

  const navigationItems = (closeOnNavigate = false) => {
    return (
      <ol
        className="m-0 grid list-none gap-0 p-0"
        aria-label="Brand guideline sections"
      >
        {sections.map((section, index) => {
          const active = section.id === activeId;

          return (
            <li key={section.id}>
              <button
                type="button"
                className={cn(
                  "relative grid min-h-[2.375rem] w-full cursor-pointer grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 rounded-none border-0 bg-transparent p-0 text-left text-inherit transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent) motion-reduce:transition-none min-[1440px]:max-w-[15.5rem]",
                  !active && "hover:bg-(--brand-surface)",
                )}
                aria-current={active ? "location" : undefined}
                onClick={() => {
                  navigateTo(section.id, closeOnNavigate);
                }}
              >
                <span
                  className={cn(
                    "text-detail",
                    active
                      ? "text-(--brand-accent)"
                      : "text-muted-foreground/70",
                  )}
                >
                  {sectionNumber(index)}
                </span>
                <span
                  className={cn(
                    "truncate text-p_ui",
                    active ? "text-foreground" : "text-muted-foreground/70",
                  )}
                >
                  {section.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-1/2 right-0 h-px w-5 -translate-y-1/2 origin-right bg-(--brand-accent) transition duration-200 motion-reduce:transition-none",
                    active
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 ms-auto",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <div
      className={cn(
        "min-h-svh bg-(--brand-background) [color:var(--brand-foreground)] min-[1024px]:grid min-[1024px]:items-start min-[1024px]:transition-[grid-template-columns] min-[1024px]:ease-[cubic-bezier(0.16,1,0.3,1)] min-[1024px]:motion-reduce:transition-none",
        collapsed
          ? "min-[1024px]:grid-cols-[0_minmax(0,1fr)] min-[1024px]:duration-500"
          : "min-[1024px]:grid-cols-[17rem_minmax(0,1fr)] min-[1024px]:duration-700 min-[1440px]:grid-cols-[20rem_minmax(0,1fr)]",
      )}
    >
      <aside
        className="hidden min-w-0 overflow-visible min-[1024px]:sticky min-[1024px]:top-0 min-[1024px]:z-30 min-[1024px]:block min-[1024px]:h-svh min-[1024px]:w-full"
        aria-label="Brand guideline navigation"
      >
        <div
          id="desktop-brand-guideline-sections"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[17rem] flex-col bg-(--brand-background) transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none min-[1440px]:w-[20rem]",
            collapsed
              ? "pointer-events-none -translate-x-[110%] duration-500"
              : "translate-x-0 duration-700",
          )}
          aria-hidden={collapsed}
          inert={collapsed ? true : undefined}
        >
          <div className="flex h-28 min-h-28 shrink-0 flex-col content-start gap-1 overflow-hidden p-6 pb-0 lg:p-8 lg:pb-0">
            <p className="pt-2 whitespace-nowrap text-xl uppercase">
              {brandName}
            </p>
            <p className="whitespace-nowrap text-detail text-muted-foreground/70">
              {guidelinesLabel}
            </p>
            <div className="mt-auto h-px w-full border-b border-(--brand-line)" />
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            <p className="mb-3 whitespace-nowrap text-detail opacity-55">
              Contents
            </p>
            {navigationItems()}
          </nav>
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex min-h-14 items-center justify-between gap-4 border-b border-(--brand-line) bg-(--brand-background)/95 px-4 py-3 backdrop-blur-lg min-[1024px]:hidden">
        <p className="whitespace-nowrap text-xl uppercase">{brandName}</p>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex min-h-9 cursor-pointer items-center gap-2 bg-transparent text-body_medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent) [&_svg]:size-4"
            >
              <Menu aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className={cn(
              fontClassName,
              "w-[min(17rem,86vw)]! max-w-none! gap-0 border-0 bg-(--brand-background) p-0 shadow-none [color:var(--brand-foreground)]",
            )}
            style={themeStyle}
            aria-describedby="brand-sections-description"
          >
            <SheetHeader className="h-28 min-h-28 shrink-0 content-start gap-1 overflow-hidden p-6 pb-0 text-left lg:p-8 lg:pb-0">
              <SheetTitle className="pt-2 whitespace-nowrap text-xl uppercase text-(--brand-foreground)">
                {brandName}
              </SheetTitle>
              <SheetDescription
                id="brand-sections-description"
                className="whitespace-nowrap text-detail! text-muted-foreground/70"
              >
                {guidelinesLabel}
              </SheetDescription>
              <div className="mt-auto h-px w-full border-b border-(--brand-line)" />
            </SheetHeader>
            <nav className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
              <p className="mb-3 whitespace-nowrap text-detail opacity-55">
                Contents
              </p>
              {navigationItems(true)}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <main className="relative min-w-0">
        <div
          ref={railHandleAnchorRef}
          className="sticky top-[calc(50svh-1.75rem)] z-40 hidden h-0 w-0 min-[1024px]:block"
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-[3.5rem] w-[1.75rem] overflow-hidden rounded-r-full focus-within:overflow-visible",
              railHandleVisible ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            <button
              type="button"
              className={cn(
                "absolute inset-0 grid cursor-pointer place-items-center rounded-r-full border-0 bg-(--brand-background) pr-1.5 [color:var(--brand-muted)] transition-transform hover:[color:var(--brand-foreground)] focus-visible:translate-x-0 focus-visible:pointer-events-auto focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--brand-accent) motion-reduce:transition-none [&_svg]:size-[1.125rem]",
                railHandleVisible
                  ? "translate-x-0 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  : "-translate-x-full duration-200 ease-out",
              )}
              onClick={() => setCollapsed((current) => !current)}
              onFocus={() => {
                railHandleFocusedRef.current = true;
                syncRailHandleVisibility();
              }}
              onBlur={() => {
                railHandleFocusedRef.current = false;
                syncRailHandleVisibility();
              }}
              aria-label={collapsed ? "Show sections" : "Hide sections"}
              aria-controls="desktop-brand-guideline-sections"
              aria-expanded={!collapsed}
            >
              {collapsed ? (
                <ChevronRight aria-hidden="true" strokeWidth={1.5} />
              ) : (
                <ChevronLeft aria-hidden="true" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
