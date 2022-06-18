import { act } from "react-dom/test-utils";

import { createAsyncDataStore } from "./createAsyncDataStore";
import { mountRoot } from "../../test-utils/mountRoot";
import { Suspense } from "react";

test("renders fallback and data", async () => {
  const { root, cleanUp } = mountRoot();

  const textSlowPromise = new Promise<string>((resolve) =>
    setTimeout(() => resolve("Slow text"), 100)
  );

  const textFastPromise = new Promise<string>((resolve) =>
    setTimeout(() => resolve("Fast text"), 50)
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

  // Expect loader for the slow text {
  expect(document.querySelector("#waitSlow")?.innerHTML).toBe(
    "Wait for slow text..."
  );
  expect(document.querySelector("#textSlow")).toBeNull();
  expect(
    document.querySelector('[data-async-store-key="textSlow-:r0:"]')
  ).toBeNull();
  // }

  // Expect loader for the fast text {
  expect(document.querySelector("#waitFast")?.innerHTML).toBe(
    "Wait for fast text..."
  );
  expect(document.querySelector("#textFast")).toBeNull();
  expect(
    document.querySelector('[data-async-store-key="textFast-:r0:"]')
  ).toBeNull();
  // }

  await act(async () => {
    await textFastPromise;
    root.render(jsx);
  });

  // Expect loader for the slow text {
  expect(document.querySelector("#waitSlow")?.innerHTML).toBe(
    "Wait for slow text..."
  );
  expect(document.querySelector("#textSlow")).toBeNull();
  // }

  // Expect fast text to be loaded {
  expect(document.querySelector("#waitFast")).toBeNull();
  expect(document.querySelector("#textFast")?.innerHTML).toBe("Fast text");
  // }

  // Expect script for the fast text {
  const dataTextFastElement = document.querySelector(
    '[data-async-store-key="textFast-:r0:"]'
  );

  expect(
    document.querySelectorAll('[data-async-store-key="textFast-:r0:"]')
  ).toHaveLength(1);

  const parsedTextFastData =
    dataTextFastElement?.innerHTML && JSON.parse(dataTextFastElement.innerHTML);

  expect(parsedTextFastData).toEqual({
    value: "Fast text",
  });
  // }

  await act(async () => {
    await textSlowPromise;
    root.render(jsx);
  });

  // Expect slow text to be loaded {
  expect(document.querySelector("#waitSlow")).toBeNull();
  expect(document.querySelector("#textSlow")?.innerHTML).toBe("Slow text");
  // }

  // Expect script for the slow text {
  expect(
    document.querySelectorAll('[data-async-store-key="textSlow-:r0:"]')
  ).toHaveLength(1);
  expect(
    document.querySelectorAll('[data-async-store-key="textFast-:r0:"]')
  ).toHaveLength(1);

  const dataTextSlowElement = document.querySelector(
    '[data-async-store-key="textSlow-:r0:"]'
  );

  const parsedTextSlowData =
    dataTextSlowElement?.innerHTML && JSON.parse(dataTextSlowElement.innerHTML);

  expect(parsedTextSlowData).toEqual({
    value: "Slow text",
  });
  // }

  cleanUp();
});

const { AsyncData, AsyncDataStoreProvider } = createAsyncDataStore<{
  textSlow: string;
  textFast: string;
}>({});

const TestTexts = () => (
  <>
    <Suspense fallback={<p id="waitSlow">Wait for slow text...</p>}>
      <AsyncData dataKey="textSlow">
        {(data) => <p id="textSlow">{data}</p>}
      </AsyncData>
    </Suspense>
    <Suspense fallback={<p id="waitFast">Wait for fast text...</p>}>
      <AsyncData dataKey="textFast">
        {(data) => <p id="textFast">{data}</p>}
      </AsyncData>
    </Suspense>
  </>
);
