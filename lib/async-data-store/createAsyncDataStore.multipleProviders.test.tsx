import { act } from "react-dom/test-utils";

import { createAsyncDataStore } from "./createAsyncDataStore";
import { mountRoot } from "../../test-utils/mountRoot";
import { Suspense } from "react";

test("the same key in different providers does not cause namespace conflict", async () => {
  const { root, cleanUp } = mountRoot();

  const store1 = Promise.resolve("store1");

  const store2 = Promise.resolve("store2");

  const jsx = (
    <Store1.AsyncDataStoreProvider
      readers={{
        text: () => store1,
      }}
    >
      <Store2.AsyncDataStoreProvider
        readers={{
          text: () => store2,
        }}
      >
        <TestTexts />
      </Store2.AsyncDataStoreProvider>
    </Store1.AsyncDataStoreProvider>
  );

  act(() => root.render(jsx));

  expect(document.querySelector("#store1-fallback")?.textContent).toBe(
    "Wait for store1..."
  );
  expect(document.querySelector("#store1-text")).toBeNull();

  expect(document.querySelector("#store2-fallback")?.textContent).toBe(
    "Wait for store2..."
  );
  expect(document.querySelector("#store2-text")).toBeNull();

  await act(async () => {
    await store1;
    await store2;
    root.render(jsx);
  });

  expect(document.querySelector("#store1-text")?.textContent).toBe("store1");
  expect(document.querySelector("#store2-text")?.textContent).toBe("store2");

  expect(
    document.querySelectorAll("script")[0].getAttribute("data-async-store-key")
  ).not.toBe(
    document.querySelectorAll("script")[1].getAttribute("data-async-store-key")
  );

  cleanUp();
});

const Store1 = createAsyncDataStore<{
  text: string;
}>({
  uniqueIdentifier: "store1",
});

const Store2 = createAsyncDataStore<{
  text: string;
}>({
  uniqueIdentifier: "store2",
});

const TestTexts = () => (
  <>
    <Suspense fallback={<p id="store1-fallback">Wait for store1...</p>}>
      <Store1.AsyncData dataKey="text">
        {(data) => <p id="store1-text">{data}</p>}
      </Store1.AsyncData>
    </Suspense>
    <Suspense fallback={<p id="store2-fallback">Wait for store2...</p>}>
      <Store2.AsyncData dataKey="text">
        {(data) => <p id="store2-text">{data}</p>}
      </Store2.AsyncData>
    </Suspense>
  </>
);
