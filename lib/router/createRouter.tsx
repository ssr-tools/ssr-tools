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

  const push = <P extends keyof Config>(
    pathPattern: P,
    config: HrefConfig<P>
  ) => basePush(buildHref(pathPattern, config));

  const replace = <P extends keyof Config>(
    pathPattern: P,
    config: HrefConfig<P>
  ) => baseReplace(buildHref(pathPattern, config));

  return {
    RouterProvider,
    CurrentRoute,
    A,
    buildHref,
    useSearchParam,
    usePathParam,
    useCurrentPathPattern,
    push,
    replace,
  };
};
