import { StyleCacheProvider } from "@ssr-tools/css/components/StyleCacheProvider";
import { FC, ReactNode } from "react";
import { AsyncProvider } from "./AsyncProvider.client";
import { AsyncRevalidationProvider } from "./AsyncRevalidationProvider.client";
import { RouterProvider } from "../config/router";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <RouterProvider
    initialHash={window.location.hash}
    initialPathname={window.location.pathname}
    initialSearch={window.location.search}
  >
    <AsyncProvider>
      <AsyncRevalidationProvider>
        <StyleCacheProvider>{children}</StyleCacheProvider>
      </AsyncRevalidationProvider>
    </AsyncProvider>
  </RouterProvider>
);
