import { Nav } from "@ssr-tools/css/stylable/Nav";
import { A } from "../config/router";

export const Navigation = () => (
  <Nav
    css={{
      "&": {
        display: "flex",
        columnGap: 10,
      },
    }}
  >
    <A pathPattern="/">Index</A>
    <A pathPattern="/first-page">First page</A>
    <A pathPattern="/second-page">Second page</A>
  </Nav>
);
