"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Code2,
  Copy,
  Grid2X2,
  List,
  Moon,
  Search,
  Shuffle,
  Sun,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, ReactNode, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import {
  getLibraryCategory,
  getLibraryEntry,
  libraryCategories,
  libraryEntries,
  type LibraryCategory,
  type LibraryEntry,
} from "@/lib/library/registry";

type CatalogLayout = "grid" | "stack";
type LibraryTheme = "light" | "dark";

type LibraryBrowserProps = {
  entrySources: Record<string, string>;
  initialCategorySlug: string | null;
  initialEntrySlug: string | null;
};

const layoutStorageKey = "pyxis-libary-layout";
const themeStorageKey = "pyxis-libary-theme";

const entryById = new Map(libraryEntries.map((entry) => [entry.id, entry]));

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getEntryCategory(entry: LibraryEntry) {
  return getLibraryCategory(entry.categorySlug);
}

function parseEntryIdFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 1 && parts[0] === "library") {
    return null;
  }

  if (parts.length !== 3 || parts[0] !== "library") {
    return null;
  }

  return getLibraryEntry(parts[1] ?? "", parts[2] ?? "")?.id ?? null;
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function getPreviewSources(entries: LibraryEntry[]) {
  return entries.flatMap((entry) =>
    entry.previewSrc ? [entry.previewSrc] : [],
  );
}

function readStoredLayout(): CatalogLayout {
  if (typeof window === "undefined") {
    return "grid";
  }

  const storedLayout = window.localStorage.getItem(layoutStorageKey);

  return storedLayout === "grid" || storedLayout === "stack"
    ? storedLayout
    : "grid";
}

function readStoredTheme(): LibraryTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function LibraryBrowser({
  entrySources,
  initialCategorySlug,
  initialEntrySlug,
}: LibraryBrowserProps) {
  const initialEntry =
    initialCategorySlug && initialEntrySlug
      ? getLibraryEntry(initialCategorySlug, initialEntrySlug)
      : null;
  const [activeEntryId, setActiveEntryId] = useState<string | null>(
    initialEntry?.id ?? null,
  );
  const [catalogLayout, setCatalogLayout] = useState<CatalogLayout>("grid");
  const [theme, setTheme] = useState<LibraryTheme>("light");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [copiedSource, setCopiedSource] = useState(false);
  const preferencesLoadedRef = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeEntry = activeEntryId
    ? (entryById.get(activeEntryId) ?? null)
    : null;
  const activeCategory = activeEntry ? getEntryCategory(activeEntry) : null;

  const searchableEntries = useMemo(
    () =>
      libraryEntries.map((entry) => ({
        entry,
        category: getEntryCategory(entry),
      })),
    [],
  );

  const filteredSearchEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchableEntries;
    }

    return searchableEntries.filter(({ entry, category }) => {
      const haystack = [
        entry.title,
        entry.slug,
        entry.fileName,
        entry.description,
        category?.name ?? "",
        category?.slug ?? "",
        ...entry.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchQuery, searchableEntries]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const navigateToEntry = useCallback(
    (entry: LibraryEntry, options?: { replace?: boolean }) => {
      setActiveEntryId(entry.id);
      setIsSearchOpen(false);
      setIsCodeOpen(false);
      setCopiedSource(false);

      if (options?.replace) {
        window.history.replaceState(
          { entryId: entry.id, libary: true },
          "",
          entry.href,
        );
        return;
      }

      window.history.pushState(
        { entryId: entry.id, libary: true },
        "",
        entry.href,
      );
    },
    [],
  );

  const navigateHome = useCallback(() => {
    setActiveEntryId(null);
    setIsSearchOpen(false);
    setIsCodeOpen(false);
    setCopiedSource(false);

    window.history.replaceState(
      { entryId: null, libary: true },
      "",
      "/library",
    );
  }, []);

  const navigateByOffset = useCallback(
    (offset: number) => {
      if (libraryEntries.length === 0) {
        return;
      }

      const currentIndex = activeEntry
        ? libraryEntries.findIndex((entry) => entry.id === activeEntry.id)
        : -1;
      const nextIndex = wrapIndex(
        (currentIndex === -1 ? 0 : currentIndex) + offset,
        libraryEntries.length,
      );
      const nextEntry = libraryEntries[nextIndex];

      if (nextEntry) {
        navigateToEntry(nextEntry);
      }
    },
    [activeEntry, navigateToEntry],
  );

  const navigateByCategoryOffset = useCallback(
    (offset: number) => {
      if (libraryCategories.length === 0) {
        return;
      }

      const currentIndex = activeCategory
        ? libraryCategories.findIndex(
            (category) => category.slug === activeCategory.slug,
          )
        : -1;
      const nextCategoryIndex = wrapIndex(
        (currentIndex === -1 ? 0 : currentIndex) + offset,
        libraryCategories.length,
      );
      const nextEntry = libraryCategories[nextCategoryIndex]?.entries[0];

      if (nextEntry) {
        navigateToEntry(nextEntry);
      }
    },
    [activeCategory, navigateToEntry],
  );

  const navigateRandom = useCallback(() => {
    const randomPool =
      activeEntry && libraryEntries.length > 1
        ? libraryEntries.filter((entry) => entry.id !== activeEntry.id)
        : libraryEntries;
    const nextEntry =
      randomPool[Math.floor(Math.random() * randomPool.length)] ??
      libraryEntries[0];

    if (nextEntry) {
      navigateToEntry(nextEntry);
    }
  }, [activeEntry, navigateToEntry]);

  const closeOrBack = useCallback(() => {
    if (activeEntry) {
      navigateHome();
      return;
    }

    if (isSearchOpen) {
      setIsSearchOpen(false);
      return;
    }

    if (isCodeOpen) {
      setIsCodeOpen(false);
    }
  }, [activeEntry, isCodeOpen, isSearchOpen, navigateHome]);

  const openSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedSearchIndex(0);
    setIsSearchOpen(true);
  }, []);

  const updateSearchQuery = useCallback((nextQuery: string) => {
    setSearchQuery(nextQuery);
    setSelectedSearchIndex(0);
  }, []);

  const openCode = useCallback(() => {
    if (activeEntry) {
      setCopiedSource(false);
      setIsCodeOpen(true);
    }
  }, [activeEntry]);

  const copySource = useCallback(async () => {
    if (!activeEntry) {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(
        entrySources[activeEntry.id] ?? "",
      );
      setCopiedSource(true);
      window.setTimeout(() => setCopiedSource(false), 1400);
    } catch {
      setCopiedSource(false);
    }
  }, [activeEntry, entrySources]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      preferencesLoadedRef.current = true;
      setCatalogLayout(readStoredLayout());
      setTheme(readStoredTheme());
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (preferencesLoadedRef.current) {
      window.localStorage.setItem(layoutStorageKey, catalogLayout);
    }
  }, [catalogLayout]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.libaryTheme = theme;

    if (preferencesLoadedRef.current) {
      window.localStorage.setItem(themeStorageKey, theme);
    }
  }, [theme]);

  useEffect(() => {
    document.title = activeEntry
      ? `${activeEntry.title} | pyxis.design`
      : "Libary | pyxis.design";
  }, [activeEntry]);

  useEffect(() => {
    const currentEntryId = parseEntryIdFromPath(window.location.pathname);

    window.history.replaceState(
      { entryId: currentEntryId, libary: true },
      "",
      window.location.href,
    );

    const handlePopState = () => {
      setIsSearchOpen(false);
      setIsCodeOpen(false);
      setCopiedSource(false);
      setActiveEntryId(parseEntryIdFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const activeIndex = activeEntry
      ? libraryEntries.findIndex((entry) => entry.id === activeEntry.id)
      : -1;
    const adjacentEntries =
      activeIndex === -1
        ? libraryEntries.slice(0, 3)
        : [
            libraryEntries[wrapIndex(activeIndex - 1, libraryEntries.length)],
            libraryEntries[activeIndex],
            libraryEntries[wrapIndex(activeIndex + 1, libraryEntries.length)],
          ].filter((entry): entry is LibraryEntry => Boolean(entry));
    const immediateSources = getPreviewSources(adjacentEntries);

    immediateSources.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const allSources = getPreviewSources(libraryEntries).filter(
      (src) => !immediateSources.includes(src),
    );

    if (allSources.length === 0) {
      return;
    }

    const idleId = window.requestIdleCallback?.(() => {
      allSources.forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    });

    return () => {
      if (idleId) {
        window.cancelIdleCallback?.(idleId);
      }
    };
  }, [activeEntry]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeOrBack();
        return;
      }

      if (
        isEditableTarget(event.target) ||
        isSearchOpen ||
        isCodeOpen ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && activeEntry) {
        event.preventDefault();
        navigateByOffset(-1);
        return;
      }

      if (event.key === "ArrowRight" && activeEntry) {
        event.preventDefault();
        navigateByOffset(1);
        return;
      }

      if (event.key === "ArrowUp" && activeEntry) {
        event.preventDefault();
        navigateByCategoryOffset(-1);
        return;
      }

      if (event.key === "ArrowDown" && activeEntry) {
        event.preventDefault();
        navigateByCategoryOffset(1);
        return;
      }

      if (key === "r") {
        event.preventDefault();
        navigateRandom();
        return;
      }

      if (key === "t") {
        event.preventDefault();
        toggleTheme();
        return;
      }

      if (key === "c" && activeEntry) {
        event.preventDefault();
        openCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeEntry,
    closeOrBack,
    isCodeOpen,
    isSearchOpen,
    navigateByCategoryOffset,
    navigateByOffset,
    navigateRandom,
    openCode,
    openSearch,
    toggleTheme,
  ]);

  const safeSelectedSearchIndex = Math.min(
    selectedSearchIndex,
    Math.max(0, filteredSearchEntries.length - 1),
  );

  if (activeEntry && activeCategory) {
    const Example = activeEntry.Example;

    return (
      <div
        className="fixed inset-0 overflow-hidden bg-background text-foreground"
        data-libary-detail
      >
        <Example entry={activeEntry} category={activeCategory} />
        <DetailControls
          onBack={closeOrBack}
          onCode={openCode}
          onNext={() => navigateByOffset(1)}
          onPrevious={() => navigateByOffset(-1)}
          onRandom={navigateRandom}
          onTheme={toggleTheme}
          onNextCategory={() => navigateByCategoryOffset(1)}
          onPreviousCategory={() => navigateByCategoryOffset(-1)}
        />
        <SearchDialog
          entries={filteredSearchEntries}
          isOpen={isSearchOpen}
          query={searchQuery}
          selectedIndex={safeSelectedSearchIndex}
          searchInputRef={searchInputRef}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={navigateToEntry}
          onQueryChange={updateSearchQuery}
          onSelectedIndexChange={setSelectedSearchIndex}
        />
        <CodeDialog
          copied={copiedSource}
          entry={activeEntry}
          isOpen={isCodeOpen}
          source={entrySources[activeEntry.id] ?? ""}
          onClose={() => setIsCodeOpen(false)}
          onCopy={copySource}
        />
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <HomeHeader
        catalogLayout={catalogLayout}
        theme={theme}
        onLayoutChange={setCatalogLayout}
        onRandom={navigateRandom}
        onSearch={openSearch}
        onTheme={toggleTheme}
      />
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="mt-4 text-h2">Libary.</h1>
          <p className="mt-4 max-w-2xl text-p_ui text-muted-foreground">
            Empty component catalogs with devl-style browsing, full-screen
            previews, search, and keyboard-first navigation.
          </p>
        </div>

        <div className="mt-12 grid gap-10">
          {libraryCategories.map((category) => (
            <CategorySection
              key={category.slug}
              category={category}
              catalogLayout={catalogLayout}
              onNavigate={navigateToEntry}
            />
          ))}
        </div>
      </section>
      <SearchDialog
        entries={filteredSearchEntries}
        isOpen={isSearchOpen}
        query={searchQuery}
        selectedIndex={safeSelectedSearchIndex}
        searchInputRef={searchInputRef}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigateToEntry}
        onQueryChange={updateSearchQuery}
        onSelectedIndexChange={setSelectedSearchIndex}
      />
    </main>
  );
}

function HomeHeader({
  catalogLayout,
  theme,
  onLayoutChange,
  onRandom,
  onSearch,
  onTheme,
}: {
  catalogLayout: CatalogLayout;
  theme: LibraryTheme;
  onLayoutChange: (layout: CatalogLayout) => void;
  onRandom: () => void;
  onSearch: () => void;
  onTheme: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <span className="truncate text-subtle_semibold">Pyxis libary</span>
          <span className="hidden text-detail text-muted-foreground lg:inline">
            {libraryEntries.length.toString().padStart(2, "0")} files /{" "}
            {libraryCategories.length.toString().padStart(2, "0")} folders
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 md:justify-end">
          <div
            aria-label="Layout"
            className="hidden items-center rounded-md border border-border bg-background p-1 md:flex"
            role="group"
          >
            <Button
              aria-label="Grid view"
              aria-pressed={catalogLayout === "grid"}
              className={cn(
                catalogLayout === "grid" && "bg-foreground text-background",
              )}
              size="icon-xs"
              type="button"
              variant="ghost"
              onClick={() => onLayoutChange("grid")}
            >
              <Grid2X2 className="size-3.5" />
            </Button>
            <Button
              aria-label="Stack view"
              aria-pressed={catalogLayout === "stack"}
              className={cn(
                catalogLayout === "stack" && "bg-foreground text-background",
              )}
              size="icon-xs"
              type="button"
              variant="ghost"
              onClick={() => onLayoutChange("stack")}
            >
              <List className="size-3.5" />
            </Button>
          </div>
          <Button
            className="max-sm:px-2"
            size="sm"
            type="button"
            variant="outline"
            onClick={onSearch}
          >
            <Search className="size-3.5" />
            <span className="max-sm:hidden">Search</span>
            <span className="hidden md:inline">
              <Kbd>Ctrl K</Kbd>
            </span>
          </Button>
          <Button
            aria-label="Random example"
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={onRandom}
          >
            <Shuffle className="size-4" />
          </Button>
          <Button
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={onTheme}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

function CategorySection({
  category,
  catalogLayout,
  onNavigate,
}: {
  category: LibraryCategory;
  catalogLayout: CatalogLayout;
  onNavigate: (entry: LibraryEntry) => void;
}) {
  return (
    <section className="border-t border-border pt-8">
      <div className="mb-6 min-w-0">
        <h2 className="text-h3">{category.name}</h2>
        <p className="mt-2 text-subtle text-muted-foreground">
          {category.description} /{" "}
          {category.entries.length.toString().padStart(2, "0")} files
        </p>
      </div>
      <div
        className={cn(
          catalogLayout === "grid"
            ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            : "grid gap-4",
        )}
      >
        {category.entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            isStack={catalogLayout === "stack"}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}

function EntryCard({
  entry,
  isStack,
  onNavigate,
}: {
  entry: LibraryEntry;
  isStack: boolean;
  onNavigate: (entry: LibraryEntry) => void;
}) {
  return (
    <a
      className={cn(
        "block overflow-clip rounded-md border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isStack && "grid md:grid-cols-2",
      )}
      href={entry.href}
      onClick={(event) => {
        if (isModifiedClick(event)) {
          return;
        }

        event.preventDefault();
        onNavigate(entry);
      }}
    >
      <div className="grid w-full min-h-56 place-items-center overflow-hidden bg-muted">
        <span className="text-detail text-center text-muted-foreground w-full">
          Placeholder
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-large">{entry.title}</h3>
            <p className="mt-1 truncate text-detail text-muted-foreground">
              {entry.fileName}
            </p>
          </div>
          <ArrowRight className="mt-1 size-4 text-muted-foreground" />
        </div>
      </div>
    </a>
  );
}

function DetailControls({
  onBack,
  onCode,
  onNext,
  onNextCategory,
  onPrevious,
  onPreviousCategory,
  onRandom,
  onTheme,
}: {
  onBack: () => void;
  onCode: () => void;
  onNext: () => void;
  onNextCategory: () => void;
  onPrevious: () => void;
  onPreviousCategory: () => void;
  onRandom: () => void;
  onTheme: () => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-end gap-1 rounded-md border border-border bg-background p-1.5">
      <ControlButton label="home" keys={["esc"]} onClick={onBack} />
      <span className="mx-1 hidden h-3 w-px bg-border sm:block" />
      <ControlButton
        icon={<ArrowLeft />}
        label="prev"
        keys={["left"]}
        onClick={onPrevious}
      />
      <ControlButton
        icon={<ArrowRight />}
        label="next"
        keys={["right"]}
        onClick={onNext}
      />
      <span className="mx-1 hidden h-3 w-px bg-border sm:block" />
      <ControlButton
        icon={<ArrowUp />}
        label="prev group"
        keys={["up"]}
        onClick={onPreviousCategory}
      />
      <ControlButton
        icon={<ArrowDown />}
        label="next group"
        keys={["down"]}
        onClick={onNextCategory}
      />
      <span className="mx-1 hidden h-3 w-px bg-border sm:block" />
      <ControlButton label="random" keys={["r"]} onClick={onRandom} />
      <ControlButton label="theme" keys={["t"]} onClick={onTheme} />
      <ControlButton label="code" keys={["c"]} onClick={onCode} />
    </div>
  );
}

function ControlButton({
  icon,
  keys,
  label,
  onClick,
}: {
  icon?: ReactNode;
  keys: string[];
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      className="text-muted-foreground hover:text-foreground flex gap-1 items-center"
      size="xs"
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      {icon ?? keys.map((key) => <Kbd key={key}>{key}</Kbd>)}
      <span className="hidden sm:inline pt-0.5">{label}</span>
    </Button>
  );
}

function SearchDialog({
  entries,
  isOpen,
  onClose,
  onNavigate,
  onQueryChange,
  onSelectedIndexChange,
  query,
  searchInputRef,
  selectedIndex,
}: {
  entries: Array<{ entry: LibraryEntry; category: LibraryCategory | null }>;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (entry: LibraryEntry) => void;
  onQueryChange: (query: string) => void;
  onSelectedIndexChange: (index: number) => void;
  query: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedIndex: number;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background p-4">
      <button
        aria-label="Close search"
        className="absolute inset-0 cursor-default"
        type="button"
        onClick={onClose}
      />
      <div
        aria-label="Search every component"
        className="relative mx-auto mt-20 flex max-h-[min(680px,calc(100dvh-8rem))] w-full max-w-2xl flex-col overflow-hidden rounded-md border border-border bg-background"
        role="dialog"
      >
        <div className="flex items-center gap-3 border-b border-border p-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            aria-label="Search every component"
            autoFocus
            className="h-10 border-0 px-0 shadow-none focus-visible:ring-0"
            placeholder="Search every placeholder..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                onSelectedIndexChange(
                  wrapIndex(selectedIndex + 1, Math.max(entries.length, 1)),
                );
                return;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                onSelectedIndexChange(
                  wrapIndex(selectedIndex - 1, Math.max(entries.length, 1)),
                );
                return;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                const selectedEntry = entries[selectedIndex]?.entry;

                if (selectedEntry) {
                  onNavigate(selectedEntry);
                }
                return;
              }
            }}
          />
          <Button
            aria-label="Close search"
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="min-h-0 overflow-y-auto p-2">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-subtle text-muted-foreground">
              No placeholders found.
            </div>
          ) : (
            entries.map(({ entry, category }, index) => (
              <button
                key={entry.id}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-md px-3 py-3 text-left",
                  index === selectedIndex
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                type="button"
                onMouseEnter={() => onSelectedIndexChange(index)}
                onClick={() => onNavigate(entry)}
              >
                <span className="min-w-0">
                  <span className="block truncate text-subtle_semibold">
                    {entry.title}
                  </span>
                  <span className="mt-1 block truncate text-detail">
                    {category?.name ?? "Unknown"} / {entry.fileName}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-detail text-muted-foreground">
          <span>Up Down navigate</span>
          <span>{libraryEntries.length} files</span>
        </div>
      </div>
    </div>
  );
}

function CodeDialog({
  copied,
  entry,
  isOpen,
  onClose,
  onCopy,
  source,
}: {
  copied: boolean;
  entry: LibraryEntry;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  source: string;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background p-4">
      <button
        aria-label="Close code"
        className="absolute inset-0 cursor-default"
        type="button"
        onClick={onClose}
      />
      <div
        aria-label={`${entry.title} source`}
        className="relative mx-auto flex h-[min(760px,calc(100dvh-4rem))] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-border bg-background"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <div className="min-w-0">
            <h2 className="truncate text-large">{entry.title}</h2>
            <p className="truncate text-detail text-muted-foreground">
              {entry.fileName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onCopy}>
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy code"}
            </Button>
            <Button
              aria-label="Close code"
              size="icon-sm"
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
        <pre className="min-h-0 flex-1 overflow-auto bg-muted p-5 font-mono text-detail text-foreground">
          <code>{source}</code>
        </pre>
        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-detail text-muted-foreground">
          <span>Install real examples later</span>
          <span className="inline-flex items-center gap-1">
            <Code2 className="size-3" />
            placeholder source
          </span>
        </div>
      </div>
    </div>
  );
}
