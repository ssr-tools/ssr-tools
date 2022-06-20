import { FC, ReactNode } from "react";
import { URL } from "url";
import {
  StaticDataStoreProvider,
  StaticDataStoreScriptTag,
} from "../config/staticDataStore";

export const StaticProvider: FC<{ children: ReactNode; url: URL }> = ({
  url,
  children,
}) => (
  <StaticDataStoreProvider
    staticData={{
      initialPathname: url.pathname,
      initialHash: url.hash,
      initialSearch: url.search,
      texts: [
        "This text comes from the server-side.",
        "It's rendered on the server and also injected to the <script /> tag.",
        "That's how the client can use the same text after hydration.",
      ],
    }}
  >
    {children}
    <StaticDataStoreScriptTag />
  </StaticDataStoreProvider>
);
