import { Cache, CacheEntry } from "../types";

export const restoreSsrReader = <T extends Record<string, unknown>>({
  key,
  cache,
  providerId,
}: {
  key: string;
  cache: Cache<T>;
  providerId: string;
}): CacheEntry<T> | null => {
  if (typeof document === "undefined") return null;

  const scriptSelector = `[data-async-store-key="${key}-${providerId}"]`;

  const scriptElement = document.querySelector(scriptSelector);

  if (!scriptElement) return null;

  const parsedJson = JSON.parse(scriptElement.innerHTML);

  if (!("value" in parsedJson)) {
    throw new Error(`Invalid JSON for "${scriptSelector}"`);
  }

  return {
    status: "resolved",
    promise: Promise.resolve(parsedJson.value),
    data: parsedJson.value,
    timestamp: Date.now(),
    scriptTagId: null,
  };
};
