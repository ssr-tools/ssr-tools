import { createPathParams } from "./createPathParams";

const cases: Array<
  [Parameters<typeof createPathParams>, Record<string, string> | null]
> = [
  [["/hello", "/hello/value1/world/value2"], null],
  [
    ["/hello/:foo/world/:bar", "/hello/value1/world/value2"],
    {
      foo: "value1",
      bar: "value2",
    },
  ],
  [
    ["/hello/:foo/:bar/:baz", "/hello/value1/value2/value3"],
    {
      foo: "value1",
      bar: "value2",
      baz: "value3",
    },
  ],
  [
    ["/hello/:foo/:bar/:baz", "/hello/value1"],
    {
      foo: "value1",
      bar: "",
      baz: "",
    },
  ],
];

test.each(cases)("correctly creates path params", (input, output) => {
  expect(createPathParams(...input)).toEqual(output);
});
