const cases = [
  ["marginTop", "margin-top"],
  ["borderBottomLeft", "border-bottom-left"],
  ["border", "border"],
];

test.each(cases)("changes to dash case", (input, output) => {
  expect(toDashCase(input)).toBe(output);
});

const toDashCase = (camelCase: string) => {
  return camelCase.replace(
    /[A-Z]/g,
    (substr: string, index: number, original: string) => {
      const lowerCase = substr.toLowerCase();
      return "-" + lowerCase;
    }
  );
};
