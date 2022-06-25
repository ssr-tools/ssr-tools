import { useContext } from "react";
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
    const matchedRoute = useContext(RouterContext).value.route;

    if (!matchedRoute) return <FallbackComponent />;

    const { component: Component } = matchedRoute;

    return <Component />;
  };

  return CurrentRoute;
};
