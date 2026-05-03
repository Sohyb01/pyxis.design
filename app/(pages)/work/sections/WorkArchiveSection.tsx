"use client";

import { useState } from "react";
import type { ArchiveImage, WorkCategory } from "./archiveTypes";
import WorkGallerySection from "./WorkGallerySection";
import WorkIntroSection from "./WorkIntroSection";

export default function WorkArchiveSection({
  archiveImages,
}: {
  archiveImages: ArchiveImage[];
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<WorkCategory>("websites");

  return (
    <>
      <WorkIntroSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <WorkGallerySection
        archiveImages={archiveImages}
        selectedCategory={selectedCategory}
      />
    </>
  );
}
