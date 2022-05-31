import { toDashCase } from "./toDashCase";
import { CSSProperties } from "react";

export const stringifyCssProperties = (cssProperties: CSSProperties) =>
  Object.entries(cssProperties).reduce((acc, [key, value]) => {
    const nextProp = `${toDashCase(key)}:${value}`;
    return acc.length === 0 ? nextProp : [acc, nextProp].join(";");
  }, "");
