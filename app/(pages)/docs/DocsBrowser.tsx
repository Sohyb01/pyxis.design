"use client";

import { useRef, useState } from "react";
import { Download, FileText, PencilLine, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { pyxisDocuments, type PyxisDocument } from "./pyxis-documents";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getDocumentStylesMarkup() {
  return Array.from(
    document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>(
      'link[rel="stylesheet"], style',
    ),
  )
    .map((node) => {
      if (node instanceof HTMLLinkElement) {
        if (!node.href) {
          return "";
        }

        return `<link rel="stylesheet" href="${escapeHtml(node.href)}">`;
      }

      return `<style>${(node.textContent ?? "").replaceAll(
        "</style>",
        "<\\/style>",
      )}</style>`;
    })
    .join("\n");
}

function buildPrintFrameHtml(documentMarkup: string, documentTitle: string) {
  return `<!doctype html>
<html class="${escapeHtml(document.documentElement.className)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="${escapeHtml(document.baseURI)}">
    <title>${escapeHtml(documentTitle)}</title>
    ${getDocumentStylesMarkup()}
    <style>
      html,
      body {
        margin: 0;
        background: #ffffff;
        color: #000000;
      }

      [data-pyxis-print-frame-root] {
        background: #ffffff;
        color: #000000;
      }

      @media screen {
        [data-pyxis-print-frame-root] {
          margin: 0 auto;
          max-width: 210mm;
        }
      }

      @media print {
        @page {
          size: A4;
          margin: 14mm;
        }

        html,
        body {
          height: auto !important;
          overflow: visible !important;
          background: #ffffff !important;
        }

        [data-pyxis-print-frame-root] {
          display: block !important;
          background: #ffffff !important;
          color: #000000 !important;
        }

        [data-pyxis-document-page] {
          display: block !important;
          min-height: auto !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #000000 !important;
        }

        [data-pyxis-document-page] * {
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }

        h1,
        h2,
        h3,
        thead,
        tr,
        img,
        svg {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        h1,
        h2,
        h3 {
          break-after: avoid;
          page-break-after: avoid;
        }
      }
    </style>
  </head>
  <body class="${escapeHtml(document.body.className)}">
    <main data-pyxis-print-frame-root>${documentMarkup}</main>
  </body>
</html>`;
}

async function waitForPrintFrame(frame: HTMLIFrameElement) {
  const frameDocument = frame.contentDocument;
  const frameWindow = frame.contentWindow;

  if (!frameDocument || !frameWindow) {
    return;
  }

  const stylesheetPromises = Array.from(
    frameDocument.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  ).map(
    (link) =>
      new Promise<void>((resolve) => {
        try {
          if (link.sheet) {
            resolve();
            return;
          }
        } catch {
          resolve();
          return;
        }

        const timeout = frameWindow.setTimeout(resolve, 2000);
        const finish = () => {
          frameWindow.clearTimeout(timeout);
          resolve();
        };

        link.addEventListener("load", finish, { once: true });
        link.addEventListener("error", finish, { once: true });
      }),
  );

  await Promise.all([
    ...stylesheetPromises,
    frameDocument.fonts?.ready.catch(() => undefined) ?? Promise.resolve(),
  ]);

  await new Promise<void>((resolve) => {
    frameWindow.requestAnimationFrame(() => resolve());
  });
}

export function DocsBrowser() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const liveDocumentRef = useRef<HTMLDivElement>(null);
  const selectedDocument =
    pyxisDocuments.find((document) => document.slug === selectedSlug) ?? null;
  const ActiveDocument = selectedDocument?.Component;

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSelectedSlug(null);
      setIsEditing(false);
    }
  }

  async function handleDownloadPdf(documentItem: PyxisDocument) {
    const currentDocumentMarkup = liveDocumentRef.current?.innerHTML;

    if (!currentDocumentMarkup) {
      return;
    }

    setIsPreparingPdf(true);

    const previousTitle = document.title;
    const printFrame = document.createElement("iframe");
    let cleanupTimer: number | undefined;
    let hasCleanedUp = false;
    let printWindow: Window | null = null;

    const cleanup = () => {
      if (hasCleanedUp) {
        return;
      }

      hasCleanedUp = true;
      document.title = previousTitle;
      window.removeEventListener("afterprint", cleanup);
      printWindow?.removeEventListener("afterprint", cleanup);

      if (cleanupTimer) {
        window.clearTimeout(cleanupTimer);
      }

      printFrame.remove();
    };

    try {
      printFrame.title = `${documentItem.title} print frame`;
      printFrame.style.position = "fixed";
      printFrame.style.left = "-10000px";
      printFrame.style.top = "0";
      printFrame.style.width = "210mm";
      printFrame.style.height = "297mm";
      printFrame.style.border = "0";
      printFrame.style.opacity = "0";
      printFrame.style.pointerEvents = "none";

      document.body.appendChild(printFrame);

      const frameDocument = printFrame.contentDocument;
      const frameWindow = printFrame.contentWindow;

      if (!frameDocument || !frameWindow) {
        cleanup();
        return;
      }

      printWindow = frameWindow;
      document.title = documentItem.title;
      frameWindow.addEventListener("afterprint", cleanup, { once: true });
      window.addEventListener("afterprint", cleanup, { once: true });
      cleanupTimer = window.setTimeout(cleanup, 10 * 60 * 1000);

      frameDocument.open();
      frameDocument.write(
        buildPrintFrameHtml(currentDocumentMarkup, documentItem.title),
      );
      frameDocument.close();

      await waitForPrintFrame(printFrame);
      frameWindow.focus();
      frameWindow.print();
    } catch {
      cleanup();
    } finally {
      setIsPreparingPdf(false);
    }
  }

  return (
    <>
      <div data-pyxis-docs-screen>
        <section className="container mx-auto w-full px-4 pb-20 pt-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="mt-4 text-h2">Pyxis client docs</h1>
            <p className="mt-4 max-w-2xl text-p_ui text-muted-foreground">
              Client-facing documents for proposals, agreements, invoices,
              revisions, handoff, retainers, and post-launch support.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {pyxisDocuments.map((documentItem) => (
              <button
                key={documentItem.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(documentItem.slug);
                  setIsEditing(false);
                }}
                className={cn(
                  "group flex flex-col justify-between rounded-[8px] border border-border bg-card p-5 text-left shadow-sm transition min-h-36 cursor-pointer",
                  "hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                )}
              >
                <span>
                  <span className="flex items-start justify-between gap-3">
                    <FileText className="size-4" />
                    <div className="text-muted-foreground text-subtle">
                      {documentItem.type}
                    </div>
                  </span>
                  <span className="mt-4 block text-xl font-semibold">
                    {documentItem.title}
                  </span>
                  <span className="mt-0 block text-p_ui text-muted-foreground">
                    {documentItem.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <Dialog
          open={Boolean(selectedDocument)}
          onOpenChange={handleOpenChange}
        >
          {selectedDocument && ActiveDocument ? (
            <DialogContent
              showCloseButton={false}
              className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none gap-0 overflow-hidden rounded-[8px] border-border bg-background p-0 shadow-2xl md:max-w-none"
            >
              <DialogTitle className="sr-only">
                {selectedDocument.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {selectedDocument.description}
              </DialogDescription>

              <div
                data-pyxis-print-hidden
                className="flex shrink-0 flex-col gap-3 border-b border-border bg-background px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 md:flex-1">
                  <p className="truncate text-subtle_semibold">
                    {selectedDocument.title}
                  </p>
                  {isEditing ? (
                    <p className="mt-1 text-detail text-muted-foreground">
                      Click inside the document to edit text before downloading.
                    </p>
                  ) : null}
                </div>
                <div className="flex w-full shrink-0 flex-wrap items-center gap-2 md:w-auto md:flex-nowrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                    onClick={() => setIsEditing((current) => !current)}
                  >
                    <PencilLine className="size-4" />
                    {isEditing ? "Editing enabled" : "Edit document"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex-1 md:flex-none"
                    disabled={isPreparingPdf}
                    onClick={() => {
                      void handleDownloadPdf(selectedDocument);
                    }}
                  >
                    <Download className="size-4" />
                    Download as PDF
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Close document"
                    >
                      <X className="size-4" />
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-muted/70 px-3 py-6 md:px-8">
                <div
                  ref={liveDocumentRef}
                  data-pyxis-live-document
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  className={cn(
                    "outline-none",
                    isEditing &&
                      "rounded-[8px] ring-2 ring-ring/40 ring-offset-4 ring-offset-muted/70",
                  )}
                >
                  <ActiveDocument />
                </div>
              </div>
            </DialogContent>
          ) : null}
        </Dialog>
      </div>
    </>
  );
}
