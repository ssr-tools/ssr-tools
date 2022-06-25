import { RouteConfig, ProviderProps } from "../types";
import { createRouterContext } from "./createRouterContext";
import { matchPathPattern } from "./matchPathPattern";
import { useHash } from "./useHash";
import { usePathname } from "./usePathname";
import { useScrollToElementWithHash } from "./useScrollToElementWithHash";
import { useSearch } from "./useSearch";

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
    const hash = useHash(initialHash);
    useScrollToElementWithHash(hash);

    const pathname = usePathname(initialPathname);
    const search = useSearch(initialSearch);

    const route =
      routes.find(({ pathPattern, allowSuffix }) =>
        matchPathPattern({
          pathPattern,
          pathname,
          allowSuffix,
        })
      ) ?? null;

    return (
      <RouterContext.Provider
        value={{
          value: {
            pathname,
            hash: hash.value,
            search,
            route,
          },
        }}
      >
        {children}
      </RouterContext.Provider>
    );
  };

  return RouterProvider;
};
