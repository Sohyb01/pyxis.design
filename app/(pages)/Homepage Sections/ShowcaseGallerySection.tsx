import Image from "next/image";

const showcaseItems = Array.from({ length: 18 }, (_, index) => ({
  src: `/projects/marquee/${index + 1}.png`,
  alt: `Project showcase ${index + 1}`,
}));

export function ShowcaseGallerySection() {
  return (
    <section
      aria-label="Showcase gallery"
      className="w-full overflow-hidden py-6"
      // className="w-full overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <style>
        {`
          @keyframes showcase-gallery-marquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
      <div className="container mx-auto w-full max-w-none! px-0!">
        <h2 className="sr-only">Showcase gallery</h2>
        <div className="flex w-max animate-[showcase-gallery-marquee_80s_linear_infinite] motion-reduce:paused">
          {[false, true].map((isDuplicate) => (
            <div
              key={isDuplicate ? "duplicate" : "primary"}
              className="flex shrink-0 gap-8 pr-8"
              aria-hidden={isDuplicate}
            >
              {showcaseItems.map((item) => (
                <div
                  key={item.src}
                  className="aspect-video object-center z-1 w-[300px] md:w-[500px] lg:w-[700px] rounded-xl overflow-hidden relative no-scrollbar"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
