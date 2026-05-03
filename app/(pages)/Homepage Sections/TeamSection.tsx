import Grainient from "@/components/custom/Grainient";
import { ImagePlaceholder } from "./ImagePlaceholder";
import Image from "next/image";

const team = [
  ["Suhayb", "Web Designer, Full-stack dev"],
  ["Jonah", "Brand designer & strategist"],
];

export function TeamSection() {
  return (
    <section className="w-full">
      <div className="container mx-auto w-full px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">Our Team</h2>
        </div>
        <div className="flex flex-wrap gap-8 items-center justify-center">
          {/* Person 1 */}
          <article className="flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative aspect-square size-28 bg-muted rounded-xl border overflow-hidden border-border/95 border-solid border-[1px]">
              <Image fill src="/team/suhayb.png" alt="Suhayb" />
            </div>
            <div className="space-y-0 pt-4">
              <h3 className="text-p_ui font-semibold">Suhayb</h3>
              <p className="text-p_ui font-normal text-muted-foreground">
                Web designer
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
