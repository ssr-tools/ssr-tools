import { serverModuleRegExp } from "./serverModuleRegExp";

const cases: Array<[string, boolean]> = [
  ["server", true],
  ["Component.server", true],
  ["ComponentComponentComponent.server", true],
  ["server.Component", false],
  ["Component.client", false],
  ["server.client", false],
  ["client.server", true],
  ["Component", false],
  ["client.Component", false],
  ["ServerComponent", false],
  ["ComponentServer", false],
  ["component-server", false],
  ["component-server.server", true],
  ["serverserverserver", false],
];

test.each(cases)("matches only server-side modules", (input, output) => {
  expect(serverModuleRegExp.test(input)).toBe(output);
});
