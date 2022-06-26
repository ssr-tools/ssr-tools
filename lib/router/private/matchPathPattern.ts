import { MatchPathPatternConfig } from "../types";

export const matchPathPattern = ({
  allowSuffix,
  pathPattern,
  pathname,
}: MatchPathPatternConfig) => {
  return allowSuffix
    ? matchNotExact(pathname, pathPattern)
    : matchExact(pathname, pathPattern);
};

const matchExact = (pathname: string, pathPattern: string) => {
  if (pathname === pathPattern) return true;

  const pathnameParts = pathname.split("/").filter(Boolean);
  const pathPatternParts = pathPattern.split("/").filter(Boolean);

  return (
    pathnameParts.length === pathPatternParts.length &&
    pathPatternParts.every(
      (part, index) => part.startsWith(":") || part === pathnameParts[index]
    )
  );
};

const matchNotExact = (pathname: string, pathPattern: string) => {
  if (pathname.startsWith(pathPattern)) return true;

  const pathnameParts = pathname.split("/").filter(Boolean);
  const pathPatternParts = pathPattern.split("/").filter(Boolean);

  return (
    pathnameParts.length >= pathPatternParts.length &&
    pathPatternParts.every(
      (part, index) => part.startsWith(":") || part === pathnameParts[index]
    )
  );
};
