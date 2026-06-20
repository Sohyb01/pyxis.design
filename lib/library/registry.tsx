import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export type LibraryExampleStatus = "placeholder";

export type LibraryEntry = {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  fileName: string;
  status: LibraryExampleStatus;
  description: string;
  keywords: string[];
  href: string;
  source: string;
  previewSrc?: string;
  Example: ComponentType<LibraryExampleProps>;
};

export type LibraryCategory = {
  slug: string;
  name: string;
  description: string;
  accentClass: string;
  softAccentClass: string;
  borderAccentClass: string;
  entries: LibraryEntry[];
};

export type LibraryExampleProps = {
  entry: LibraryEntry;
  category: LibraryCategory;
};

type CategoryDefinition = Omit<LibraryCategory, "entries"> & {
  keywords: string[];
};

const categoryDefinitions: CategoryDefinition[] = [
  {
    slug: "layouts",
    name: "Layouts",
    description: "App shells, sidebars, split panes, focus modes, and canvases.",
    accentClass: "bg-sky-500",
    softAccentClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    borderAccentClass: "border-sky-500/30",
    keywords: ["app shell", "sidebar", "workspace", "pane"],
  },
  {
    slug: "forms",
    name: "Forms",
    description: "Settings, invites, preferences, API keys, and inputs.",
    accentClass: "bg-emerald-500",
    softAccentClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    borderAccentClass: "border-emerald-500/30",
    keywords: ["settings", "input", "preferences", "form"],
  },
  {
    slug: "auth-onboarding",
    name: "Auth & Onboarding",
    description: "Sign-in, signup, magic links, waitlists, and first-run flows.",
    accentClass: "bg-violet-500",
    softAccentClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    borderAccentClass: "border-violet-500/30",
    keywords: ["login", "signup", "onboarding", "auth"],
  },
  {
    slug: "dashboards",
    name: "Dashboards",
    description: "Metric grids, usage summaries, activity feeds, and reports.",
    accentClass: "bg-amber-500",
    softAccentClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    borderAccentClass: "border-amber-500/30",
    keywords: ["metrics", "analytics", "overview", "report"],
  },
  {
    slug: "tables",
    name: "Tables",
    description: "Sortable rows, density controls, bulk actions, and logs.",
    accentClass: "bg-rose-500",
    softAccentClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    borderAccentClass: "border-rose-500/30",
    keywords: ["data", "rows", "table", "logs"],
  },
  {
    slug: "filters",
    name: "Filters",
    description: "Toolbars, faceted popovers, chips, and sidebar filter rails.",
    accentClass: "bg-cyan-500",
    softAccentClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    borderAccentClass: "border-cyan-500/30",
    keywords: ["toolbar", "chips", "facets", "filter"],
  },
  {
    slug: "empty-states",
    name: "Empty states",
    description: "Zero-data screens, no-results states, and end-of-list moments.",
    accentClass: "bg-lime-500",
    softAccentClass: "bg-lime-500/10 text-lime-700 dark:text-lime-300",
    borderAccentClass: "border-lime-500/30",
    keywords: ["empty", "zero", "no results", "first run"],
  },
  {
    slug: "settings",
    name: "Settings",
    description: "Profile, appearance, billing, integrations, and security.",
    accentClass: "bg-indigo-500",
    softAccentClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    borderAccentClass: "border-indigo-500/30",
    keywords: ["profile", "billing", "security", "preferences"],
  },
  {
    slug: "cards",
    name: "Cards",
    description: "Stat tiles, list items, compact surfaces, and rich cards.",
    accentClass: "bg-orange-500",
    softAccentClass: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    borderAccentClass: "border-orange-500/30",
    keywords: ["tile", "surface", "card", "list"],
  },
  {
    slug: "modals",
    name: "Modals",
    description: "Dialogs, drawers, command palettes, and confirmations.",
    accentClass: "bg-fuchsia-500",
    softAccentClass: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    borderAccentClass: "border-fuchsia-500/30",
    keywords: ["dialog", "drawer", "command", "modal"],
  },
  {
    slug: "charts",
    name: "Charts",
    description: "Area, bar, donut, funnel, heatmap, and gauge displays.",
    accentClass: "bg-teal-500",
    softAccentClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    borderAccentClass: "border-teal-500/30",
    keywords: ["chart", "graph", "svg", "metrics"],
  },
  {
    slug: "timelines",
    name: "Timelines",
    description: "Audit trails, changelogs, deploy history, and activity feeds.",
    accentClass: "bg-blue-500",
    softAccentClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    borderAccentClass: "border-blue-500/30",
    keywords: ["audit", "changelog", "history", "activity"],
  },
  {
    slug: "calendars",
    name: "Calendars",
    description: "Month grids, week schedules, agenda lists, and heatmaps.",
    accentClass: "bg-red-500",
    softAccentClass: "bg-red-500/10 text-red-700 dark:text-red-300",
    borderAccentClass: "border-red-500/30",
    keywords: ["month", "week", "agenda", "date"],
  },
  {
    slug: "profile",
    name: "Profile",
    description: "User pages, hover cards, team grids, and presence rails.",
    accentClass: "bg-purple-500",
    softAccentClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    borderAccentClass: "border-purple-500/30",
    keywords: ["user", "team", "presence", "profile"],
  },
  {
    slug: "toasts-banners",
    name: "Toasts & banners",
    description: "Ephemeral feedback, confirmations, retries, and progress.",
    accentClass: "bg-yellow-500",
    softAccentClass: "bg-yellow-500/10 text-yellow-800 dark:text-yellow-300",
    borderAccentClass: "border-yellow-500/30",
    keywords: ["toast", "banner", "feedback", "notification"],
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Tier comparisons, sliders, contact sales, and billing toggles.",
    accentClass: "bg-pink-500",
    softAccentClass: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
    borderAccentClass: "border-pink-500/30",
    keywords: ["pricing", "billing", "plans", "tiers"],
  },
  {
    slug: "tours-coachmarks",
    name: "Tours & coachmarks",
    description: "Welcome modals, spotlights, beacons, and onboarding hints.",
    accentClass: "bg-green-500",
    softAccentClass: "bg-green-500/10 text-green-700 dark:text-green-300",
    borderAccentClass: "border-green-500/30",
    keywords: ["tour", "hint", "beacon", "welcome"],
  },
  {
    slug: "threads-comments",
    name: "Threads & comments",
    description: "Inline threads, side panels, reactions, and rich composers.",
    accentClass: "bg-slate-500",
    softAccentClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    borderAccentClass: "border-slate-500/30",
    keywords: ["comments", "threads", "composer", "mentions"],
  },
];

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function createPlaceholderSource(category: CategoryDefinition) {
  const componentName = `${toPascalCase(category.name)}Placeholder`;

  return `export function ${componentName}() {
  return (
    <section className="grid h-dvh w-dvw place-items-center overflow-hidden bg-background text-foreground">
      <div className="max-w-sm text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          ${category.name}
        </p>
        <h1 className="mt-3 text-4xl font-semibold">
          Placeholder example
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Replace this screen with a real ${category.name.toLowerCase()} component.
        </p>
      </div>
    </section>
  );
}
`;
}

function PlaceholderExample({ entry, category }: LibraryExampleProps) {
  return (
    <section className="relative h-dvh w-dvw overflow-hidden bg-background text-foreground">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.12),transparent_30%),radial-gradient(circle_at_72%_78%,rgba(14,165,233,0.12),transparent_34%)]" />
      <div className="relative flex h-full items-center justify-center p-6">
        <div
          className={cn(
            "w-full max-w-[560px] rounded-[8px] border bg-background/80 p-6 text-center shadow-2xl shadow-black/5 backdrop-blur-xl dark:bg-background/70 dark:shadow-black/30",
            category.borderAccentClass,
          )}
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-[8px] border border-border bg-muted">
            <span className={cn("size-3 rounded-full", category.accentClass)} />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            {category.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            {entry.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {entry.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em]",
                category.softAccentClass,
              )}
            >
              placeholder
            </span>
            <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {entry.fileName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export const libraryCategories: LibraryCategory[] = categoryDefinitions.map(
  (category) => {
    const slug = `${category.slug}-placeholder`;
    const title = `${category.name} placeholder`;
    const entry: LibraryEntry = {
      id: `${category.slug}/${slug}`,
      categorySlug: category.slug,
      slug,
      title,
      fileName: `${slug}.tsx`,
      status: "placeholder",
      description: `This full-screen ${category.name.toLowerCase()} placeholder proves the library navigation before real examples are added.`,
      keywords: [...category.keywords, category.name, slug, "placeholder"],
      href: `/libary/${category.slug}/${slug}`,
      source: createPlaceholderSource(category),
      Example: PlaceholderExample,
    };

    return {
      slug: category.slug,
      name: category.name,
      description: category.description,
      accentClass: category.accentClass,
      softAccentClass: category.softAccentClass,
      borderAccentClass: category.borderAccentClass,
      entries: [entry],
    };
  },
);

export const libraryEntries: LibraryEntry[] = libraryCategories.flatMap(
  (category) => category.entries,
);

const categoryMap = new Map(
  libraryCategories.map((category) => [category.slug, category]),
);

const entryMap = new Map(
  libraryEntries.map((entry) => [`${entry.categorySlug}/${entry.slug}`, entry]),
);

export function getLibraryCategory(slug: string) {
  return categoryMap.get(slug) ?? null;
}

export function getLibraryEntry(categorySlug: string, entrySlug: string) {
  return entryMap.get(`${categorySlug}/${entrySlug}`) ?? null;
}

export function getLibraryEntryCategory(entry: LibraryEntry) {
  return getLibraryCategory(entry.categorySlug);
}
