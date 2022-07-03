import { lazy, Suspense } from "react";
import { CurrentRoute } from "../config/router";

import { Navigation } from "./Navigation";
import { LoadingSpinner } from "./LoadingSpinner";

export const App = () => {
  return (
    <>
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <CurrentRoute
          fallbackComponent={lazy(() =>
            import("../pages/NotFoundPage").then((i) => ({
              default: i.NotFoundPage,
            }))
          )}
        />
      </Suspense>
    </>
  );
};
