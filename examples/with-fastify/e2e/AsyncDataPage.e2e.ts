import { goToPage } from "../../../test-utils/goToPage";
import { promisify } from "util";

jest.setTimeout(300000);

test("renders AsyncDataPage correctly", async () => {
  const { consoleLines } = await goToPage(
    new URL("async-data", "http://localhost:8080")
  );

  await promisify(setTimeout)(300);

  const textCount = await page.evaluate(
    () => document.querySelectorAll("[data-test-id='text']").length
  );

  expect(textCount).toBe(2);

  const longWaitTextCount = await page.evaluate(
    () => document.querySelectorAll("[data-test-id='longWaitText']").length
  );

  expect(longWaitTextCount).toBe(2);

  const bothTextsCount = await page.evaluate(
    () => document.querySelectorAll("[data-test-id='both-texts']")?.length
  );

  expect(bothTextsCount).toBe(1);

  expect(consoleLines).toContainEqual({ type: "log", text: "Async data" });
});
