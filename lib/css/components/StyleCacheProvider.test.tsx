import { lazy, Suspense } from "react";
import { act } from "react-dom/test-utils";

import { mountRoot } from "../../../test-utils/mountRoot";
import { StyleBuilder } from "./StyleBuilder";
import { StyleCacheProvider } from "./StyleCacheProvider";

test("caches styles correctly", () => {
  const { root, container, cleanUp } = mountRoot();

  const Test = () => (
    <StyleCacheProvider>
      <Styled />
    </StyleCacheProvider>
  );

  act(() => {
    root.render(<Test />);
  });

  // It should add all of the four styled divs
  expect(container.querySelectorAll(classNameSelector)).toHaveLength(4);

  // It should add only one <style /> to the container
  expect(container.querySelectorAll(styleSelector)).toHaveLength(1);

  // It should add only one <style /> to the head
  expect(document.head.querySelectorAll(styleSelector)).toHaveLength(1);

  act(() => {
    root.render(<Test />);
  });

  // All four divs should still be available in the container after re-render
  expect(container.querySelectorAll(classNameSelector)).toHaveLength(4);

  // There should be no <style /> in the container after re-render
  expect(container.querySelectorAll(styleSelector)).toHaveLength(0);

  // There should be exactly one <style /> in the head
  expect(document.head.querySelectorAll(styleSelector)).toHaveLength(1);

  cleanUp();
});

test("caches styles correctly with suspense", async () => {
  const { root, container, cleanUp } = mountRoot();

  const LazyTest = lazy(() =>
    Promise.resolve({
      default: Styled,
    })
  );

  const Test = () => (
    <StyleCacheProvider>
      <Suspense
        fallback={
          <StyleBuilder css={css}>
            {(className) => <div id="wait" className={className} />}
          </StyleBuilder>
        }
      >
        <LazyTest />
      </Suspense>
    </StyleCacheProvider>
  );

  act(() => {
    root.render(<Test />);
  });

  // It should add only one <style /> to the container
  expect(container.querySelectorAll(styleSelector)).toHaveLength(1);

  // It should show the fallback component
  expect(container.querySelectorAll(classNameSelector)).toHaveLength(1);
  expect(container.querySelector(classNameSelector)).toBe(
    container.querySelector("#wait")
  );

  await act(async () => {
    await LazyTest;
    root.render(<Test />);
  });

  // Fallback should disappear
  expect(container.querySelector("#wait")).toBe(null);

  // We should have four styled divs
  expect(container.querySelectorAll("div")).toHaveLength(4);

  // There should be exactly one style selector
  expect(container.querySelectorAll(styleSelector)).toHaveLength(1);

  cleanUp();
});

const Styled = () => (
  <>
    <StyleBuilder css={css}>
      {(className) => <div className={className}>Hello!</div>}
    </StyleBuilder>
    <StyleBuilder css={css}>
      {(className) => <div className={className}>Hello!</div>}
    </StyleBuilder>
    <StyleBuilder css={css}>
      {(className) => <div className={className}>Hello!</div>}
    </StyleBuilder>
    <StyleBuilder css={css}>
      {(className) => <div className={className}>Hello!</div>}
    </StyleBuilder>
  </>
);

const css = {
  "&": {
    color: "blue",
  },
};

// 56142238 is a hash sum for tested css object
const hash = "56142238";

const classNameSelector = `.css-${hash}`;

const styleSelector = `[data-style='style-${hash}']`;
