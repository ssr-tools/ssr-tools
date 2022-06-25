export const createPathParams = (pathPattern: string, pathname: string) => {
  const pathPatternParts = pathPattern.split("/");
  const pathParts = pathname.split("/");

  const params = pathPatternParts.reduce(
    (acc: Record<string, string> | null, next, index) => {
      if (next.startsWith(":")) {
        acc = acc ?? {};
        const paramName = next.replace(":", "");
        acc[paramName] = pathParts[index]
          ? decodeURIComponent(pathParts[index])
          : "";
      }

      return acc;
    },
    null
  );

  return params;
};
