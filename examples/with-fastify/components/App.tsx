import { ComponentType, lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import { CurrentRoute } from "../config/router";

import { Navigation } from "./Navigation";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";

export const App = () => (
  <ErrorBoundary FallbackComponent={FallbackComponent}>
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
  </ErrorBoundary>
);

const FallbackComponent: ComponentType<FallbackProps> = ({ error }) => (
  <ErrorMessage error={error} />
);
