import { hydrateStream } from "@ssr-tools/core/hydrateStream";
import { App } from "./components/App";
import { AsyncDataStoreProvider } from "./config/asyncDataStore";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Cannot find root element");
}

hydrateStream(
  root,
  <AsyncDataStoreProvider
    type="client"
    dataFetching={{
      text: () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                "You had been waiting for this text 3 seconds. It was resolved on the client-side."
              ),
            3000
          )
        ),
      longWaitText: () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                "You had been waiting for this text 10 seconds. It was resolved on the client-side."
              ),
            10000
          )
        ),
    }}
  >
    <App />
  </AsyncDataStoreProvider>
);
