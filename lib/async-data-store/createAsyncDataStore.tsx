import {
  createContext,
  FC,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";

export function createAsyncDataStore<T extends Record<string, unknown>>({
  identifier,
}: {
  identifier: string;
}) {
  const AsyncDataStoreContext = createContext<{
    dataReaders: Array<{
      key: keyof T;
      read: () => T[keyof T];
    }>;
    cacheRef: CacheRef<T>;
  }>({
    get dataReaders(): never {
      throw new Error("AsyncDataStoreContext not provided");
    },
    get cacheRef(): never {
      throw new Error("AsyncDataStoreContext not provided");
    },
  });

  const AsyncDataStoreProvider: FC<{
    dataFetching: DataFetching<T>;
    type: "client" | "server";
    children: ReactNode;
  }> = ({ children, dataFetching, type }) => {
    const cacheRef = useRef(new Map<keyof T, CacheEntry<T>>());

    const dataReaders = Object.keys(dataFetching).map(
      (key: keyof DataFetching<T>) => ({
        key: key,
        read:
          typeof window !== "undefined"
            ? createClientSideReadFn({
                key,
                identifier,
                cache: cacheRef.current,
                dataFetching,
              })
            : createServerSideReadFn({
                key,
                cache: cacheRef.current,
                dataFetching,
              }),
      })
    );

    const currentType = typeof window === "undefined" ? "server" : "client";

    if (currentType !== type) {
      return <>{children}</>;
    }

    return (
      <AsyncDataStoreContext.Provider
        value={{
          dataReaders,
          cacheRef,
        }}
      >
        {children}
      </AsyncDataStoreContext.Provider>
    );
  };

  const AsyncData = <Key extends keyof T>({
    dataKey,
    children,
  }: {
    dataKey: Key;
    children: (data: T[Key]) => ReactNode;
  }) => {
    const { dataReaders, cacheRef } = useContext(AsyncDataStoreContext);
    const reader = dataReaders.find((d) => d.key === dataKey);
    const scriptTagRef = useRef<HTMLScriptElement>(null);

    if (!reader) {
      throw new Error(`Invalid key "${String(dataKey)}" provided to AsyncData`);
    }

    useEffect(() => {
      const scriptTag = scriptTagRef.current;

      return () => {
        if (!scriptTag) return;

        // Clone the script and append it body, so that the app can still read
        // the data, even if we unmount the component and mount it again later.
        const scriptTagClone = scriptTag.cloneNode(true);

        // TODO: figure out what to do with the conflicting IDs in clone and
        // the original node.
        document.body.appendChild(scriptTagClone);
      };
    }, []);

    const data = reader.read();
    const dataVisitedCount = cacheRef.current.get(dataKey)?.visited ?? 0;
    const isScriptTagNecessary = Boolean(dataVisitedCount <= 1);

    return (
      <>
        {/* TODO: figure out how to deal with the types here */}
        {children(data as T[Key])}
        {/* TODO: test if there is only one occurrence of the script with the given identifier, but we use data multiple times */}
        {isScriptTagNecessary && (
          <script
            ref={scriptTagRef}
            data-async-identifier={createAsyncDataScriptTagIdentifier({
              key: String(dataKey),
              identifier,
            })}
            // TODO: handle `nonce` attr
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                value: data,
              }),
            }}
            type="application/json"
          />
        )}
      </>
    );
  };

  return {
    AsyncData,
    AsyncDataStoreProvider,
  };
}

const createServerSideReadFn =
  <T extends Record<string, unknown>>({
    key,
    cache,
    dataFetching,
  }: {
    key: keyof DataFetching<T>;
    cache: Cache<T>;
    dataFetching: DataFetching<T>;
  }) =>
  () => {
    // TODO: add tests and refactor this code

    const prev = cache.get(key);

    if (!prev) {
      const entry: CacheEntry<T> = {
        promise: dataFetching[key]()
          .then((result) => {
            entry.data = result;
            entry.status = "resolved";
            return Promise.resolve(result);
          })
          .catch((err) => {
            console.error(err);
            entry.status = "rejected";
            return Promise.reject(err);
          }),
        status: "pending",
        data: PendingData,
        visited: 0,
      };

      cache.set(key, entry);

      throw entry.promise;
    }

    if (prev.status === "resolved" && prev.data !== PendingData) {
      prev.visited = prev.visited + 1;
      return prev.data;
    }

    throw prev.promise;
  };

const createClientSideReadFn =
  <T extends Record<string, unknown>>({
    key,
    cache,
    identifier,
    dataFetching,
  }: {
    key: keyof DataFetching<T>;
    cache: Cache<T>;
    identifier: string;
    dataFetching: DataFetching<T>;
  }) =>
  () => {
    // TODO: add tests and refactor this code

    const prevCacheEntry = cache.get(key);

    if (prevCacheEntry && prevCacheEntry.data !== PendingData) {
      if (prevCacheEntry.data === PendingData) throw prevCacheEntry.promise;

      prevCacheEntry.visited = prevCacheEntry.visited + 1;
      return prevCacheEntry.data;
    }

    const dataFromScriptTag = getDataFromScriptTag(
      createAsyncDataScriptTagIdentifier({
        key: String(key),
        identifier,
      })
    );

    if (!dataFromScriptTag) {
      const promise = dataFetching[key]();

      cache.set(key, {
        promise,
        status: "pending",
        data: PendingData,
        visited: 0,
      });

      promise
        .then((result) => {
          cache.set(key, {
            promise,
            status: "resolved",
            data: result,
            visited: (cache.get(key)?.visited ?? 0) + 1,
          });
          return result;
        })
        .catch((err) => {
          console.error(err);
          cache.set(key, {
            promise,
            status: "rejected",
            data: PendingData,
            visited: (cache.get(key)?.visited ?? 0) + 1,
          });
          return err;
        });

      throw promise;
    }

    const cacheEntry = {
      status: "resolved" as const,
      data: dataFromScriptTag.value as T[keyof T],
      promise: Promise.resolve(dataFromScriptTag.value as T[keyof T]),
      visited: 1,
    };

    cache.set(key, cacheEntry);

    return cacheEntry.data;
  };

const getDataFromScriptTag = (
  scriptTagIdentifier: string
): { value: unknown } | undefined => {
  const scriptTag = window.document.querySelector(
    `script[data-async-identifier=${scriptTagIdentifier}`
  );

  if (!scriptTag?.textContent) return;

  const json = JSON.parse(scriptTag.textContent);

  if (!("value" in json)) {
    throw new Error(`Invalid json structure in ${scriptTag}`);
  }

  return json;
};

const createAsyncDataScriptTagIdentifier = ({
  key,
  identifier,
}: {
  key: string;
  identifier: string;
}) => `${identifier}-${key}`;

const PendingData = Symbol("Pending data");

type DataFetching<T extends Record<string, unknown>> = {
  [Key in keyof T]: () => Promise<T[Key]>;
};

type CacheEntry<T extends Record<string, unknown>> = {
  data: T[keyof T] | typeof PendingData;
  promise: Promise<T[keyof T]>;
  status: "pending" | "resolved" | "rejected";
  visited: number;
};

type Cache<T extends Record<string, unknown>> = Map<keyof T, CacheEntry<T>>;

type CacheRef<T extends Record<string, unknown>> = MutableRefObject<Cache<T>>;
