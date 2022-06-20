import { useContext, useMemo } from "react";
import { createRouterContext } from "./createRouterContext";

export const createUseSearchParam = (
  RouterContext: ReturnType<typeof createRouterContext>
) => {
  const searchParamsMemo = new Map<string, URLSearchParams>();

  const useSearchParam = (pathPattern: string, paramName: string) => {
    const { search, route } = useContext(RouterContext).value;
    const currentPathPattern = route?.pathPattern;

    const searchParams = useMemo(() => {
      if (!search) return null;

      const cachedSearchParams = searchParamsMemo.get(search);

      if (cachedSearchParams) return cachedSearchParams;

      const createdSearchParams = new URLSearchParams(search);
      searchParamsMemo.set(search, createdSearchParams);
      return createdSearchParams;
    }, [search]);

    if (currentPathPattern !== pathPattern) return null;

    return searchParams?.get(paramName) ?? null;
  };

  return useSearchParam;
};
