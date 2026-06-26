import type { ReactNode } from "react";
import { LogoMark } from "@/components/custom/LogoSVGs";
import { cn } from "@/lib/utils";

type ChildrenProps = {
  children: ReactNode;
  className?: string;
};

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-[4px] border border-border bg-muted px-1.5 py-0.5 text-muted-foreground">
      [{children}]
    </span>
  );
}

export function DocumentShell({
  title,
  children,
}: ChildrenProps & {
  title: string;
}) {
  return (
    <article
      data-pyxis-document-page
      className="mx-auto box-border flex min-h-[297mm] w-full max-w-[210mm] flex-col bg-white px-6 py-8 text-black shadow-2xl shadow-black/10 md:px-12 md:py-10"
    >
      <DocumentHeader title={title} />
      <div className="flex flex-1 flex-col gap-7 py-8">{children}</div>
    </article>
  );
}

export function DocumentHeader({
  title,
}: {
  title: string;
}) {
  return (
    <header className="border-b border-black/15 pb-6">
      <div className="flex items-center gap-3">
        <LogoMark className="print-logo" color="black" width={26} />
        <span className="text-subtle_semibold uppercase text-black">
          pyxis.design
        </span>
      </div>
      <h1 className="mt-5 text-h2 text-black">{title}</h1>
    </header>
  );
}

export function DocumentSection({
  title,
  eyebrow,
  children,
  className,
}: ChildrenProps & {
  eyebrow?: string;
  title: string;
}) {
  return (
    <section className={cn("break-inside-avoid space-y-3", className)}>
      {eyebrow ? (
        <p className="text-detail uppercase text-black/45">{eyebrow}</p>
      ) : null}
      <h2 className="text-h5 text-black">{title}</h2>
      <div className="space-y-3 text-p_ui text-black/75">{children}</div>
    </section>
  );
}

export function DocumentTable({
  headers,
  rows,
  className,
}: {
  className?: string;
  headers: ReactNode[];
  rows: ReactNode[][];
}) {
  return (
    <div className={cn("overflow-hidden border border-black/15", className)}>
      <table className="w-full border-collapse text-left text-subtle">
        <thead className="bg-black text-white">
          <tr>
            {headers.map((header, index) => (
              <th key={`header-${index}`} className="px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-t border-black/15">
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="px-3 py-2 align-top text-black/75"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FieldGrid({
  fields,
}: {
  fields: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="border border-black/15 p-3">
          <p className="text-detail uppercase text-black/45">{field.label}</p>
          <div className="mt-1 text-subtle text-black/75">{field.value}</div>
        </div>
      ))}
    </div>
  );
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5">
      {items.map((item, index) => (
        <li key={`bullet-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div
          key={`check-${index}`}
          className="grid grid-cols-[1.25rem_1fr] gap-2 text-subtle text-black/75"
        >
          <span className="mt-0.5 size-4 border border-black/30" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function SignatureBlock({
  parties = ["Pyxis Studio", "Client"],
}: {
  parties?: string[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {parties.map((party) => (
        <div key={party} className="border border-black/15 p-4">
          <p className="text-subtle_semibold text-black">{party}</p>
          <div className="mt-8 border-t border-black/30 pt-2 text-detail text-black/55">
            Signature
          </div>
          <div className="mt-6 border-t border-black/30 pt-2 text-detail text-black/55">
            Name, title, date
          </div>
        </div>
      ))}
    </div>
  );
}

export function LegalNote({ children }: ChildrenProps) {
  return (
    <div className="border border-black/15 bg-black/[0.03] p-4 text-subtle text-black/65">
      {children}
    </div>
  );
}
