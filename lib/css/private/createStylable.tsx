import {
  createElement,
  DetailedHTMLFactory,
  ReactHTML,
  ReactNode,
} from "react";
import { StyleBuilder } from "../components/StyleBuilder";
import { CssObject } from "./stringifyCss";

export function createStylable<
  T extends keyof ReactHTML,
  E extends ReactHTML[T]
>(htmlElement: T) {
  return ({
    css,
    cssIdentifier,
    className: externalClassName,
    ...props
  }: PropsFromHtml<T, E> & {
    css: CssObject;
    cssIdentifier?: string;
    className?: string;
    children?: ReactNode;
  }) => (
    <StyleBuilder css={css} identifier={cssIdentifier}>
      {(className) =>
        createElement(htmlElement, {
          ...props,
          className: externalClassName
            ? `${externalClassName} ${className}`
            : className,
        })
      }
    </StyleBuilder>
  );
}

type PropsFromHtml<
  T extends keyof ReactHTML,
  E extends ReactHTML[T]
> = E extends DetailedHTMLFactory<infer Props, infer Element> ? Props : never;
