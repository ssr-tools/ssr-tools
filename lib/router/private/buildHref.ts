export const buildHref = (
  pathPattern: string,
  config?: {
    searchParams?: Partial<Record<string, string>>;
    pathParams?: Record<string, string> | null;
    hash?: string;
  }
) => {
  const pathWithPathParams = createPathWithPathParams(
    pathPattern,
    config?.pathParams ?? {}
  );

  if (!config?.searchParams) {
    return addHashWhenNeeded(pathWithPathParams, config?.hash);
  }

  return addHashWhenNeeded(
    createPathWithSearchParams(pathWithPathParams, config.searchParams),
    config?.hash
  );
};

const createPathWithPathParams = (
  pathPattern: string,
  pathParams: Record<string, string>
) => {
  const pathParts = pathPattern.split("/").map((part) => {
    if (part.startsWith(":")) {
      const paramName = part.replace(":", "");
      const paramValue = pathParams?.[paramName] ?? "__null__";
      return encodeURIComponent(paramValue);
    }

    return part;
  });

  return pathParts.join("/");
};

const createPathWithSearchParams = (
  path: string,
  searchParams: Partial<Record<string, string>>
) => {
  // Get rid of possible `undefined` values as they resolve to `"undefined"`,
  // which is not wanted in the search parameters.
  const searchParamsList = Object.entries(searchParams).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );

  const stringifiedSearchParams = new URLSearchParams(
    searchParamsList
  ).toString();

  return [path, stringifiedSearchParams].join("?");
};

const addHashWhenNeeded = (path: string, hash: string | undefined) =>
  hash ? [path, hash].join("#") : path;
