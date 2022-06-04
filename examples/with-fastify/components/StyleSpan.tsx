import { Span } from "@ssr-tools/css/stylable/Span";
import { FC, ReactNode } from "react";

export const StyledSpan: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <Span
    css={{
      "&": {
        display: "flex",
        flexDirection: "column",
        color: "red",
      },
      "& > span": {
        color: "blue",
      },
    }}
  >
    {children}
  </Span>
);
