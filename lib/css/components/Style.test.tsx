import { act } from "react-dom/test-utils";

import { mountRoot } from "../../../test-utils/mountRoot";
import { Style } from "./Style";
import { StyleCacheProvider } from "./StyleCacheProvider";

test("creates styled element correctly", () => {
  const { root, container, cleanUp } = mountRoot();

  const jsx = (
    <StyleCacheProvider>
      <Style
        element="div"
        css={{
          "&": {
            color: "green",
          },
        }}
      >
        Hello!
      </Style>
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
