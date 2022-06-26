import { useContext, useEffect, useState } from "react";
import { createRouterContext } from "./createRouterContext";

export const createUseSearchParam = (
  RouterContext: ReturnType<typeof createRouterContext>
) => {
  const useSearchParam = (pathPattern: string, paramName: string) => {
    const { routerRef, subscribe } = useContext(RouterContext);

    const [value, setValue] = useState(() => {
      const { route, searchParams } = routerRef.current;
      if (pathPattern !== route?.pathPattern) return null;
      return searchParams.get(paramName);
    });

    useEffect(() => {
      const handleRouterUpdate = () =>
        setValue((prevValue) => {
          const newValue = routerRef.current.searchParams.get(paramName);
          return prevValue !== newValue ? newValue : prevValue;
        });

      return subscribe(handleRouterUpdate);
    }, [paramName, routerRef, subscribe]);

    return value;
  };

  return useSearchParam;
};
