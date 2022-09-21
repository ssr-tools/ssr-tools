import { goToPage } from "../../../test-utils/goToPage";

test("renders page for exactly matching url", async () => {
  await goToPage(new URL("/wild-card", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("Wild card"));
});

test("renders page for url with suffix", async () => {
  await goToPage(new URL("/wild-card/", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("Wild card"));

  await goToPage(new URL("/wild-card/something", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("Wild card"));

  await goToPage(
    new URL("/wild-card/something/something/something", "http://localhost:8080")
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("Wild card"));
});
