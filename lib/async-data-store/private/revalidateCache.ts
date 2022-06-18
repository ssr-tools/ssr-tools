import { Cache, DataReaders, PendingData } from "../types";

export const revalidateCache = <T extends Record<string, unknown>>({
  key,
  readData,
  cache,
}: {
  key: string;
  readData: DataReaders<T>[keyof T];
  cache: Cache<T>;
}) => {
  const promise = readData();

  cache.set(key, {
    promise,
    status: "pending",
    data: PendingData,
    timestamp: 0,
    scriptTagId: null,
  });

  return promise
    .then((result) => {
      cache.set(key, {
        promise,
        status: "resolved",
        data: result,
        timestamp: Date.now(),
        scriptTagId: null,
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Error while resolving data reader for "${key}"`, error);

      cache.set(key, {
        promise,
        status: "rejected",
        timestamp: 0,
        error,
        scriptTagId: null,
      });

      throw error;
    });
};
