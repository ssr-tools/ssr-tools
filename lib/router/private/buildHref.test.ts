import { buildHref } from "./buildHref";

const cases: Array<[Parameters<typeof buildHref>, string]> = [
  [["/"], "/"],
  [
    [
      "/",
      {
        hash: "ok",
      },
    ],
    "/#ok",
  ],
  [
    [
      "/",
      {
        searchParams: {
          hello: "world",
        },
      },
    ],
    "/?hello=world",
  ],
  [["/foo"], "/foo"],
  [
    [
      "/foo/:bar",
      {
        pathParams: {
          bar: "123",
        },
      },
    ],
    "/foo/123",
  ],
  [
    [
      "/foo",
      {
        searchParams: {
          hello: "world",
        },
      },
    ],
    "/foo?hello=world",
  ],
  [
    [
      "/items/:id/:subId",
      {
        searchParams: {
          page: "1",
          perPage: "2",
        },
        pathParams: {
          id: "123",
          subId: "456",
        },
      },
    ],
    "/items/123/456?page=1&perPage=2",
  ],
  [
    [
      "/items/:id/:subId/something",
      {
        searchParams: {
          page: "3002",
          perPage: "2004",
        },
        pathParams: {
          id: "999",
          subId: "888",
        },
      },
    ],
    "/items/999/888/something?page=3002&perPage=2004",
  ],
  [
    [
      "/hello",
      {
        searchParams: {
          utmId: "321",
        },
        pathParams: {
          id: "999",
          subId: "888",
        },
      },
    ],
    "/hello?utmId=321",
  ],
  [
    [
      "/hello/:param1/world",
      {
        pathParams: {
          id: "999",
          subId: "888",
        },
      },
    ],
    "/hello/__null__/world",
  ],
  [
    [
      "/hello",
      {
        hash: "ok",
      },
    ],
    "/hello#ok",
  ],
  [
    [
      "/items/:id/:subId/something",
      {
        searchParams: {
          page: "3002",
          perPage: "2004",
        },
        pathParams: {
          id: "999",
          subId: "888",
        },
        hash: "some-hash",
      },
    ],
    "/items/999/888/something?page=3002&perPage=2004#some-hash",
  ],
];

test.each(cases)("builds href correctly", (input, output) => {
  expect(buildHref(...input)).toBe(output);
});
