import { Cache, DataReaders } from "../types";
import { restoreSsrReader } from "./restoreSsrReader";
import { revalidateCache } from "./revalidateCache";

export const createReadFn = <T extends Record<string, unknown>>({
  key,
  readData,
  cache,
  invalidationTimeMs,
  providerId,
}: {
  key: string;
  readData: DataReaders<T>[keyof T];
  cache: Cache<T>;
  invalidationTimeMs: number;
  providerId: string;
}) => {
  let locked = false;

  return () => {
    const lock = new Promise((resolve) =>
      setTimeout(
        () => resolve(Symbol("lock")),
        // The is a heuristic that seems to perform well, but it may depend
        // on how complex the component tree is. It may be a subject of
        // change in the future.
        15
      )
    );

    if (locked) throw lock;

    const cachedReader = cache.get(key);

    const restoredReader = cachedReader
      ? null
      : restoreSsrReader<T>({
          key,
          providerId,
        });

    if (restoredReader) {
      cache.set(key, restoredReader);
      throw restoredReader.promise;
    }

    if (cachedReader?.status === "pending") {
      throw cachedReader.promise;
    }

    if (cachedReader?.status === "rejected") {
      throw cachedReader.error;
    }

    const cachedReaderIsStale =
      cachedReader?.timestamp !== undefined
        ? Date.now() - cachedReader.timestamp >= invalidationTimeMs
        : false;

    if (cachedReader?.status === "resolved" && !cachedReaderIsStale) {
      // When more than one of the suspended elements is replaced in the same
      // time during the hydration process of the stream, we may have some
      // inconsistent renders between the client and the server. To avoid that,
      // we need to lock the reader for some time between each read.
      locked = true;

      lock.then(() => {
        locked = false;
      });

      return cachedReader.data;
    }

    throw revalidateCache({
      key,
      readData,
      cache,
    });
  };
};
