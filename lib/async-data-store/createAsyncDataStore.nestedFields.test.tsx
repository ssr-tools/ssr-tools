import { act } from "react-dom/test-utils";

import { createAsyncDataStore } from "./createAsyncDataStore";
import { mountRoot } from "../../test-utils/mountRoot";
import { Suspense } from "react";

test("renders fallback and data", async () => {
  const { root, cleanUp } = mountRoot();

  const textSlowPromise = new Promise<string>((resolve) =>
    setTimeout(() => resolve("Slow text"), 50)
  );

  const textFastPromise = new Promise<string>((resolve) =>
    setTimeout(() => resolve("Fast text"), 25)
  );

  const jsx = (
    <AsyncDataStoreProvider
      readers={{
        textSlow: () => textSlowPromise,
        textFast: () => textFastPromise,
      }}
    >
      <TestTexts />
    </AsyncDataStoreProvider>
  );

  act(() => root.render(jsx));

  // Expect loader for both texts {
  expect(document.querySelector("#waitBoth")?.innerHTML).toBe(
    "Wait both texts..."
  );
  expect(document.querySelector("#textSlow")).toBeNull();

  expect(
    document.querySelector('[data-async-store-key="textSlow-:r0:"]')
  ).toBeNull();
  expect(document.querySelector("#textFast")).toBeNull();
  expect(
    document.querySelector('[data-async-store-key="textFast-:r0:"]')
  ).toBeNull();
  // }

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    root.render(jsx);
  });

  // Expect loader for both texts {
  expect(document.querySelector("#waitBoth")?.innerHTML).toBe(
    "Wait both texts..."
  );
  expect(document.querySelector("#textSlow")).toBeNull();

  expect(
    document.querySelector('[data-async-store-key="textSlow-:r0:"]')
  ).toBeNull();

  expect(document.querySelector("#textFast")).toBeNull();
  expect(
    document.querySelector('[data-async-store-key="textFast-:r0:"]')
  ).toBeNull();
  // }

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 65));
    root.render(jsx);
  });

  // Expect both text loaded {
  expect(document.querySelector("#waitBoth")).toBe(null);

  expect(document.querySelector("#textSlow")?.innerHTML).toBe(
    'Slow text <span id="textFast">Fast text</span>'
  );

  expect(
    document.querySelector('[data-async-store-key="textSlow-:r0:"]')?.innerHTML
  ).toBe('{"value":"Slow text"}');

  expect(document.querySelector("#textFast")?.innerHTML).toBe("Fast text");

  expect(
    document.querySelector('[data-async-store-key="textFast-:r0:"]')?.innerHTML
  ).toBe('{"value":"Fast text"}');
  // }

  cleanUp();
});

const { AsyncData, AsyncDataStoreProvider } = createAsyncDataStore<{
  textSlow: string;
  textFast: string;
}>({});

const TestTexts = () => (
  <>
    <Suspense fallback={<p id="waitBoth">Wait both texts...</p>}>
      <AsyncData dataKey="textSlow">
        {(textSlow) => (
          <AsyncData dataKey="textFast">
            {(textFast) => (
              <p id="textSlow">
                {textSlow} <span id="textFast">{textFast}</span>
              </p>
            )}
          </AsyncData>
        )}
      </AsyncData>
    </Suspense>
  </>
);
