import { createAsyncDataStore } from "@ssr-tools/async-data-store/createAsyncDataStore";

export const { AsyncData, AsyncDataStoreProvider } = createAsyncDataStore<{
  text: string;
  longWaitText: string;
}>({
  uniqueIdentifier: "async-data-store",
});
