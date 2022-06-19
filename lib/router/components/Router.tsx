import { match } from "path-to-regexp";
import { ComponentType, useEffect, useState } from "react";
import { scrollToElementWithId } from "../scrollToElementWithId";

export const Router = ({
  initialPathname,
  initialHash,
  routes,
  fallbackComponent: FallbackComponent,
}: RouterProps) => {
  useHash(initialHash);
  const pathname = usePathname(initialPathname);
  const matchedRoute = routes.find(({ pathPattern }) =>
    Boolean(match(pathPattern)(pathname))
  );

  if (!matchedRoute) return <FallbackComponent />;

  const { component: Component } = matchedRoute;

  return <Component />;
};

const usePathname = (initialPathname: string) => {
  const [pathname, setPathname] = useState(initialPathname);

  useEffect(() => {
    const handlePopstate = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  return pathname;
};

const useHash = (initialHash: string) => {
  const [{ value }, setHash] = useState<Hash>({
    value: initialHash,
    version: 0,
  });

  useEffect(() => (value ? scrollToElementWithId(value) : undefined), [value]);

  useEffect(() => {
    const handlePopstate = () =>
      // `startTransition` here to avoid conflicts with updates related
      // to the <Suspense /> boundaries
      setHash((prev) => ({
        value: window.location.hash.replace("#", ""),
        version: typeof prev?.version === "number" ? prev.version + 1 : 0,
      }));

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);
};

export type RouterProps = {
  initialPathname: string;
  initialHash: string;
  routes: Array<{
    pathPattern: string;
    component: ComponentType<Record<string, never>>;
  }>;
  fallbackComponent: ComponentType<Record<string, never>>;
};

export type Hash = {
  value: string;
  version: number;
};
