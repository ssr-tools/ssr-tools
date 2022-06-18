import React, { useRef } from "react";
import {
  AsyncDataStoreContextType,
  CacheEntry,
  CacheRef,
  DataReaders,
} from "../types";
import { createReadFn } from "./createReadFn";

export function createProviderForContext<T extends Record<string, unknown>>({
  context: { Provider },
  invalidationTimeMs,
  uniqueIdentifier,
}: {
  uniqueIdentifier: string;
  context: React.Context<AsyncDataStoreContextType<T>>;
  invalidationTimeMs: number;
}) {
  const AsyncDataStoreProvider = ({
    readers,
    children,
  }: {
    readers: DataReaders<T>;
    children: React.ReactNode;
  }) => {
    const { current: cache }: CacheRef<T> = useRef(
      new Map<keyof T, CacheEntry<T>>()
    );

    const readerEntries = Object.entries<DataReaders<T>[keyof DataReaders<T>]>(
      readers
    ).map(([key, readData]) => ({
      key,
      read: createReadFn<T>({
        key,
        readData,
        cache,
        invalidationTimeMs,
        providerId: uniqueIdentifier,
      }),
    }));

    const contextValue = {
      value: {
        readerEntries,
        cache,
        providerId: uniqueIdentifier,
      },
    };

    const { current: value } = useRef(contextValue);

    return <Provider value={value}>{children}</Provider>;
  };

  return AsyncDataStoreProvider;
}
