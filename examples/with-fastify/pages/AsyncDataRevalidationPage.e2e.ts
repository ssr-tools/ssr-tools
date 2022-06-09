import { goToPage } from "../../../test-utils/goToPage";
import { promisify } from "util";

jest.setTimeout(300000);

// The scenario here is the following:
// 1. We have the text1 as the initial data
// 2. We switch to text2
//   - it should load on the client-side
// 3. We quickly go back to text1
//   - there was not enough time to invalidate the cache
//   - therefore, we still have the initial data
// 4. Now, we wait 3 seconds
// 5. We switch to text2
//   - now the cache is invalidated
//   - it should load again on the client-side
// 6. We switch to text1
//  - it also loads on the client-side now
test("renders /async-data-revalidation correctly", async () => {
  const { consoleLines } = await goToPage(
    new URL("async-data-revalidation", "http://localhost:3000")
  );

  const heading = await page.evaluate(
    () => document.querySelector("h1")?.textContent
  );

  expect(heading).toBe("AsyncDataPageRevalidation");

  expect(consoleLines).toContainEqual({
    type: "log",
    text: "AsyncDataPageRevalidation",
  });

  // Initial text
  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='text1']")?.textContent
    )
  ).toBe("Text 1, server-side, 1 call");

  // Switching to text2
  await page.click("[data-test-id='change-to-text2']");

  // It has to load...
  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='fallback-text2']")?.textContent
    )
  ).toBe("Wait for text2...");

  await page.waitForSelector("[data-test-id='text2']");

  // It should be loaded client-side
  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='text2']")?.textContent
    )
  ).toBe("Text 2, client-side, 1 call");

  // Switching to text1
  await page.click("[data-test-id='change-to-text1']");

  // It should not be invalidated yet
  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='text1']")?.textContent
    )
  ).toBe("Text 1, server-side, 1 call");

  // 3 seconds is the time to revalidate the cache
  await promisify(setTimeout)(3000);

  // Switch to text2
  await page.click("[data-test-id='change-to-text2']");

  // The cache should be invalidated already
  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='fallback-text2']")?.textContent
    )
  ).toBe("Wait for text2...");

  await page.waitForSelector("[data-test-id='text2']");

  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='text2']")?.textContent
    )
  ).toBe("Text 2, client-side, 2 call");

  // Switch to text1
  await page.click("[data-test-id='change-to-text1']");

  // The cache should be invalidated here as well
  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='fallback-text1']")?.textContent
    )
  ).toBe("Wait for text1...");

  await page.waitForSelector("[data-test-id='text1']");

  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='text1']")?.textContent
    )
  ).toBe("Text 1, client-side, 1 call");
});
