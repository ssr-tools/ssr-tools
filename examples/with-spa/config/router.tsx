import { createRouter } from "@ssr-tools/router/createRouter";
import { lazy } from "react";

const router = createRouter({
  "/": {
    allowSuffix: false,
    component: lazy(() =>
      import("../pages/Index").then((i) => ({
        default: i.IndexPage,
      }))
    ),
  },
  "/first-page": {
    allowSuffix: false,
    component: lazy(() =>
      import("../pages/FirstPage").then((i) => ({
        default: i.FirstPage,
      }))
    ),
  },
  "/second-page": {
    allowSuffix: false,
    component: lazy(() =>
      import("../pages/SecondPage").then((i) => ({
        default: i.SecondPage,
      }))
    ),
  },
});

export const { RouterProvider, CurrentRoute, A } = router;
