import { MutableRefObject } from "react";

export const PendingData = Symbol("Pending data");

export type DataReaders<T extends Record<string, unknown>> = {
  [Key in keyof T]: () => Promise<T[Key]>;
};

export type CacheEntry<T extends Record<string, unknown>> =
  | {
      data: typeof PendingData;
      promise: Promise<T[keyof T]>;
      status: "pending";
      timestamp: number;
      scriptTagId: null;
    }
  | {
      data: T[keyof T];
      promise: Promise<T[keyof T]>;
      status: "resolved";
      timestamp: number;
      scriptTagId: string | null;
    }
  | {
      promise: Promise<T[keyof T]>;
      status: "rejected";
      timestamp: number;
      error: unknown;
      scriptTagId: null;
    };

export type Cache<T extends Record<string, unknown>> = Map<
  keyof T,
  CacheEntry<T>
>;

export type CacheRef<T extends Record<string, unknown>> = MutableRefObject<
  Cache<T>
>;

export type AsyncDataStoreContextType<T extends Record<string, unknown>> = {
  value: {
    readerEntries: Array<{
      key: keyof T;
      read: () => T[keyof T];
    }>;
    cache: Cache<T>;
    providerId: string;
  };
};
