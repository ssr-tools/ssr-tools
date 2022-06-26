import { lazy, Suspense } from "react";
import { RouterProvider, CurrentRoute } from "../config/router";

import "purecss/build/pure-min.css";
import { useStaticData } from "../config/staticDataStore";
import { StyleCacheProvider } from "@ssr-tools/css/components/StyleCacheProvider";
import { StyledSpan } from "./StyleSpan";
import { Navigation } from "./Navigation";

export const App = () => {
  const { initialPathname, initialHash, initialSearch } = useStaticData();

  return (
    <StyleCacheProvider>
      <RouterProvider
        initialHash={initialHash}
        initialPathname={initialPathname}
        initialSearch={initialSearch}
      >
        <Navigation />
        <Suspense fallback={<StyledSpan>Wait...</StyledSpan>}>
          <CurrentRoute
            fallbackComponent={lazy(() =>
              import("../pages/NotFoundPage").then((i) => ({
                default: i.NotFoundPage,
              }))
            )}
          />
        </Suspense>
      </RouterProvider>
    </StyleCacheProvider>
  );
};
