import Image from "next/image";
import { StarIcon } from "./StarIcon";
import { trustedByLogos } from "./trustedByLogos";

export function TrustedBySection() {
  return (
    <section className="relative w-full py-12">
      <div className="container mx-auto w-full px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="text-xl">Top rated by companies</h2>

          <div className="mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-x-4 md:gap-x-8 gap-y-4">
            {trustedByLogos.map((logo) => (
              <div
                key={logo.name}
                className="relative h-9 w-20 md:h-10 md:w-36 pointer-events-none"
              >
                <Image
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  fill
                  sizes="144px"
                  className="object-contain opacity-55 filter-[grayscale(1)_contrast(0)_brightness(0.7)]"
                />
              </div>
            ))}

            <div className="inline-flex items-center gap-2 rounded-full bg-white p-4 py-2.5 text-sm  border-border border-solid border-[1px]">
              <span>Rated 5 Stars</span>
              <StarIcon />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
