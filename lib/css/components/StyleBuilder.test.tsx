import { act } from "react-dom/test-utils";

import { mountRoot } from "../../../test-utils/mountRoot";
import { StyleBuilder } from "./StyleBuilder";
import { StyleCacheProvider } from "./StyleCacheProvider";

test("creates styled element correctly", () => {
  const { root, container, cleanUp } = mountRoot();

  const jsx = (
    <StyleCacheProvider>
      <StyleBuilder
        css={{
          "&": {
            color: "green",
          },
        }}
      >
        {(className) => <div className={className}>Hello!</div>}
      </StyleBuilder>
    </StyleCacheProvider>
  );

  act(() => {
    root.render(jsx);
  });

  expect(container.querySelectorAll("div")).toHaveLength(1);
  expect(container.querySelector("div")?.innerHTML).toBe("Hello!");
  expect(container.querySelector("div")?.className).toBe("css-536722b6");
  expect(container.querySelector("style")?.innerHTML).toBe(
    ".css-536722b6{color:green}"
  );

  act(() => {
    root.render(jsx);
  });

  expect(document.head.querySelector("style")?.innerHTML).toBe(
    ".css-536722b6{color:green}"
  );

  cleanUp();
});
