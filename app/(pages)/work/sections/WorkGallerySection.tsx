"use client";

import Image from "next/image";
import type { ArchiveImage, WorkCategory } from "./archiveTypes";

export default function WorkGallerySection({
  archiveImages,
  selectedCategory,
}: {
  archiveImages: ArchiveImage[];
  selectedCategory: WorkCategory;
}) {
  const visibleImages = archiveImages.filter(
    (item) => item.category === selectedCategory,
  );

  return (
    <section className="w-full">
      <div className="container mx-auto w-full px-4 pb-16">
        <h2 className="sr-only">Work gallery</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleImages.map((item) => (
            <div
              key={item.id}
              className="relative z-1 aspect-16/9 overflow-hidden rounded-lg border border-border/95 bg-card no-scrollbar"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
