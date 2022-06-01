import { act } from "react-dom/test-utils";
import { mountRoot } from "../../../test-utils/mountRoot";
import { StyleCacheProvider } from "../components/StyleCacheProvider";
import { createStylable } from "./createStylable";

test("creates a correct html element", () => {
  const { container, root, cleanUp } = mountRoot();

  const P = createStylable("p");
  const Span = createStylable("span");

  const jsx = (
    <StyleCacheProvider>
      <P
        css={{
          "&": {
            color: "blue",
          },
        }}
      >
        Hello!
      </P>
      <Span
        className="external-class-name"
        css={{
          "&": {
            color: "green",
          },
        }}
      >
        Hello!
      </Span>
    </StyleCacheProvider>
  );

  act(() => {
    root.render(jsx);
  });

  expect(container.querySelectorAll("p")).toHaveLength(1);
  expect(container.querySelector("p")?.innerHTML).toBe("Hello!");
  expect(container.querySelector("span")?.className).toBe(
    "external-class-name css-536722b6"
  );
  expect(container.querySelector("style")?.innerHTML).toBe(
    ".css-56142238{color:blue}"
  );

  act(() => {
    root.render(jsx);
  });

  expect(document.head.querySelector("style")?.innerHTML).toBe(
    ".css-56142238{color:blue}"
  );

  cleanUp();
});
