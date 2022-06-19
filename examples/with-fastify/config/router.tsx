import { lazy } from "react";
import { createRouter } from "@ssr-tools/router/createRouter";

const router = createRouter({
  "/": lazy(() =>
    import("../pages/IndexPage").then((i) => ({
      default: i.IndexPage,
    }))
  ),
  "/hello-world": lazy(() =>
    import("../pages/HelloWorldPage").then((i) => ({
      default: i.HelloWorldPage,
    }))
  ),
  "/css": lazy(() =>
    import("../pages/CssPage").then((i) => ({
      default: i.CssPage,
    }))
  ),
  "/pure-css": lazy(() =>
    import("../pages/PureCssPage").then((i) => ({
      default: i.PureCssPage,
    }))
  ),
  "/static-data": lazy(() =>
    import("../pages/StaticDataPage").then((i) => ({
      default: i.StaticDataPage,
    }))
  ),
  "/async-data": lazy(() =>
    import("../pages/AsyncDataPage").then((i) => ({
      default: i.AsyncDataPage,
    }))
  ),
  "/async-data-revalidation": lazy(() =>
    import("../pages/AsyncDataRevalidationPage").then((i) => ({
      default: i.AsyncDataRevalidationPage,
    }))
  ),
});

export const { Router, A, buildHref } = router;
