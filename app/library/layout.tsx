export default function LibaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-background text-foreground" data-libary-root>
      <style>
        {`
          html:has([data-libary-detail]),
          body:has([data-libary-detail]) {
            overflow: hidden !important;
          }
        `}
      </style>
      {children}
    </div>
  );
}
