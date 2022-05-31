export const toDashCase = (camelCase: string) =>
  camelCase.replace(/[A-Z]/g, (substr: string) => {
    const lowerCase = substr.toLowerCase();
    return "-" + lowerCase;
  });
