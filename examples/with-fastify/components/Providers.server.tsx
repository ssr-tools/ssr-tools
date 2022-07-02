import { StyleCacheProvider } from "@ssr-tools/css/components/StyleCacheProvider";
import { FC, ReactNode } from "react";
import { RouterProvider } from "../config/router";
import { AsyncProvider } from "./AsyncProvider.server";
import { AsyncRevalidationProvider } from "./AsyncRevalidationProvider.server";
import { StaticProvider } from "./StaticProvider.server";

export const Providers: FC<{ children: ReactNode; url: URL }> = ({
  children,
  url,
}) => (
  <RouterProvider
    initialHash={url.hash}
    initialPathname={url.pathname}
    initialSearch={url.search}
  >
    <StaticProvider>
      <AsyncProvider>
        <AsyncRevalidationProvider>
          <StyleCacheProvider>{children}</StyleCacheProvider>
        </AsyncRevalidationProvider>
      </AsyncProvider>
    </StaticProvider>
  </RouterProvider>
);
