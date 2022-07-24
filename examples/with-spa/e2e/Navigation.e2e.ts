import { goToPage } from "../../../test-utils/goToPage";

test("navigation works correctly", async () => {
  await goToPage(new URL("/second-page", "http://localhost:3001"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Second page");

  await page.click('[href="/"]');
  await page.waitForTimeout(100);

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Index page");

  await page.click('[href="/first-page"]');
  await page.waitForTimeout(100);

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("First page");
});
