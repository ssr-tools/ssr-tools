import { CSSProperties } from "react";
import { stringifyCssProperties } from "./stringifyCssProperties";

const cases: Array<[CSSProperties, string]> = [
  [
    {
      borderTop: "1px solid black",
      borderBottom: "1px dotted green",
    },
    "border-top:1px solid black;border-bottom:1px dotted green",
  ],
  [
    {
      background: "url(https://example.example/example.jpg)",
      margin: "10px 10px 5px 5px",
    },
    "background:url(https://example.example/example.jpg);margin:10px 10px 5px 5px",
  ],
  [
    {
      color: "blue",
    },
    "color:blue",
  ],
  [
    {
      width: 300,
    },
    "width:300px",
  ],
  [
    {
      width: "3rem",
    },
    "width:3rem",
  ],
];

test.each(cases)("stringifies css properties correctly", (input, output) => {
  expect(stringifyCssProperties(input)).toBe(output);
});
