import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import Grainient from "@/components/custom/Grainient";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "duration-200 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-background/90 border-solid border-[1px] border-border/95 hover:border-border/95/90",
        grainient:
          "relative isolate overflow-hidden border-0 bg-transparent text-white active:brightness-95 focus-visible:ring-white/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const isGrainient = variant === "grainient";
  const renderGrainientContent = (content: React.ReactNode) => (
    <>
      <span className="pointer-events-none absolute -inset-x-16 -inset-y-8 z-0 overflow-hidden">
        <Grainient
          // color1="#7b00a0"
          // color2="#00109e"
          // color3="#000c75"
          color1="#222222"
          color2="#666666"
          color3="#222222"
          timeSpeed={2}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={7}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.2}
          grainScale={1}
          grainAnimated={false}
          contrast={1}
          gamma={0.8}
          saturation={1.5}
          centerX={0}
          centerY={0}
          zoom={0.5}
        />
      </span>
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {content}
      </span>
    </>
  );

  if (asChild && isGrainient && React.isValidElement(children)) {
    const childProps = children.props as { children?: React.ReactNode };

    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {React.cloneElement(
          children,
          undefined,
          renderGrainientContent(childProps.children),
        )}
      </Slot.Root>
    );
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isGrainient ? renderGrainientContent(children) : children}
    </Comp>
  );
}

export { Button, buttonVariants };
