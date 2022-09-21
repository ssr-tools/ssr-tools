import { goToPage } from "../../../test-utils/goToPage";

test("renders page for exactly matching url", async () => {
  await goToPage(new URL("/images", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("Images Page"));

  expect(
    await page.evaluate(() => document.querySelector("img")?.naturalHeight)
  ).toBeGreaterThan(0);

  expect(
    await page.evaluate(() => document.querySelector("svg")?.childNodes.length)
  ).toBeGreaterThan(0);
});
