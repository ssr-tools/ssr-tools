import { goToPage } from "../../../test-utils/goToPage";

test("renders page for exactly matching url", async () => {
  await goToPage(new URL("/wild-card", "http://localhost:3000"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("WildCard"));
});

test("renders page for url with suffix", async () => {
  await goToPage(new URL("/wild-card/", "http://localhost:3000"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("WildCard"));

  await goToPage(new URL("/wild-card/something", "http://localhost:3000"));

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("WildCard"));

  await goToPage(
    new URL("/wild-card/something/something/something", "http://localhost:3000")
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(expect.stringContaining("WildCard"));
});
