import { ComponentType, ReactNode } from "react";

export type MatchPathPatternConfig = {
  pathname: string;
  pathPattern: string;
  allowSuffix: boolean;
};

export type RouterConfig = {
  [PathPattern: string]: {
    /**
     * A component that renders on a given route. It should not take any props.
     */
    component: ComponentType<Record<string, never>>;
    /**
     * Define the supported [`searchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) e.g.:
     *
     * ```
     * {
     *   foo: true,
     *   bar: true,
     * }
     * ```
     *
     * Allows for `searchParams` like: `?foo=hello&bar=world`.
     */
    searchParams?: Record<string, true>;
    /**
     * When `true` it matches when a given path starts with a given path pattern.
     *
     * When `false` it does not allow to match a pathname longer than a path
     * pattern.
     */
    allowSuffix: boolean;
  };
};

export type PathParams<P extends string | number | symbol> =
  // eslint-disable-next-line no-unused-vars
  P extends `${infer Prefix}/:${infer Suffix}` ? GetParams<Suffix> : null;

type GetParams<P extends string> = P extends `${infer Param}/${infer Next}`
  ? {
      // eslint-disable-next-line no-unused-vars
      [Key in Param]: string;
    } & GetParamsFromNext<Next>
  : {
      // eslint-disable-next-line no-unused-vars
      [Key in P]: string;
    };

type GetParamsFromNext<N extends string> =
  N extends `:${infer Param}/${infer NextNext}`
    ? {
        // eslint-disable-next-line no-unused-vars
        [Key in Param]: string;
      } & GetParamsFromNext<NextNext>
    : N extends `:${infer Param}`
    ? {
        // eslint-disable-next-line no-unused-vars
        [Key in Param]: string;
      }
    : GetParams<N>;

export type ProviderProps = {
  /** https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname */
  initialPathname: string;
  /** https://developer.mozilla.org/en-US/docs/Web/API/URL/search */
  initialSearch: string;
  /** https://developer.mozilla.org/en-US/docs/Web/API/URL/hash */
  initialHash: string;
  children: ReactNode;
};

export type RouterContextType = {
  value: {
    /** https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname */
    pathname: string;
    /** https://developer.mozilla.org/en-US/docs/Web/API/URL/search */
    search: string;
    /** https://developer.mozilla.org/en-US/docs/Web/API/URL/hash */
    hash: string;
    /** Currently matched route */
    route: RouteConfig | null;
  };
};

export type Hash = {
  value: string;
  // We need to count updates to the hash, so that we can scroll to the same
  // anchor again. That happens once the user scrolls away, but clicks on the
  // same link again, so there no changes in the hash value, but the auto-scroll
  // to anchor is still expected.
  updatesCount: number;
};

export type RouteConfig = {
  pathPattern: string;
  component: ComponentType<Record<string, never>>;
  allowSuffix: boolean;
};

export type CurrentRouteProps = {
  fallbackComponent: ComponentType<Record<string, never>>;
};
