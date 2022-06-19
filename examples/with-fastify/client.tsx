import { hydrateStream } from "@ssr-tools/core/hydrateStream";
import { App } from "./components/App";
import { AsyncProvider } from "./components/AsyncProvider.client";
import { AsyncRevalidationProvider } from "./components/AsyncRevalidationProvider.client";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Cannot find root element");
}

hydrateStream(
  root,
  <AsyncRevalidationProvider>
    <AsyncProvider>
      <App />
    </AsyncProvider>
  </AsyncRevalidationProvider>
);
