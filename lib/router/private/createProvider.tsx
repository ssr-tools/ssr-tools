import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { RouteConfig, ProviderProps, RouterRefValue } from "../types";
import { createPathParams } from "./createPathParams";
import { createRouterContext } from "./createRouterContext";
import { matchPathPattern } from "./matchPathPattern";

export const createProvider = ({
  RouterContext,
  routes,
}: {
  RouterContext: ReturnType<typeof createRouterContext>;
  routes: Array<RouteConfig>;
}) => {
  const RouterProvider = ({
    initialPathname,
    initialHash,
    initialSearch,
    children,
  }: ProviderProps) => {
    const id = useId();

    const routeUpdateEvent = useMemo(
      () => new Event(`@ssr-tools-router-update-${id}`),
      [id]
    );

    const initialRefValue = createRouterRefValue({
      pathname: initialPathname,
      hash: initialHash,
      search: initialSearch,
      routes,
    });

    const routerRef = useRef<RouterRefValue>(initialRefValue);

    useEffect(() => {
      const handlePopstate = () => {
        routerRef.current = createRouterRefValue({
          pathname: window.location.pathname,
          hash: window.location.hash,
          search: window.location.search,
          routes,
        });

        window.dispatchEvent(routeUpdateEvent);
      };

      window.addEventListener("popstate", handlePopstate);
      return () => window.removeEventListener("popstate", handlePopstate);
    }, [routeUpdateEvent]);

    const subscribe = useCallback(
      (callback: () => void) => {
        window.addEventListener(routeUpdateEvent.type, callback);
        return () =>
          window.removeEventListener(routeUpdateEvent.type, callback);
      },
      [routeUpdateEvent.type]
    );

    return (
      <RouterContext.Provider
        value={{
          routerRef,
          subscribe,
        }}
      >
        {children}
      </RouterContext.Provider>
    );
  };

  return RouterProvider;
};

const createRouterRefValue = ({
  pathname,
  hash,
  search,
  routes,
}: {
  pathname: string;
  hash: string;
  search: string;
  routes: RouteConfig[];
}) => {
  const route = getRoute(pathname, routes);

  const pathParams = route
    ? createPathParams(route.pathPattern, pathname)
    : null;

  const searchParams = new URLSearchParams(search);

  return {
    pathname,
    hash,
    search,
    route,
    searchParams,
    pathParams,
  };
};

const getRoute = (pathname: string, routes: RouteConfig[]) =>
  routes.find(({ pathPattern, allowSuffix }) =>
    matchPathPattern({
      pathPattern,
      pathname,
      allowSuffix,
    })
  ) ?? null;
