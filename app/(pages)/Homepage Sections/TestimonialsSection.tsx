import Image from "next/image";
import { StarIcon } from "./StarIcon";
import { trustedByLogos } from "./trustedByLogos";

const testimonialQuotes = [
  "The team moved quickly, stayed thoughtful, and gave every revision a level of craft that made the launch feel calm.",
  "They turned a messy product story into a focused interface and shipped the details without dragging the process out.",
  "Fast communication, strong taste, and a rare ability to translate product complexity into something people understand.",
  "Our new site feels sharper and easier to use. The process was direct, collaborative, and refreshingly organized.",
  "They helped us bring a complex AI workflow into a simple dashboard without losing the depth our users needed.",
  "They gave Albetar a fast, clear storefront for laptops, desktops, hardware, and custom builds, making technical products easier to browse, compare, and buy.",
];

const testimonialCompanies = [
  ...trustedByLogos,
  {
    name: "Albetar Store",
    src: "/logos/albetar.svg",
  },
];

const testimonials = testimonialCompanies.map((company, index) => ({
  ...company,
  quote: testimonialQuotes[index],
}));
const ratingStars = Array.from({ length: 5 }, (_, index) => index + 1);

export function TestimonialsSection() {
  return (
    <section className="w-full">
      <div className="container mx-auto w-full px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">Testimonials</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-xl border-solid border-border/95 border-[1px] bg-card p-5 z-1"
            >
              <div
                className="mb-5 flex items-center gap-0"
                role="img"
                aria-label="5 stars"
              >
                {ratingStars.map((star) => (
                  <StarIcon key={star} />
                ))}
              </div>
              <p className="min-h-16 text-sm text-muted-foreground">
                {testimonial.quote}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="relative h-7 w-32">
                  <Image
                    src={testimonial.src}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-contain object-left"
                  />
                </div>
                {/* <p className="text-sm font-semibold">{testimonial.name}</p> */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
