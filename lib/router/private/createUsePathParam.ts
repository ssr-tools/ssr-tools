import { useContext, useMemo } from "react";
import { createPathParams } from "./createPathParams";
import { createRouterContext } from "./createRouterContext";

export const createUsePathParam = (
  RouterContext: ReturnType<typeof createRouterContext>
) => {
  const pathParamsMemo = new Map<string, Record<string, string> | null>();

  const usePathParam = (pathPattern: string, paramName: string) => {
    const { pathname } = useContext(RouterContext).value;

    const pathParams = useMemo(() => {
      const cachedPathParams = pathParamsMemo.get(pathname);

      if (cachedPathParams) return cachedPathParams;

      const createdPathParams = createPathParams(pathPattern, pathname);
      pathParamsMemo.set(pathname, createdPathParams);
      return createdPathParams;
    }, [pathPattern, pathname]);

    return pathParams?.[paramName] ?? "";
  };

  return usePathParam;
};
