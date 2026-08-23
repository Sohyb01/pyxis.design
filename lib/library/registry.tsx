import type { ComponentType } from "react";

export type LibraryExampleStatus = "ready" | "placeholder";

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
  source?: string;
  sourcePath?: string;
  previewSrc?: string;
  Example: ComponentType<LibraryExampleProps>;
};

export type LibraryCategory = {
  slug: string;
  name: string;
  description: string;
  entries: LibraryEntry[];
};

export type LibraryExampleProps = {
  entry: LibraryEntry;
  category: LibraryCategory;
};

export type LibraryComponentDefinition = {
  categorySlug: string;
  slug: string;
  name: string;
  description: string;
  keywords?: string[];
  sourcePath: string;
  previewSrc?: string;
  Component: ComponentType<LibraryExampleProps>;
};

type CategoryDefinition = Omit<LibraryCategory, "entries"> & {
  keywords: string[];
};

const categoryDefinitions: CategoryDefinition[] = [
  {
    slug: "layouts",
    name: "Layouts",
    description: "App shells, sidebars, split panes, focus modes, and canvases.",
    keywords: ["app shell", "sidebar", "workspace", "pane"],
  },
  {
    slug: "forms",
    name: "Forms",
    description: "Settings, invites, preferences, API keys, and inputs.",
    keywords: ["settings", "input", "preferences", "form"],
  },
  {
    slug: "auth-onboarding",
    name: "Auth & Onboarding",
    description: "Sign-in, signup, magic links, waitlists, and first-run flows.",
    keywords: ["login", "signup", "onboarding", "auth"],
  },
  {
    slug: "dashboards",
    name: "Dashboards",
    description: "Metric grids, usage summaries, activity feeds, and reports.",
    keywords: ["metrics", "analytics", "overview", "report"],
  },
  {
    slug: "tables",
    name: "Tables",
    description: "Sortable rows, density controls, bulk actions, and logs.",
    keywords: ["data", "rows", "table", "logs"],
  },
  {
    slug: "filters",
    name: "Filters",
    description: "Toolbars, faceted popovers, chips, and sidebar filter rails.",
    keywords: ["toolbar", "chips", "facets", "filter"],
  },
  {
    slug: "empty-states",
    name: "Empty states",
    description: "Zero-data screens, no-results states, and end-of-list moments.",
    keywords: ["empty", "zero", "no results", "first run"],
  },
  {
    slug: "settings",
    name: "Settings",
    description: "Profile, appearance, billing, integrations, and security.",
    keywords: ["profile", "billing", "security", "preferences"],
  },
  {
    slug: "cards",
    name: "Cards",
    description: "Stat tiles, list items, compact surfaces, and rich cards.",
    keywords: ["tile", "surface", "card", "list"],
  },
  {
    slug: "modals",
    name: "Modals",
    description: "Dialogs, drawers, command palettes, and confirmations.",
    keywords: ["dialog", "drawer", "command", "modal"],
  },
  {
    slug: "charts",
    name: "Charts",
    description: "Area, bar, donut, funnel, heatmap, and gauge displays.",
    keywords: ["chart", "graph", "svg", "metrics"],
  },
  {
    slug: "timelines",
    name: "Timelines",
    description: "Audit trails, changelogs, deploy history, and activity feeds.",
    keywords: ["audit", "changelog", "history", "activity"],
  },
  {
    slug: "calendars",
    name: "Calendars",
    description: "Month grids, week schedules, agenda lists, and heatmaps.",
    keywords: ["month", "week", "agenda", "date"],
  },
  {
    slug: "profile",
    name: "Profile",
    description: "User pages, hover cards, team grids, and presence rails.",
    keywords: ["user", "team", "presence", "profile"],
  },
  {
    slug: "toasts-banners",
    name: "Toasts & banners",
    description: "Ephemeral feedback, confirmations, retries, and progress.",
    keywords: ["toast", "banner", "feedback", "notification"],
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Tier comparisons, sliders, contact sales, and billing toggles.",
    keywords: ["pricing", "billing", "plans", "tiers"],
  },
  {
    slug: "tours-coachmarks",
    name: "Tours & coachmarks",
    description: "Welcome modals, spotlights, beacons, and onboarding hints.",
    keywords: ["tour", "hint", "beacon", "welcome"],
  },
  {
    slug: "threads-comments",
    name: "Threads & comments",
    description: "Inline threads, side panels, reactions, and rich composers.",
    keywords: ["comments", "threads", "composer", "mentions"],
  },
];

/*
 * Import library components at the top of this file, then register them here.
 *
 * Example:
 * {
 *   categorySlug: "forms",
 *   slug: "newsletter-signup",
 *   name: "Newsletter signup",
 *   description: "A simple newsletter signup form.",
 *   keywords: ["newsletter", "email"],
 *   sourcePath: "components/library/forms/NewsletterSignup.tsx",
 *   Component: NewsletterSignup,
 * }
 */
const libraryComponentDefinitions: LibraryComponentDefinition[] = [];

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
        <p className="text-detail text-muted-foreground">
          ${category.name}
        </p>
        <h1 className="mt-3 text-h2">
          Placeholder example
        </h1>
        <p className="mt-4 text-p_ui text-muted-foreground">
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
    <section className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-background p-6 text-foreground">
      <div className="w-full max-w-xl border border-border bg-background p-6 text-center">
        <p className="text-detail text-muted-foreground">{category.name}</p>
        <h1 className="mt-3 text-h2">{entry.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-p_ui text-muted-foreground">
          {entry.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-detail text-muted-foreground">
          <span>Placeholder</span>
          <span aria-hidden="true">/</span>
          <span>{entry.fileName}</span>
        </div>
      </div>
    </section>
  );
}

function getSourceFileName(sourcePath: string) {
  const fileName = sourcePath.split(/[\\/]/).at(-1);

  if (!fileName) {
    throw new Error(`Invalid library component source path: "${sourcePath}".`);
  }

  return fileName;
}

function validateComponentDefinitions() {
  const categorySlugs = new Set(
    categoryDefinitions.map((category) => category.slug),
  );
  const entryIds = new Set<string>();

  libraryComponentDefinitions.forEach((definition) => {
    if (!categorySlugs.has(definition.categorySlug)) {
      throw new Error(
        `Unknown library category "${definition.categorySlug}" for "${definition.name}".`,
      );
    }

    const id = `${definition.categorySlug}/${definition.slug}`;

    if (entryIds.has(id)) {
      throw new Error(`Duplicate library component registration: "${id}".`);
    }

    entryIds.add(id);
  });
}

function createComponentEntry(
  definition: LibraryComponentDefinition,
  category: CategoryDefinition,
): LibraryEntry {
  return {
    id: `${definition.categorySlug}/${definition.slug}`,
    categorySlug: definition.categorySlug,
    slug: definition.slug,
    title: definition.name,
    fileName: getSourceFileName(definition.sourcePath),
    status: "ready",
    description: definition.description,
    keywords: [...category.keywords, ...(definition.keywords ?? [])],
    href: `/library/${definition.categorySlug}/${definition.slug}`,
    sourcePath: definition.sourcePath,
    previewSrc: definition.previewSrc,
    Example: definition.Component,
  };
}

function createPlaceholderEntry(category: CategoryDefinition): LibraryEntry {
  const slug = `${category.slug}-placeholder`;

  return {
    id: `${category.slug}/${slug}`,
    categorySlug: category.slug,
    slug,
    title: `${category.name} placeholder`,
    fileName: `${slug}.tsx`,
    status: "placeholder",
    description: `This full-screen ${category.name.toLowerCase()} placeholder proves the library navigation before real examples are added.`,
    keywords: [...category.keywords, category.name, slug, "placeholder"],
    href: `/library/${category.slug}/${slug}`,
    source: createPlaceholderSource(category),
    Example: PlaceholderExample,
  };
}

validateComponentDefinitions();

export const libraryCategories: LibraryCategory[] = categoryDefinitions.map(
  (category) => {
    const entries = libraryComponentDefinitions
      .filter((definition) => definition.categorySlug === category.slug)
      .map((definition) => createComponentEntry(definition, category));

    return {
      slug: category.slug,
      name: category.name,
      description: category.description,
      entries: entries.length > 0 ? entries : [createPlaceholderEntry(category)],
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
