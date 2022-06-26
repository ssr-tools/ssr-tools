import { ComponentProps, FC, useState } from "react";
import { Print } from "../components/Print";
import { Div } from "@ssr-tools/css/stylable/Div";
import { A } from "@ssr-tools/css/stylable/A";
import { Button } from "@ssr-tools/css/stylable/Button";

export const CssPage = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <Print text="Css" />
      <A
        css={{
          "&": {
            display: "block",
            margin: "20px 0",
          },
        }}
        href="https://www.npmjs.com/package/@ssr-tools/css"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.npmjs.com/package/@ssr-tools/css
      </A>
      <BlueText data-test-id="counter">{counter}</BlueText>
      {counter < 3 && (
        <BlueText data-test-id="disappear">
          I'll disappear if counter is bigger than 3
        </BlueText>
      )}
      <Button
        data-test-id="add-1"
        css={{
          "&": {
            display: "block",
            margin: "20px 0px",
          },
        }}
        onClick={() => setCounter((value) => value + 1)}
      >
        Add 1
      </Button>
    </>
  );
};

const BlueText: FC<Omit<ComponentProps<typeof Div>, "css">> = (props) => (
  <Div
    {...props}
    css={{
      "&": {
        color: "blue",
      },
    }}
  />
);
