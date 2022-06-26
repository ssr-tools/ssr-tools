import { useContext, useEffect, useState } from "react";
import { createRouterContext } from "./createRouterContext";

export const createUseCurrentPathPattern = (
  RouterContext: ReturnType<typeof createRouterContext>
) => {
  const useCurrentPathPattern = () => {
    const { routerRef, subscribe } = useContext(RouterContext);

    const [value, setValue] = useState(
      routerRef.current.route?.pathPattern ?? null
    );

    useEffect(() => {
      const handleRouterUpdate = () =>
        setValue((prevValue) => {
          const newValue = routerRef.current.route?.pathPattern ?? null;
          return prevValue !== newValue ? newValue : prevValue;
        });

      return subscribe(handleRouterUpdate);
    }, [routerRef, subscribe]);

    return value;
  };

  return useCurrentPathPattern;
};
