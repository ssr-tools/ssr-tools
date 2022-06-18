import { createAsyncData } from "./private/createAsyncData";
import { createContext } from "./private/createContext";
import { createProviderForContext } from "./private/createProvider";

/**
 * It creates the async data storage that allows you to incrementally fetch the
 * data, while you render the app using the pipeable stream.
 */
export function createAsyncDataStore<T extends Record<string, unknown>>({
  invalidationTimeMs = defaultInvalidationTimeMs,
}: {
  /**
   * Time (in milliseconds) that has to pass until we allow to call the reader
   * function again on the client-side.
   *
   * When value is not provided, the default is: `5 * 60 * 1000`
   */
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
    /**
     * A component that allows to read the async data. Remember to wrap it with
     * a `<Suspense />`.
     */
    AsyncData,
    /**
     * A component that provides the context for the `<AsyncData />`.
     * Wrap it around the component tree inside which you use `<AsyncData />`.
     * Otherwise, you'll get a runtime error due to the missing context.
     */
    AsyncDataStoreProvider,
  };
}

const defaultInvalidationTimeMs = 5 * 60 * 1000;
