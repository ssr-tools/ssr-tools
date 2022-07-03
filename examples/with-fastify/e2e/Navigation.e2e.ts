import { goToPage } from "../../../test-utils/goToPage";

test("activates route when clicking on the navigation links", async () => {
  await goToPage(new URL("/", "http://localhost:3000"));

  await page.click("[data-test-id='css-link']");
  await page.waitForSelector("h1");

  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='css-link']")?.className
    )
  ).toBe("active-navigation-link");

  expect(await page.evaluate(() => window.location.toString())).toBe(
    "http://localhost:3000/css"
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Css");

  await page.click("[data-test-id='static-data-link']");
  await page.waitForSelector("h1");

  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='static-data-link']")?.className
    )
  ).toBe("active-navigation-link");

  expect(await page.evaluate(() => window.location.toString())).toBe(
    "http://localhost:3000/static-data"
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Static data");

  await page.click("[data-test-id='search-params-link']");
  await page.waitForSelector("h1");

  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='search-params-link']")?.className
    )
  ).toBe("active-navigation-link");

  expect(await page.evaluate(() => window.location.toString())).toBe(
    "http://localhost:3000/search-params?category=cars&page=1&perPage=12"
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Search params");

  await page.click("[data-test-id='path-params-link']");
  await page.waitForSelector("h1");

  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='path-params-link']")?.className
    )
  ).toBe("active-navigation-link");

  expect(await page.evaluate(() => window.location.toString())).toBe(
    "http://localhost:3000/path-params/cars/ferrari"
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Path params");

  await page.click("[data-test-id='404-link']");
  await page.waitForSelector("h1");

  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='404-link']")?.className
    )
  ).toBe("active-navigation-link");

  expect(await page.evaluate(() => window.location.toString())).toBe(
    "http://localhost:3000/404"
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Page not found");

  await page.click("[data-test-id='index-link']");
  await page.waitForSelector("h1");

  expect(
    await page.evaluate(
      () => document.querySelector("[data-test-id='index-link']")?.className
    )
  ).toBe("active-navigation-link");

  expect(await page.evaluate(() => window.location.toString())).toBe(
    "http://localhost:3000/"
  );

  expect(
    await page.evaluate(() => document.querySelector("h1")?.textContent)
  ).toBe("Index");
});
