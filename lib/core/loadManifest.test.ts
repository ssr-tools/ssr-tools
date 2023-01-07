import { loadManifest } from "./loadManifest";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

test("loads the manifest file", async () => {
  const readFile = jest.spyOn(require("node:fs/promises"), "readFile");

  readFile.mockReturnValue(JSON.stringify(manifest));

  expect(await loadManifest("path/to/manifest.json")).toEqual(manifest);
});

test("throws when manifest file is invalid", async () => {
  const readFile = jest.spyOn(require("node:fs/promises"), "readFile");

  const invalidManifest = {
    "0": "0.js",
    "1": "1.js",
    "2": "2.js",
  };

  readFile.mockReturnValue(JSON.stringify(invalidManifest));

  await expect(loadManifest("path/to/invalid.json")).rejects.toEqual(
    new Error("Manifest file is not valid")
  );
});

test("caches manifest file after first call", async () => {
  const readFile = jest.spyOn(require("node:fs/promises"), "readFile");

  readFile.mockReturnValue(JSON.stringify(manifest));

  await loadManifest("path/to/cached.json");
  await loadManifest("path/to/cached.json");
  await loadManifest("path/to/cached.json");

  expect(await loadManifest("path/to/cached.json")).toEqual(manifest);

  expect(readFile).toBeCalledTimes(1);
});

const manifest = {
  main: "main.js",
  "0": "0.js",
  "1": "1.js",
  "2": "2.js",
};
