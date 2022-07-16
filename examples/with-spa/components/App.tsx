import { lazy, Suspense } from "react";
import { CurrentRoute } from "../config/router";
import { LoadingSpinner } from "./LoadingSpinner";
import { Navigation } from "./Navigation";
import { Providers } from "./Providers.client";

export const App = () => (
  <Providers>
    <Navigation />
    <Suspense fallback={<LoadingSpinner size={80} />}>
      <CurrentRoute
        fallbackComponent={lazy(() =>
          import("../pages/NotFoundPage").then((i) => ({
            default: i.NotFoundPage,
          }))
        )}
      />
    </Suspense>
  </Providers>
);
