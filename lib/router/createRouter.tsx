import { ComponentType, FC, ReactNode, VFC } from "react";
import { compile } from "path-to-regexp";

import { Router as BaseRouter, RouterProps } from "./components/Router";
import { A as BaseA, AProps as BaseAProps } from "./components/A";

/**
 * Create a type safe router for `<Router />` and `<A />` components.
 */
export function createRouter<P extends string>(routesConfiguration: {
  [Key in P]: ComponentType<Record<string, never>>;
}) {
  const routes = Object.entries<typeof routesConfiguration[P]>(
    routesConfiguration
  ).map(([pathPattern, component]) => ({
    pathPattern,
    component,
  }));

  const Router: VFC<Omit<RouterProps, "routes">> = (props) => (
    <BaseRouter routes={routes} {...props} />
  );

  const buildHref = ({ pathPattern, hash }: HrefProps<P>) => {
    const createPath = compile(pathPattern);
    return addHash(createPath(), hash);
  };

  const A: FC<AProps<P>> = ({ pathPattern, hash, htmlProps, children }) => (
    <BaseA href={buildHref({ pathPattern, hash })} {...htmlProps}>
      {children}
    </BaseA>
  );

  return {
    Router,
    A,
    buildHref,
  };
}

const addHash = (path: string, hash?: string) =>
  hash ? `${path}#${hash}` : path;

type AProps<P> = HrefProps<P> & {
  htmlProps?: Omit<BaseAProps, "children">;
  children: ReactNode;
};

type HrefProps<P> = {
  pathPattern: P;
  hash?: string;
};
