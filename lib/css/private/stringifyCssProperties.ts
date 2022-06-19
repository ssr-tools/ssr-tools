import { toDashCase } from "./toDashCase";
import { CSSProperties } from "react";

export const stringifyCssProperties = (cssProperties: CSSProperties) =>
  Object.entries(cssProperties).reduce((acc, [key, value]) => {
    const appliedValue = typeof value === "number" ? `${value}px` : value;
    const nextProp = `${toDashCase(key)}:${appliedValue}`;
    return acc.length === 0 ? nextProp : [acc, nextProp].join(";");
  }, "");
