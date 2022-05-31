import { act } from "react-dom/test-utils";

import { mountRoot } from "../../../test-utils/mountRoot";
import { Style } from "./Style";
import { StyleCacheProvider } from "./StyleCacheProvider";

test("caches styles correctly", () => {
  const { root, container, cleanUp } = mountRoot();

  act(() => {
    root.render(<Test />);
  });

  // It should add all of the four styled divs
  expect(container.querySelectorAll("div")).toHaveLength(4);

  // It should add only one <style /> to the container
  expect(
    // 56142238 is a hash sum for tested css object
    container.querySelectorAll("[data-style='style-56142238']")
  ).toHaveLength(1);

  // It should add only one <style /> to the head
  expect(
    document.head.querySelectorAll("[data-style='style-56142238']")
  ).toHaveLength(1);

  act(() => {
    root.render(<Test />);
  });

  // All four divs should still be available in the container after re-render
  expect(container.querySelectorAll("div")).toHaveLength(4);

  // There should be no <style /> in the container after re-render
  expect(
    container.querySelectorAll("[data-style='style-56142238']")
  ).toHaveLength(0);

  // There should be exactly one <style /> in the head
  expect(
    document.head.querySelectorAll("[data-style='style-56142238']")
  ).toHaveLength(1);

  cleanUp();
});

const Test = () => (
  <StyleCacheProvider>
    <Style element="div" css={css} />
    <Style element="div" css={css} />
    <Style element="div" css={css} />
    <Style element="div" css={css} />
  </StyleCacheProvider>
);

const css = {
  "&": {
    color: "blue",
  },
};
