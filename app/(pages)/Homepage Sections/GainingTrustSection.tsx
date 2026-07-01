import { CtaActions } from "@/components/custom/CtaActions";
import Image from "next/image";

export function GainingTrustSection() {
  return (
    <section className="w-full relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-y-4 w-full justify-center px-4 py-20 gap-x-8">
        <div className="relative size-20 lg:size-50 opacity-10 me-auto lg:ms-auto">
          <Image src="/logos/logomark-black.svg" fill alt="" />
        </div>
        <div className="space-y-8 max-w-3xl lg:max-w-4xl me-auto flex flex-col items-start">
          <h1 className="text-2xl md:text-3xl font-normal text-pretty">
            Work with a senior team that shapes the story, builds the product,
            and sweats every detail, so your next launch feels credible, fast,
            and ready to convert.
          </h1>
          {/* <CtaActions /> */}
        </div>
      </div>
    </section>
  );
}
