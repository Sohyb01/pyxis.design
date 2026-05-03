import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-neutral-200 text-neutral-500 shadow-sm dark:bg-neutral-800 dark:text-neutral-400",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.38)_45%,transparent_46%)]" />
      <div className="absolute inset-4 rounded-lg border border-white/40 dark:border-white/10" />
      <span className="absolute bottom-3 left-3 text-xs font-medium">
        {label}
      </span>
    </div>
  );
}
