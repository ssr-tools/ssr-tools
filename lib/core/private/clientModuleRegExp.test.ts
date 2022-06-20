import { clientModuleRegExp } from "./clientModuleRegExp";

const cases: Array<[string, boolean]> = [
  ["client", true],
  ["Component.client", true],
  ["ComponentComponentComponent.client", true],
  ["client.Component", false],
  ["Component.server", false],
  ["server.client", true],
  ["client.server", false],
  ["Component", false],
  ["client.Component", false],
  ["ClientComponent", false],
  ["ComponentClient", false],
  ["component-client", false],
  ["component-client.client", true],
  ["clientclientclient", false],
];

test.each(cases)("matches only client-side modules", (input, output) => {
  expect(clientModuleRegExp.test(input)).toBe(output);
});
