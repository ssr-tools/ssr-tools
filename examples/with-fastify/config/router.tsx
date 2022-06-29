import { lazy } from "react";
import { createRouter } from "@ssr-tools/router/createRouter";

const router = createRouter({
  "/": {
    component: lazy(() =>
      import("../pages/IndexPage").then((i) => ({
        default: i.IndexPage,
      }))
    ),
    allowSuffix: false,
  },
  "/hello-world": {
    component: lazy(() =>
      import("../pages/HelloWorldPage").then((i) => ({
        default: i.HelloWorldPage,
      }))
    ),
    allowSuffix: false,
  },
  "/css": {
    component: lazy(() =>
      import("../pages/CssPage").then((i) => ({
        default: i.CssPage,
      }))
    ),
    allowSuffix: false,
  },
  "/pure-css": {
    component: lazy(() =>
      import("../pages/PureCssPage").then((i) => ({
        default: i.PureCssPage,
      }))
    ),
    allowSuffix: false,
  },
  "/static-data": {
    component: lazy(() =>
      import("../pages/StaticDataPage").then((i) => ({
        default: i.StaticDataPage,
      }))
    ),
    allowSuffix: false,
  },
  "/async-data": {
    component: lazy(() =>
      import("../pages/AsyncDataPage").then((i) => ({
        default: i.AsyncDataPage,
      }))
    ),
    allowSuffix: false,
  },
  "/async-data-revalidation": {
    component: lazy(() =>
      import("../pages/AsyncDataRevalidationPage").then((i) => ({
        default: i.AsyncDataRevalidationPage,
      }))
    ),
    allowSuffix: false,
  },
  "/search-params": {
    component: lazy(() =>
      import("../pages/SearchParamsPage").then((i) => ({
        default: i.SearchParamsPage,
      }))
    ),
    searchParams: {
      page: true,
      perPage: true,
      category: true,
    },
    allowSuffix: false,
  },
  "/path-params/:category/:product": {
    component: lazy(() =>
      import("../pages/PathParamsPage").then((i) => ({
        default: i.PathParamsPage,
      }))
    ),
    allowSuffix: false,
  },
  "/hash-scroll": {
    component: lazy(() =>
      import("../pages/HashScrollPage").then((i) => ({
        default: i.HashScrollPage,
      }))
    ),
    allowSuffix: false,
  },
  "/router-isolated-renders/:pathParam1/:pathParam2": {
    component: lazy(() =>
      import("../pages/RouterIsolatedRendersPage").then((i) => ({
        default: i.RouterIsolatedRendersPage,
      }))
    ),
    searchParams: {
      searchParam1: true,
      searchParam2: true,
    },
    allowSuffix: false,
  },
  "/wild-card": {
    component: lazy(() =>
      import("../pages/WildCardPage").then((i) => ({
        default: i.WildCardPage,
      }))
    ),
    allowSuffix: true,
  },
});

export const {
  RouterProvider,
  CurrentRoute,
  A,
  buildHref,
  usePathParam,
  useSearchParam,
  useCurrentPathPattern,
  usePush,
  useReplace,
} = router;
