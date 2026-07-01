import Image from "next/image";

const showcaseItems = Array.from({ length: 18 }, (_, index) => ({
  src: `/projects/marquee/${index + 1}.png`,
  alt: `Project showcase ${index + 1}`,
}));

const marqueeImageSizes =
  "(min-width: 1280px) 700px, (min-width: 744px) 500px, 300px";

function ShowcaseStrip({
  ariaHidden,
  className,
}: {
  ariaHidden?: boolean;
  className: string;
}) {
  return (
    <div
      className={`showcase-gallery-strip flex w-max shrink-0 gap-8 pr-8 ${className}`}
      aria-hidden={ariaHidden}
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
            loading="eager"
            sizes={marqueeImageSizes}
            className="object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

export function ShowcaseGallerySection() {
  return (
    <section
      aria-label="Showcase gallery"
      className="w-full py-6"
      // className="w-full overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <style>
        {`
          @keyframes showcase-gallery-marquee {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(-100%, 0, 0);
            }
          }

          @keyframes showcase-gallery-marquee-copy {
            from {
              transform: translate3d(100%, 0, 0);
            }

            to {
              transform: translate3d(0, 0, 0);
            }
          }

          .showcase-gallery-strip {
            backface-visibility: hidden;
            will-change: transform;
          }
        `}
      </style>
      <div className="container mx-auto w-full max-w-none! px-0!">
        <h2 className="sr-only">Showcase gallery</h2>
        <div className="relative w-full">
          <ShowcaseStrip className="[animation:showcase-gallery-marquee_80s_linear_infinite] motion-reduce:animate-none" />
          <ShowcaseStrip
            ariaHidden
            className="absolute left-0 top-0 [animation:showcase-gallery-marquee-copy_80s_linear_infinite] motion-reduce:hidden"
          />
        </div>
      </div>
    </section>
  );
}
