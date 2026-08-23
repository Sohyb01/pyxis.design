import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const CUSTOM_TEXT_TYPOGRAPHY_CLASSES = new Set([
  "text-h1",
  "text-h2",
  "text-h3",
  "text-h4",
  "text-h5",
  "text-large",
  "text-lead",
  "text-p",
  "text-p_ui",
  "text-p_ui_medium",
  "text-list",
  "text-body",
  "text-body_medium",
  "text-subtle",
  "text-subtle_medium",
  "text-subtle_semibold",
  "text-small",
  "text-detail",
  "text-badge",
  "text-blockquote",
  "text-table_head",
  "text-table_item",
  "text-kb_shortcut",
  "text-card_title",
]);

const twMerge = extendTailwindMerge({
  experimentalParseClassName({ className, parseClassName }) {
    const parsedClassName = parseClassName(className);

    // Keep custom typography tokens independent from text-color merging.
    if (CUSTOM_TEXT_TYPOGRAPHY_CLASSES.has(parsedClassName.baseClassName)) {
      return {
        ...parsedClassName,
        isExternal: true,
      };
    }

    return parsedClassName;
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
