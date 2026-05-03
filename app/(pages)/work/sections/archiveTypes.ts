export type WorkCategory = "websites" | "branding";

export type ArchiveImage = {
  id: string;
  src: string;
  alt: string;
  category: WorkCategory;
};

export const workCategories = [
  {
    key: "websites",
    label: "Websites/UI",
  },
  {
    key: "branding",
    label: "Branding",
  },
] as const satisfies readonly {
  key: WorkCategory;
  label: string;
}[];
