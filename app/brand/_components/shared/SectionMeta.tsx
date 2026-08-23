type SectionMetaProps = {
  brandName: string;
  section: string;
  index: number;
  total?: number;
};

export function SectionMeta({
  brandName,
  section,
  index,
  total = 9,
}: SectionMetaProps) {
  const current = String(index).padStart(2, "0");
  const count = String(total).padStart(2, "0");

  return (
    <div className="flex min-h-16 items-end justify-between gap-4 border-b border-current/20 pb-1 text-detail text-muted-foreground/70 min-[1024px]:min-h-28">
      <p className="min-w-0 truncate">
        <span className="uppercase">{brandName}</span>{" "}
        <span aria-hidden="true">&middot;</span> {section}
      </p>
      <p className="shrink-0" aria-label={`Section ${index} of ${total}`}>
        {current} / {count}
      </p>
    </div>
  );
}
