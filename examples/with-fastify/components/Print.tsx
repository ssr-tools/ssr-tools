import { StyleBuilder } from "@ssr-tools/css/components/StyleBuilder";
import { useEffect } from "react";

export const Print = ({ text }: { text: string }) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(text);
  }, [text]);
  return (
    <StyleBuilder
      css={{
        "&": {
          textTransform: "uppercase",
        },
      }}
    >
      {(className) => <h1 className={className}>{text}</h1>}
    </StyleBuilder>
  );
};
