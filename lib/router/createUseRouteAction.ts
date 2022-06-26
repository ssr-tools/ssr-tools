import { useCallback, useContext } from "react";
import { buildHref } from "./private/buildHref";
import { createRouterContext } from "./private/createRouterContext";
import { push } from "./private/push";
import { replace } from "./private/replace";
import { GenericHrefConfig } from "./types";

export const createUseRouteAction = <
  PathPattern extends string | number | symbol,
  HrefConfig extends GenericHrefConfig
>(
  RouterContext: ReturnType<typeof createRouterContext>
) => {
  const useRouteAction = (action: "push" | "replace") => {
    const { routerRef } = useContext(RouterContext);

    return useCallback(
      (
        pathPattern: PathPattern,
        createConfig: (prevConfig: HrefConfig) => HrefConfig
      ) => {
        const { searchParams, pathParams, hash } = routerRef.current;

        const actionFn = action === "push" ? push : replace;

        return actionFn(
          buildHref(
            String(pathPattern),
            createConfig({
              searchParams: Object.fromEntries(searchParams.entries()),
              pathParams,
              hash,
            } as unknown as HrefConfig)
          )
        );
      },
      [action, routerRef]
    );
  };

  return useRouteAction;
};
