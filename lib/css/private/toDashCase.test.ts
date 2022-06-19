import { toDashCase } from "./toDashCase";

const cases = [
  ["marginTop", "margin-top"],
  ["borderBottomLeft", "border-bottom-left"],
  ["border", "border"],
];

test.each(cases)(
  "correcly transforms from dash case to camel case",
  (input, output) => {
    expect(toDashCase(input)).toBe(output);
  }
);
