import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const FULL_LOGO_SIZES = {
  black: { width: 302, height: 92 },
  white: { width: 302, height: 92 },
  color: { width: 180, height: 96 },
} as const;

const LOGOMARK_WIDTH = 92;
const LOGOMARK_HEIGHT = 92;

type LogoColor = keyof typeof FULL_LOGO_SIZES;
type LogomarkColor = "black" | "white";

export const Logo = ({
  width,
  height,
  color = "black",
  className,
}: {
  width?: number;
  height?: number;
  color?: LogoColor;
  className?: string;
}) => {
  const logoSize = FULL_LOGO_SIZES[color];
  const resolvedWidth = width ?? (height ? undefined : 103);
  const resolvedHeight = height;

  return (
    <Link
      href="/"
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        aspectRatio: `${logoSize.width} / ${logoSize.height}`,
      }}
      className={cn(className, "relative block")}
    >
      <Image
        fill
        alt="Pyxis Logo"
        src={`/logos/logo-${color}.svg`}
        className="object-contain"
        suppressHydrationWarning
      />
    </Link>
  );
};

export const LogoMark = ({
  width,
  height,
  color = "black",
  className,
}: {
  width?: number;
  height?: number;
  color?: LogomarkColor;
  className?: string;
}) => {
  const resolvedWidth = width ?? (height ? undefined : 40);
  const resolvedHeight = height;

  return (
    <div
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        aspectRatio: `${LOGOMARK_WIDTH} / ${LOGOMARK_HEIGHT}`,
      }}
      className={cn(className, "relative block")}
    >
      <Image
        fill
        alt="Pyxis Logomark"
        src={`/logos/logomark-${color}.svg`}
        className="object-contain"
        suppressHydrationWarning
      />
    </div>
  );
};
