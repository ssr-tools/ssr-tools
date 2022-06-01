import { Style } from "@ssr-tools/css/components/Style";
import { useEffect } from "react";

export const Print = ({ text }: { text: string }) => {
  useEffect(() => {
    console.log(text);
  }, [text]);
  return (
    <Style
      element="h1"
      css={{
        "&": {
          color: "green",
        },
      }}
    >
      {text}
    </Style>
  );
};
