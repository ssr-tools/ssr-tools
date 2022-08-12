import { Nested } from "../Nested";
import { stringifyCss } from "./stringifyCss";
import { CssObject } from "./types";

const cases: Array<[[string, CssObject], string]> = [
  [
    [
      "foo",
      {
        "&": {
          color: "blue",
        },
      },
    ],
    ".foo{color:blue}",
  ],
  [
    [
      "bar",
      {
        "&": {
          color: "blue",
        },
        "& > div": {
          color: "green",
          backgroundColor: "black",
        },
      },
    ],
    ".bar{color:blue}.bar > div{color:green;background-color:black}",
  ],
  [
    [
      "baz",
      {
        "&": {
          color: "blue",
        },
        "@media (min-width: 640px)": new Nested({
          "&": {
            color: "yellow",
          },
        }),
      },
    ],
    ".baz{color:blue}@media (min-width: 640px){.baz{color:yellow}}",
  ],
  [
    [
      "baz",
      {
        "&": {
          color: "blue",
        },
        "@keyframes my-animation": new Nested({
          "0%": {
            color: "blue",
          },
          "50%": {
            color: "yellow",
          },
          "100%": {
            color: "green",
          },
        }),
      },
    ],
    ".baz{color:blue}@keyframes my-animation{0%{color:blue}50%{color:yellow}" +
      "100%{color:green}}",
  ],
];

test.each(cases)(
  "stringifies css properties correctly",
  ([className, css], output) => {
    expect(stringifyCss(className, css)).toBe(output);
  }
);
