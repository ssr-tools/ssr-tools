import { Span } from "@ssr-tools/css/stylable/Span";
import { FC, ReactNode } from "react";

export const LoadingSpinner: FC<{
  children?: ReactNode;
}> = ({ children }) => (
  <Span
    css={{
      "&": {
        display: "block",
        width: 40,
        height: 40,
        borderRadius: "100%",
        borderTopColor: "black",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderWidth: 10,
        borderStyle: "solid",
        position: "relative",
        animationName: "LoadingSpinner",
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationTimingFunction: "cubic-bezier(.79,.14,.15,.86)",
        margin: "0 auto",
      },
      "& > span": {
        visibility: "hidden",
      },
      "@keyframes LoadingSpinner": [
        [
          "0%",
          {
            transform: "rotate(0deg)",
          },
        ],
        [
          "100%",
          {
            transform: "rotate(720deg)",
          },
        ],
      ],
    }}
  >
    <span>{children}</span>
  </Span>
);
