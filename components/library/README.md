# Adding a component to the library

Library components are normal React components. The library imports the
component directly, so edits are reflected through the normal Next.js
development refresh.

## 1. Create the component

Place it inside a folder matching an existing library category:

```text
components/library/forms/NewsletterSignup.tsx
```

Export the component:

```tsx
export default function NewsletterSignup() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <form>{/* Component implementation */}</form>
    </main>
  );
}
```

Library examples run inside the client-side browser. They may use hooks and
browser APIs, but should not import server-only code.

## 2. Register the component

Open `lib/library/registry.tsx`.

Import the component at the top:

```tsx
import NewsletterSignup from "@/components/library/forms/NewsletterSignup";
```

Then add its metadata to `libraryComponentDefinitions`:

```tsx
const libraryComponentDefinitions: LibraryComponentDefinition[] = [
  {
    categorySlug: "forms",
    slug: "newsletter-signup",
    name: "Newsletter signup",
    description: "A simple newsletter signup form.",
    keywords: ["newsletter", "email"],
    sourcePath: "components/library/forms/NewsletterSignup.tsx",
    Component: NewsletterSignup,
  },
];
```

The `sourcePath` must point to the same TSX file and must remain inside
`components/library`.

## 3. Open the component

Run the development server and visit:

```text
/library/forms/newsletter-signup
```

The component also appears under the Forms category and in search. Its first
registration replaces that category's placeholder. Further registrations in
the same category appear alongside it.

The component is rendered from the imported TSX module. The code dialog reads
the same TSX file, so the rendered example and displayed source do not require
separate copies.

## Adding a category

Add a category object to `categoryDefinitions` in
`lib/library/registry.tsx`, then use its `slug` as the component's
`categorySlug`.

```tsx
{
  slug: "navigation",
  name: "Navigation",
  description: "Navbars, menus, breadcrumbs, and navigation patterns.",
  keywords: ["navbar", "menu", "breadcrumbs"],
}
```

The registry reports a clear error for an unknown category, a duplicate
category/entry slug pair, a missing source file, or a source file outside the
library component folder.
