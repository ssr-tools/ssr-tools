import { createAsyncData } from "./private/createAsyncData";
import { createContext } from "./private/createContext";
import { createProviderForContext } from "./private/createProvider";

/**
 * It creates the async data storage that allows you to incrementally fetch the
 * data, while you render the app using the pipeable stream.
 */
export function createAsyncDataStore<T extends Record<string, unknown>>({
  invalidationTimeMs = defaultInvalidationTimeMs,
  uniqueIdentifier,
}: {
  /**
   * Time (in milliseconds) that has to pass until we allow to call the reader
   * function again on the client-side.
   *
   * When value is not provided, the default is: `5 * 60 * 1000`
   */
  invalidationTimeMs?: number;
  /**
   * The identifier must be unique for each async data store. Also, it must be
   * stable between server and the client side. So it should not be
   * generated during the runtime. The best identifier would be simply
   * the namespace of the given data store, so it helps with the debugging.
   */
  uniqueIdentifier: string;
}) {
  const context = createContext<T>();
  const AsyncDataStoreProvider = createProviderForContext({
    context,
    invalidationTimeMs,
    uniqueIdentifier,
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
