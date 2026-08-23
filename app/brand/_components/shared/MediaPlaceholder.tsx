import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function MediaPlaceholder({
  label = "Media not supplied",
  tone = "light",
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-48 w-full items-center justify-center rounded-sm border border-dashed",
        tone === "dark"
          ? "border-white/30 bg-neutral-950 text-white/60"
          : "border-black/20 bg-neutral-100 text-black/50",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 text-center text-detail">
        <ImageOff className="size-5" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}
