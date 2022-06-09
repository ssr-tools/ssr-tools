import { act } from "react-dom/test-utils";

import { createAsyncDataStore } from "./createAsyncDataStore";
import { mountRoot } from "../../test-utils/mountRoot";
import { Suspense } from "react";

test("renders fallback and data", async () => {
  const { root, cleanUp } = mountRoot();

  const textPromise = Promise.resolve("Hello world");

  const jsx = (
    <AsyncDataStoreProvider
      readers={{
        text: () => textPromise,
      }}
    >
      <Suspense fallback={<p id="wait">Wait...</p>}>
        <AsyncData dataKey="text">
          {(data) => <p id="text">{data}</p>}
        </AsyncData>
      </Suspense>
    </AsyncDataStoreProvider>
  );

  act(() => root.render(jsx));

  // Expect loader {
  expect(document.querySelector("#wait")?.innerHTML).toBe("Wait...");
  expect(document.querySelector("#text")).toBeNull();
  expect(
    document.querySelector('[data-async-store-key="text-:r0:"]')
  ).toBeNull();
  // }

  await act(async () => {
    await textPromise;
    return root.render(jsx);
  });

  // Expect text {
  expect(document.querySelector("#wait")).toBeNull();
  expect(document.querySelector("#text")?.innerHTML).toBe("Hello world");
  // }

  // Expect data script {
  const dataElement = document.querySelector(
    '[data-async-store-key="text-:r0:"]'
  );

  const parsedData =
    dataElement?.innerHTML && JSON.parse(dataElement.innerHTML);

  expect(parsedData).toEqual({
    value: "Hello world",
  });
  // }

  cleanUp();
});

const { AsyncData, AsyncDataStoreProvider } = createAsyncDataStore<{
  text: string;
}>({});
