import { ReactNode, useMemo, useRef } from "react";
import {
  // eslint-disable-next-line import/named
  ArrayInterpolation,
  // eslint-disable-next-line import/named
  CSSObject,
  serializeStyles,
} from "@emotion/serialize";
import hashSum from "hash-sum";

export const Style = (props: {
  // TODO: set up pre-built component like Style.div or Style.span, for convenience
  element: keyof JSX.IntrinsicElements;
  css: CSSObject;
  identifier?: string;
  children?: ReactNode;
}) => {
  // TODO: handle style insertion to <head> on the client side, to reflect changes
  // in props.css
  const css = useRef(props.css).current;

  const className = useMemo(() => {
    const sum = hashSum(css);

    const className = props.identifier
      ? `${props.identifier}_${sum}`
      : `${props.element}_${sum}`;

    return className;
  }, [css, props.element, props.identifier]);

  const topLevelSelector = `.${className}`;

  const serializedStyle = useMemo(
    () =>
      // TODO: get rid of `serializeStyles`. This kind of dependency is unwanted
      // here, since it adds complexity and a size burden.
      serializeStyles(
        Object.entries(css).reduce(
          (acc, [key, value]) => {
            if (typeof value === "object") {
              acc.push({
                [key.replace(/&/g, topLevelSelector)]: value,
              });
              return acc;
            }

            if (
              acc[0] &&
              typeof acc[0] === "object" &&
              !Array.isArray(acc[0])
            ) {
              const topLevel = acc[0] as Record<string, CSSObject>;
              topLevel[topLevelSelector][key] = value;
              return acc;
            }

            return acc;
          },
          [
            {
              [topLevelSelector]: {},
            },
          ] as ArrayInterpolation<unknown>
        ),
        {}
      ),
    [css, topLevelSelector]
  );

  return (
    <>
      {/*
       * TODO: for better performance we should add the style tag only
       * if a given `topLevelSelector` occurs for the first time.
       * If the style gets updated on the client we should not rerender the
       * component, but inject the new styles to <head />.
       */}
      <style
        dangerouslySetInnerHTML={{
          __html: serializedStyle.styles,
        }}
      />
      {/* TODO: handle a version of Style that provides `className` to children */}
      <props.element className={className}>{props.children}</props.element>
    </>
  );
};
