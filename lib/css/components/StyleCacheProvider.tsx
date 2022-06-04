import React, { FC, ReactNode, useRef } from "react";
import { StyleCacheContext } from "../private/StyleCacheContext";

export const StyleCacheProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const stylesCache = useRef(new Set<string>());

  return (
    <StyleCacheContext.Provider
      value={{
        stylesCache,
      }}
    >
      {children}
    </StyleCacheContext.Provider>
  );
};

// HACK:
// React.Suspense with a new architecture of React 18, makes it a bit harder to
// cache <style /> occurrences. The `fallback` prop mounts and unmounts on the
// server-side, without calling any life-cycle methods.
//
// If there was a <StyleBuilder /> in a `fallback` we may think that we can
// safely add a hash of the CSS to our cache, so we don't need to add <style />
// tag again. However, once the suspense boundary is resolved, React removes
// the `fallback` element with the <style /> from the DOM. There's no way of
// invalidating our cache in this case, so we don't add <style /> again because
// we have a hash cached. However the <style /> with a hash does not exist
// in the DOM anymore, so the CSS is never applied.
//
// The only to deal with this is to create a separate cache for the `fallback`s,
// but it's error prone if it has to be done manually. The only way to
// automatize it is by monkey patching the Suspense component in the React
// module.
let suspenseWasPatched = false;

if (!suspenseWasPatched) {
  suspenseWasPatched = true;

  const OriginalSuspense = React.Suspense;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  React.Suspense = ({ children, fallback }) => (
    <OriginalSuspense
      fallback={<StyleCacheProvider>{fallback}</StyleCacheProvider>}
    >
      {children}
    </OriginalSuspense>
  );
}
