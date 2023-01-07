import fs from "node:fs/promises";

export const loadManifest = async (pathname: string) => {
  const cache = manifestCache[pathname];

  if (cache) {
    return cache;
  }

  const fileContent = await fs.readFile(pathname, {
    encoding: "utf8",
  });

  const manifest = createManifest(fileContent);

  manifestCache[pathname] = manifest;

  return manifest;
};

const createManifest = (fileContent: string) => {
  const manifest = JSON.parse(fileContent);

  if (!validateManifest(manifest)) {
    throw new Error("Manifest file is not valid");
  }

  return manifest;
};

const validateManifest = (json: unknown): json is Manifest => {
  return typeof json === "object" && json !== null && "main" in json;
};

const manifestCache: ManifestCache = {};

type ManifestCache = Record<string, Manifest | null>;

type Manifest = Record<string, string> & { main: string };
