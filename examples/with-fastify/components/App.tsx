import { lazy, Suspense } from "react";
import { Router, A } from "../config/router";

import "purecss/build/pure-min.css";
import { useStaticData } from "../config/staticDataStore";
import { StyleCacheProvider } from "@ssr-tools/css/components/StyleCacheProvider";
import { StyledSpan } from "./StyleSpan";

export const App = () => {
  const { initialPathname, initialHash } = useStaticData();
  return (
    <StyleCacheProvider>
      <ul>
        <li>
          <A pathPattern="/">Index</A>
        </li>
        <li>
          <A pathPattern="/hello-world">Hello world</A>
        </li>
        <li>
          <A pathPattern="/pure-css">PureCss</A>
        </li>
        <li>
          <A pathPattern="/static-data">Static data</A>
        </li>
        <li>
          <A pathPattern="/async-data">Async data</A>
        </li>
        <li>
          <a href="/404">404</a>
        </li>
      </ul>
      <Suspense fallback={<StyledSpan>Wait...</StyledSpan>}>
        <Router
          initialHash={initialHash}
          initialPathname={initialPathname}
          fallbackComponent={lazy(() =>
            import("../pages/NotFoundPage").then((i) => ({
              default: i.NotFoundPage,
            }))
          )}
        />
      </Suspense>
    </StyleCacheProvider>
  );
};
