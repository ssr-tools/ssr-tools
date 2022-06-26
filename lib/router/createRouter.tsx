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

        const href = buildHref(
          pathPattern,
          typeof configOrConfigBuilder === "function"
            ? configOrConfigBuilder({
                searchParams: searchParams
                  ? Object.fromEntries(searchParams.entries())
                  : undefined,
                pathParams,
                hash,
              } as HrefConfig<P>)
            : configOrConfigBuilder
        );

        return actionFn(href);
      },
      [action, routerRef]
    );
  };

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
    RouterProvider,
    CurrentRoute,
    A,
    buildHref,
    useSearchParam,
    usePathParam,
    useCurrentPathPattern,
    useRouteAction,
  };
};
