import { useContext, useEffect, useState } from "react";
import { CurrentRouteProps } from "../types";
import { createRouterContext } from "./createRouterContext";

export const createCurrentRoute = ({
  RouterContext,
}: {
  RouterContext: ReturnType<typeof createRouterContext>;
}) => {
  const CurrentRoute = ({
    fallbackComponent: FallbackComponent,
  }: CurrentRouteProps) => {
    const { routerRef, subscribe } = useContext(RouterContext);
    const [matchedRoute, setMatchedRoute] = useState(routerRef.current.route);

    useEffect(() => {
      const handleRouterUpdate = () => {
        setMatchedRoute((prevMatchedRoute) => {
          return prevMatchedRoute !== routerRef.current.route
            ? routerRef.current.route
            : prevMatchedRoute;
        });
      };

      return subscribe(handleRouterUpdate);
    }, [routerRef, subscribe]);

    if (!matchedRoute) return <FallbackComponent />;

    const { component: Component } = matchedRoute;

    return <Component />;
  };

  return CurrentRoute;
};
