import { CSSProperties } from "react";
import { stringifyCssProperties } from "./stringifyCssProperties";

export const stringifyCss = (className: string, css: CssObject) => {
  return Object.entries(css).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      const contextChunk = createCssContextChunk({
        key,
        context: value,
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

const createCssContextChunk = ({
  className,
  context,
  key,
}: {
  className: string;
  context: Array<[string, CSSProperties]>;
  key: string;
}) => {
  const chunks = context
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

export type CssObject = Record<
  string,
  CSSProperties | Array<[string, CSSProperties]>
>;

export type SimpleCssObject = Record<string, CSSProperties>;
