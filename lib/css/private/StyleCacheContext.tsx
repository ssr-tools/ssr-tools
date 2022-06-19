import { createContext, MutableRefObject } from "react";

export const StyleCacheContext = createContext<{
  stylesCache: MutableRefObject<Set<string>>;
}>({
  get stylesCache(): never {
    throw new Error("Missing <StyleCacheProvider />");
  },
});
