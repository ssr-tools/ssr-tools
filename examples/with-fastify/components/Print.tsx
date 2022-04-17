import { useEffect } from "react";
import styled from "@emotion/styled";

export const Print = ({ text }: { text: string }) => {
  useEffect(() => {
    console.log(text);
  }, [text]);
  return <StyledH1>{text}</StyledH1>;
};

const StyledH1 = styled("h1")({
  color: "red",
});
