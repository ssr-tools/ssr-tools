import { ReactNode, useContext, useInsertionEffect } from "react";
import hashSum from "hash-sum";
import { StyleCacheContext } from "../private/StyleCacheContext";
import { CssObject, stringifyCss } from "../private/stringifyCss";

export function StyleBuilder({
  css,
  children,
  identifier,
}: {
  // TODO: add docs to explain how `css` prop works here
  css: CssObject;
  // TODO: handle identifier for easier debugging. It should be included in the
  // resultant `className`
  identifier?: string;
  children: (className: string) => ReactNode;
}) {
  const { stylesCache } = useContext(StyleCacheContext);

  // TODO: implement own hashSum fn to avoid external dependency
  const hash = identifier ? `${identifier}-${hashSum(css)}` : hashSum(css);

  const dataStyle = `style-${hash}`;
  const styleSelector = `[data-style='${dataStyle}']`;
  const className = `css-${hash}`;
  const cssStringified = stringifyCss(className, css);

  useInsertionEffect(() => {
    if (document.querySelector(styleSelector)) {
      // The <style /> is in the <head /> already, let's skip the effect
      return;
    }

    const styleElement = document.createElement("style");

    styleElement.setAttribute("data-style", dataStyle);

    styleElement.innerHTML = cssStringified;

    // Append the <style /> to the <head />, so that CSS persists
    // after re-render. Otherwise, styles disappears on the second render,
    // since we have the hash in the `stylesCache` already.
    document.head.append(styleElement);
  }, [cssStringified, styleSelector, dataStyle]);

  // Don't render the <style /> if we have it in cache. That means it's a
  // second render, so we have a given style in the <head /> already.
  if (stylesCache.current.has(hash)) {
    return <>{children(className)}</>;
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
          __html: cssStringified,
        }}
      />
      {children(className)}
    </>
  );
}
