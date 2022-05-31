import { FC, ReactNode, useRef } from "react";
import { StyleCacheContext } from "../private/StyleCacheContext";

export const StyleCacheProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const stylesCache = useRef(new Set<string>());

  return (
    <StyleCacheContext.Provider
      value={{
        stylesCache,
      }}
    >
      {children}
    </StyleCacheContext.Provider>
  );
};
