import { hydrateStream } from "@ssr-tools/core/hydrateStream";
import { App } from "./components/App";
import { Providers } from "./components/Providers.client";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Cannot find root element");
}

hydrateStream(
  root,
  <Providers>
    <App />
  </Providers>
);
