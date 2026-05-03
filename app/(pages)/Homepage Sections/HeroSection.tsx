import { CtaActions } from "@/components/custom/CtaActions";

export function HeroSection() {
  return (
    <section className="w-full relative">
      <div className="container mx-auto flex w-full flex-col items-center px-4 pb-12 pt-24 text-center">
        <h1 className="max-w-3xl text-4xl font-semibold">
          Full-stack design and dev studio <br />
          for high-growth startups{" "}
        </h1>
        <p className="mt-5 max-w-xl text-p text-muted-foreground">
          A quality-obsessed product studio that gets things shipped.
        </p>
        <CtaActions className="mt-6" />
      </div>
    </section>
  );
}
