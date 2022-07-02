import { FC, ReactNode } from "react";
import {
  StaticDataStoreProvider,
  StaticDataStoreScriptTag,
} from "../config/staticDataStore";

export const StaticProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <StaticDataStoreProvider
    staticData={{
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
