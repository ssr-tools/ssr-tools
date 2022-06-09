import { createAsyncData } from "./private/createAsyncData";
import { createContext } from "./private/createContext";
import { createProviderForContext } from "./private/createProvider";

export function createAsyncDataStore<T extends Record<string, unknown>>({
  invalidationTimeMs = defaultRevalidationTimeMs,
}: {
  invalidationTimeMs?: number;
} = {}) {
  const context = createContext<T>();
  const AsyncDataStoreProvider = createProviderForContext({
    context,
    invalidationTimeMs,
  });
  const AsyncData = createAsyncData<T>({
    context,
  });

  return {
    AsyncData,
    AsyncDataStoreProvider,
  };
}

const defaultRevalidationTimeMs = 5 * 60 * 1000;
