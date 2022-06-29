import { RouterConfig, PathParams } from "./types";
import { A as BaseA, AProps } from "./private/A";
import { createRouterContext } from "./private/createRouterContext";
import { createUseSearchParam } from "./private/createUseSearchParam";
import { createUsePathParam } from "./private/createUsePathParam";
import { buildHref as baseBuildHref } from "./private/buildHref";
import { createProvider } from "./private/createProvider";
import { createCurrentRoute } from "./private/createCurrentRoute";
import { push as basePush } from "./private/push";
import { replace as baseReplace } from "./private/replace";
import { createUseCurrentPathPattern } from "./private/createUseCurrentPathPattern";
import { useCallback, useContext } from "react";

/**
 * Provide it with a configuration for the application's routes. It returns
 * the functions to render routes on the client and the server.
 * The returned functions derive the types from the given configuration, which
 * allows TypeScript to identify possible routing errors.
 */
export const createRouter = <Config extends RouterConfig>(config: Config) => {
  const RouterContext = createRouterContext();

  const routes = Object.entries(config).map(
    ([pathPattern, { component, allowSuffix }]) => ({
      pathPattern,
      component,
      allowSuffix,
    })
  );

  const RouterProvider = createProvider({
    RouterContext,
    routes,
  });

  const CurrentRoute = createCurrentRoute({
    RouterContext,
  });

  const buildHref = <P extends keyof Config>(
    pathPattern: P,
    config: HrefConfig<P>
  ) => baseBuildHref(String(pathPattern), config);

  const A = <P extends keyof Config>({
    pathPattern,
    searchParams,
    pathParams,
    hash,
    ...htmlProps
  }: Omit<AProps, "href"> & HrefConfig<P> & { pathPattern: P }) => (
    <BaseA
      href={baseBuildHref(String(pathPattern), {
        searchParams,
        pathParams,
        hash,
      })}
      {...htmlProps}
    />
  );

  const useSearchParam = <P extends keyof Config>(
    pathPattern: P,
    paramName: keyof Config[P]["searchParams"]
  ) =>
    createUseSearchParam(RouterContext)(String(pathPattern), String(paramName));

  const usePathParam = <P extends keyof Config>(
    pathPattern: P,
    paramName: keyof PathParams<P>
  ) =>
    createUsePathParam(RouterContext)(String(pathPattern), String(paramName));

  const useCurrentPathPattern = () =>
    createUseCurrentPathPattern(RouterContext)() as keyof Config;

  const useRouteAction = (action: "push" | "replace") => {
    const { routerRef } = useContext(RouterContext);

    return useCallback(
      <P extends keyof Config>(
        pathPattern: P,
        configOrConfigBuilder:
          | HrefConfig<P>
          | ((prevConfig: HrefConfig<P>) => HrefConfig<P>)
      ) => {
        const { searchParams, pathParams, hash } = routerRef.current;

        const actionFn = action === "push" ? basePush : baseReplace;

        const config =
          typeof configOrConfigBuilder === "function"
            ? configOrConfigBuilder({
                searchParams: searchParams
                  ? Object.fromEntries(searchParams.entries())
                  : undefined,
                pathParams,
                hash,
              } as HrefConfig<P>)
            : configOrConfigBuilder;

        const href = buildHref(pathPattern, config);

        return actionFn(href);
      },
      [action, routerRef]
    );
  };

  const usePush = () => useRouteAction("push");

  const useReplace = () => useRouteAction("replace");

  type HrefConfig<P extends keyof Config> = PathParams<P> extends null
    ? {
        hash?: string;
        searchParams?: Partial<Record<keyof Config[P]["searchParams"], string>>;
        pathParams?: undefined;
      }
    : {
        hash?: string;
        searchParams?: Partial<Record<keyof Config[P]["searchParams"], string>>;
        pathParams: PathParams<P>;
      };

  return {
    /**
     * It provides context necessary for the components that depend on
     * the router. It should wrap the application's entry point component.
     */
    RouterProvider,
    /** It renders currently matched route. */
    CurrentRoute,
    /**
     * It should be used instead of the `<a />` to handle applications internal
     * links. You should provide it with the path pattern and required
     * parameters.
     */
    A,
    /**
     * It creates a `href` basing on the parameters allowed for a given route.
     */
    buildHref,
    /**
     * It allows for getting a value of the search parameter available for a
     * given route. The parameters are isolated to avoid redundant re-renders.
     * The component depends only on the part of the URL that it really needs,
     * so it won't re-render when some other parts of the URL are changed.
     */
    useSearchParam,
    /**
     * It allows for getting a value of the path parameter available for a
     * given route. The parameters are isolated to avoid redundant re-renders.
     * The component depends only on the part of the URL that it really needs,
     * so it won't re-render when some other parts of the URL are changed.
     */
    usePathParam,
    /**
     * It returns currently matched path pattern. If there's no match, it
     * returns `null`.
     */
    useCurrentPathPattern,
    /**
     * It allows pushing to the history state. It does add a new entry in the
     * browser's history.
     */
    usePush,
    /**
     * It allows replacing the history state. It does not add a new entry
     * in the browser's history.
     */
    useReplace,
  };
};
