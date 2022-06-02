import {
  createElement,
  DetailedHTMLFactory,
  DetailedHTMLProps,
  forwardRef,
  ReactHTML,
  ReactNode,
} from "react";
import { StyleBuilder } from "../components/StyleBuilder";
import { CssObject } from "./stringifyCss";

export function createStylable<
  T extends keyof ReactHTML,
  E extends ReactHTML[T]
>(htmlElement: T) {
  return forwardRef(
    (
      {
        css,
        cssIdentifier,
        className: externalClassName,
        ...props
      }: PropsFromHtml<T, E> & {
        css: CssObject;
        cssIdentifier?: string;
        className?: string;
        children?: ReactNode;
      },
      forwardedRef
    ) => (
      <StyleBuilder css={css} identifier={cssIdentifier}>
        {(className) =>
          createElement(htmlElement, {
            ...props,
            ref: forwardedRef,
            className: externalClassName
              ? `${externalClassName} ${className}`
              : className,
          })
        }
      </StyleBuilder>
    )
  );
}

type PropsFromHtml<
  T extends keyof ReactHTML,
  E extends ReactHTML[T]
> = E extends DetailedHTMLFactory<infer Props, infer Element>
  ? DetailedHTMLProps<Props, Element>
  : never;
