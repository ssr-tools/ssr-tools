import { useContext, useEffect, useState } from "react";
import { createRouterContext } from "./createRouterContext";

export const createUsePathParam = (
  RouterContext: ReturnType<typeof createRouterContext>
) => {
  const usePathParam = (pathPattern: string, paramName: string) => {
    const { routerRef, subscribe } = useContext(RouterContext);

    const [value, setValue] = useState(() => {
      const { route } = routerRef.current;
      if (pathPattern !== route?.pathPattern) return null;
      return routerRef.current.pathParams?.[paramName] ?? null;
    });

    useEffect(() => {
      const handleRouterUpdate = () =>
        setValue((prevValue) => {
          const newValue = routerRef.current.pathParams?.[paramName] ?? null;
          return prevValue !== newValue ? newValue : prevValue;
        });

      return subscribe(handleRouterUpdate);
    }, [paramName, routerRef, subscribe]);

    return value;
  };

  return usePathParam;
};
