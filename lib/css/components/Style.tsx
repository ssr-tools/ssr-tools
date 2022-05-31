import { ReactNode, useContext, useInsertionEffect } from "react";
import hashSum from "hash-sum";
import { StyleCacheContext } from "../private/StyleCacheContext";

/**
 * A base unit where we define the CSS for the DOM elements.
 */
export const Style = ({
  css,
  element: Element,
  children,
}: {
  // TODO: set up pre-built component like Style.div or Style.span, for convenience
  // Bear in mind it should be tree-shakable.
  element: keyof JSX.IntrinsicElements;
  // TODO: add docs to explain how `css` prop works here
  css: Record<string, unknown>;
  // TODO: handle identifier for easier debugging. It should be included in the
  // resultant `className`
  identifier?: string;
  // TODO: it should also take a function that just gets a `className`, so that
  // we can pass the `className` to non-intrinsic components as well.
  children?: ReactNode;
}) => {
  const { stylesCache } = useContext(StyleCacheContext);

  // TODO: implement own hashSum fn to avoid external dependency
  const hash = hashSum(css);

  const dataStyle = `style-${hash}`;
  const styleSelector = `[data-style='${dataStyle}']`;

  // TODO: implement css stringifer and stringify `css` object
  const cssStringifed = "";

  useInsertionEffect(() => {
    if (document.querySelector(styleSelector)) {
      // The <style /> is in the <head /> already, let's skip the effect
      return;
    }

    const styleElement = document.createElement("style");

    styleElement.setAttribute("data-style", dataStyle);

    styleElement.innerHTML = `<style data-style="${dataStyle}">${cssStringifed}</style>`;

    // Append the <style /> to the <head />, so that CSS persists
    // after re-render. Otherwise, styles disappears on the second render,
    // since we have the hash in the `stylesCache` already.
    document.head.append(styleElement);
  }, [cssStringifed, styleSelector, dataStyle]);

  // Don't render the <style /> if we have it in cache. That means it's a
  // second render, so we have a given style in the <head /> already.
  if (stylesCache.current.has(hash)) {
    return <Element>{children}</Element>;
  }

  // Cache the given hash, so on the second and subsequent renders
  // we know that we should not render <style /> again.
  // Otherwise, we may end up with a huge burden of many <style /> tags
  // created for each occurrence of a component in a given render.
  stylesCache.current.add(hash);

  return (
    <>
      <style
        data-style={dataStyle}
        dangerouslySetInnerHTML={{
          __html: cssStringifed,
        }}
      />
      <Element>{children}</Element>
    </>
  );
};
