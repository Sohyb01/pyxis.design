import { brandUiFont } from "./brand-font";

export default function BrandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${brandUiFont.className} min-h-dvh bg-neutral-50 text-neutral-950`}
      data-brand-root
    >
      {children}
    </div>
  );
}
