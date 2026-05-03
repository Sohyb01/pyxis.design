import { cn } from "@/lib/utils";
import { CtaActions } from "@/components/custom/CtaActions";
import BackgroundGraphic from "@/components/custom/BackgroundGraphic";
import type { CSSProperties } from "react";
import Image from "next/image";

type WhyStudioSectionStyle = CSSProperties & {
  "--why-studio-icon-stroke"?: CSSProperties["color"];
};

type WhyStudioSectionProps = {
  className?: string;
  iconClassName?: string;
  iconStrokeColor?: CSSProperties["color"];
  style?: WhyStudioSectionStyle;
};

const features = [
  {
    icon: "/svgs/quality-focused.svg",
    title: "Quality focused",
    body: "Every surface is reviewed with care, from first wireframe to final handoff.",
  },
  {
    icon: "/svgs/precise-builds.svg",
    title: "Precise builds",
    body: "Design systems, responsive states, and interactions are done perfectly.",
  },
  {
    icon: "/svgs/motion-and-brand.svg",
    title: "Motion and brand",
    body: "Illustration, animation, and polish are used to make the products feel alive.",
  },
];

export function WhyStudioSection({
  className,
  iconClassName,
  iconStrokeColor,
  style,
}: WhyStudioSectionProps) {
  const iconStyle = iconStrokeColor
    ? ({ "--why-studio-icon-stroke": iconStrokeColor } as WhyStudioSectionStyle)
    : undefined;
  const sectionStyle =
    style || iconStyle
      ? ({ ...style, ...iconStyle } as WhyStudioSectionStyle)
      : undefined;

  return (
    <section className={cn("w-full", className)} style={sectionStyle}>
      <div className="container mx-auto w-full px-4 py-16 relative">
        <h2 className="pb-8 text-center text-3xl">Why pyxis.studio?</h2>
        <div className="grid gap-8 md:grid-cols-3 gap-y-12 w-fit mx-auto">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "mx-auto flex max-w-xs flex-col items-center text-center gap-2",
              )}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={32}
                height={32}
                className="mb-3"
              />

              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-p_ui">{feature.body}</p>
              <div className="relative w-12 mt-2 opacity-10 mx-auto aspect-[100/53.45]">
                <Image fill src="/logos/logomark-black-half.svg" alt="" />
              </div>
            </article>
          ))}
        </div>
        {/* <CtaActions /> */}
      </div>
    </section>
  );
}
