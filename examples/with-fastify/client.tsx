import { hydrateRoot } from "react-dom/client";
import { App } from "./components/App";
import { Providers } from "./components/Providers.client";

const root = document.getElementById("root");

if (!root) throw new Error("Cannot find root element");

hydrateRoot(
  root,
  <Providers>
    <App />
  </Providers>
);
