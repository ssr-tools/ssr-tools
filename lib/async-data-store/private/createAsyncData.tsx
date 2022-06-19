import { memo, ReactNode, useContext, useId, useInsertionEffect } from "react";
import { AsyncDataStoreContextType } from "../types";

export function createAsyncData<T extends Record<string, unknown>>({
  context,
}: {
  context: React.Context<AsyncDataStoreContextType<T>>;
}) {
  const useAsyncContext = () => useContext(context).value;

  const ScriptTag = memo(
    <Key extends keyof T>({
      dataKey,
      data,
    }: {
      dataKey: Key;
      data: T[Key];
    }) => {
      const { providerId } = useAsyncContext();
      const key = `${dataKey as string}-${providerId}`;
      const stringifiedData = JSON.stringify({ value: data });
      const id = useId();
      const { cache } = useAsyncContext();

      const cacheEntry = cache.get(dataKey);

      const cacheEntryHasDifferentId =
        cacheEntry?.status !== "resolved" ||
        (cacheEntry?.scriptTagId !== null && cacheEntry.scriptTagId !== id);

      useInsertionEffect(() => {
        if (cacheEntryHasDifferentId) return;
        cacheEntry.scriptTagId = id;
      }, [cacheEntry, cacheEntryHasDifferentId, id]);

      if (cacheEntryHasDifferentId) return null;

      if (typeof document === "undefined") {
        // We cannot run the effect on the server-side, so we set the id during
        // the render.
        cacheEntry.scriptTagId = id;
      }

      return (
        <script
          type="application/json"
          data-async-store-key={key}
          dangerouslySetInnerHTML={{
            __html: stringifiedData,
          }}
        />
      );
    }
  );

  const AsyncData = <Key extends keyof T>({
    dataKey,
    children: renderChildrenWithData,
  }: {
    dataKey: Key;
    children: (data: T[Key]) => ReactNode;
  }) => {
    const key = String(dataKey);
    const { readerEntries } = useAsyncContext();
    const readerEntry = readerEntries.find(({ key }) => key === dataKey);

    if (!readerEntry) {
      throw new Error(`Cannot find readerEntry for dataKey: "${key}"`);
    }

    const data = readerEntry.read();
    const children = renderChildrenWithData(data as T[Key]);

    return (
      <>
        {children}
        <ScriptTag dataKey={dataKey} data={data} />
      </>
    );
  };

  return AsyncData;
}
