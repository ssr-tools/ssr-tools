import { CSSProperties } from "react";
import { Nested } from "../Nested";
import { stringifyCssProperties } from "./stringifyCssProperties";
import { CssObject } from "./types";

export const stringifyCss = (className: string, css: CssObject) => {
  return Object.entries(css).reduce((acc, [key, value]) => {
    if (value instanceof Nested) {
      const contextChunk = createNestedCssChunk({
        key,
        nested: value,
        className,
      });

      return acc + contextChunk;
    }

    const simpleChunk = createSimpleCssChunk({
      className,
      key,
      cssProperties: value,
    });

    return acc + simpleChunk;
  }, "");
};

const createNestedCssChunk = ({
  className,
  nested,
  key,
}: {
  className: string;
  nested: Nested;
  key: string;
}) => {
  const chunks = Object.entries(nested.css)
    .map(([nestedKey, cssProperties]) => {
      return createSimpleCssChunk({
        className,
        key: nestedKey,
        cssProperties,
      });
    }, "")
    .join("");

  return `${key}{${chunks}}`;
};

const createSimpleCssChunk = ({
  className,
  cssProperties,
  key,
}: {
  className: string;
  cssProperties: CSSProperties;
  key: string;
}) => {
  const stringifiedProperties = stringifyCssProperties(cssProperties);
  const selector = key.replace(/[&]/g, `.${className}`);
  return `${selector}{${stringifiedProperties}}`;
};
