import { createAsyncDataStore } from "@ssr-tools/async-data-store/createAsyncDataStore";

export const { AsyncData, AsyncDataStoreProvider } = createAsyncDataStore<{
  text1: string;
  text2: string;
}>({
  invalidationTimeMs: 3000,
});
