import { readFile } from "node:fs/promises";
import path from "node:path";
import { libraryEntries, type LibraryEntry } from "@/lib/library/registry";

const libraryComponentsRoot = path.resolve(
  process.cwd(),
  "components",
  "library",
);

function resolveLibrarySourcePath(sourcePath: string) {
  const resolvedPath = path.resolve(process.cwd(), sourcePath);
  const relativePath = path.relative(libraryComponentsRoot, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(
      `Library source files must be inside "components/library": "${sourcePath}".`,
    );
  }

  return resolvedPath;
}

async function readLibraryEntrySource(entry: LibraryEntry) {
  if (entry.source !== undefined) {
    return entry.source;
  }

  if (!entry.sourcePath) {
    throw new Error(`Library entry "${entry.id}" does not define source code.`);
  }

  return readFile(resolveLibrarySourcePath(entry.sourcePath), "utf8");
}

export async function getLibraryEntrySources() {
  const sources = await Promise.all(
    libraryEntries.map(
      async (entry) =>
        [entry.id, await readLibraryEntrySource(entry)] as const,
    ),
  );

  return Object.fromEntries(sources);
}
