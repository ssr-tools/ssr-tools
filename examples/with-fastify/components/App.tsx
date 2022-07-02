import { lazy, Suspense } from "react";
import { CurrentRoute } from "../config/router";

import { StyledSpan } from "./StyleSpan";
import { Navigation } from "./Navigation";

export const App = () => {
  return (
    <>
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
    </>
  );
};
