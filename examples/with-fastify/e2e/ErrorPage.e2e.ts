import { goToPage } from "../../../test-utils/goToPage";

test("renders a page with error message", async () => {
  await goToPage(new URL("/error-page", "http://localhost:3000"), {
    shouldCloseOnError: false,
  });

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(
    expect.stringContaining('Error 500: "Navigated to the error page"')
  );
});

test("navigates a page with error message", async () => {
  await goToPage(new URL("/", "http://localhost:3000"), {
    shouldCloseOnError: false,
  });

  await page.click("[data-test-id='error-link']");

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toEqual(
    expect.stringContaining('Error 500: "Navigated to the error page"')
  );
});
