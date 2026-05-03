"use client";

import { Button } from "@/components/ui/button";
import type { WorkCategory } from "./archiveTypes";
import { workCategories } from "./archiveTypes";

export default function WorkIntroSection({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: WorkCategory;
  onCategoryChange: (category: WorkCategory) => void;
}) {
  return (
    <section className="w-full">
      <div className="container mx-auto flex w-full flex-col items-center px-4 py-16 pb-12 lg:pt-24 text-center">
        <h1 className="mt-4 text-4xl">Work archive</h1>
        <p className="mt-4 max-w-xl text-sm">
          A closer look at websites, brand directions, <br />
          interface studies, and visual systems.
        </p>
        <div className="mt-6 flex w-full items-center justify-center gap-2">
          {workCategories.map((category) => {
            const isSelected = category.key === selectedCategory;

            return (
              <Button
                key={category.key}
                type="button"
                onClick={() => onCategoryChange(category.key)}
                variant={isSelected ? "secondary" : "outline"}
                size="sm"
                className="z-1"
                aria-pressed={isSelected}
              >
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
