import { MatchPathPatternConfig } from "../types";
import { matchPathPattern } from "./matchPathPattern";

const cases: Array<[MatchPathPatternConfig, boolean]> = [
  [
    {
      pathname: "/",
      pathPattern: "/",
      allowSuffix: true,
    },
    true,
  ],
  [
    {
      pathname: "/foo",
      pathPattern: "/",
      allowSuffix: true,
    },
    true,
  ],
  [
    {
      pathname: "/foo",
      pathPattern: "/",
      allowSuffix: false,
    },
    false,
  ],
  [
    {
      pathname: "/foo",
      pathPattern: "/:param1",
      allowSuffix: false,
    },
    true,
  ],
  [
    {
      pathname: "/foo/bar",
      pathPattern: "/foo/:param1",
      allowSuffix: false,
    },
    true,
  ],
  [
    {
      pathname: "/foo/bar",
      pathPattern: "/:param1/:param2",
      allowSuffix: false,
    },
    true,
  ],
  [
    {
      pathname: "/foo/bar/baz",
      pathPattern: "/:param1/:param2",
      allowSuffix: false,
    },
    false,
  ],
  [
    {
      pathname: "/foo/bar/baz",
      pathPattern: "/:param1/:param2",
      allowSuffix: true,
    },
    true,
  ],
  [
    {
      pathname: "/foo",
      pathPattern: "/hello",
      allowSuffix: false,
    },
    false,
  ],
  [
    {
      pathname: "/foo/bar",
      pathPattern: "/hello/:param1",
      allowSuffix: false,
    },
    false,
  ],
  [
    {
      pathname: "/foo/:bar/baz",
      pathPattern: "/hello/:param1/world",
      allowSuffix: false,
    },
    false,
  ],
  [
    {
      pathname: "/hello/something-something/world",
      pathPattern: "/hello/:param1/world",
      allowSuffix: false,
    },
    true,
  ],
  [
    {
      pathname: "/hello/something-something/world/something-something",
      pathPattern: "/hello/:param1/world",
      allowSuffix: false,
    },
    false,
  ],
  [
    {
      pathname: "/hello/something-something/world/something-something",
      pathPattern: "/hello/:param1/world",
      allowSuffix: true,
    },
    true,
  ],
];

test.each(cases)("correctly matches path pattern", (input, output) => {
  expect(matchPathPattern(input)).toBe(output);
});
