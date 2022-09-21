import { goToPage } from "../../../test-utils/goToPage";

test("retrieves correct params on load", async () => {
  await goToPage(
    new URL(
      "/search-params?category=cars&page=100&perPage=10",
      "http://localhost:8080"
    )
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        page: "100",
        perPage: "10",
      },
      null,
      2
    )
  );
});

test("retrieves correct params on clicking links", async () => {
  await goToPage(new URL("/search-params", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: null,
        page: null,
        perPage: null,
      },
      null,
      2
    )
  );

  await page.click("[data-test-id='link-cars-1-20'");

  expect(await page.evaluate(() => window.location.search)).toBe(
    "?category=cars&page=1&perPage=20"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        page: "1",
        perPage: "20",
      },
      null,
      2
    )
  );

  await page.click("[data-test-id='link-undefined-100-undefined'");

  expect(await page.evaluate(() => window.location.search)).toBe("?page=100");

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: null,
        page: "100",
        perPage: null,
      },
      null,
      2
    )
  );
});

test("retrieves correct params on push", async () => {
  await goToPage(new URL("/search-params", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: null,
        page: null,
        perPage: null,
      },
      null,
      2
    )
  );

  const initialHistoryLength = await page.evaluate(() => window.history.length);

  await page.focus("[data-test-id='push-category']");
  await page.keyboard.type("cars");

  await page.focus("[data-test-id='push-page']");
  await page.keyboard.type("99");

  await page.focus("[data-test-id='push-perPage']");
  await page.keyboard.type("9");

  await page.click("[data-test-id='push-submit']");

  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength + 1
  );

  expect(await page.evaluate(() => window.location.search)).toBe(
    "?category=cars&page=99&perPage=9"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        page: "99",
        perPage: "9",
      },
      null,
      2
    )
  );
});

test("retrieves correct params on replace", async () => {
  await goToPage(new URL("/search-params", "http://localhost:8080"));

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: null,
        page: null,
        perPage: null,
      },
      null,
      2
    )
  );

  const initialHistoryLength = await page.evaluate(() => window.history.length);

  await page.focus("[data-test-id='replace-category']");
  await page.keyboard.type("cars");

  await page.focus("[data-test-id='replace-page']");
  await page.keyboard.type("99");

  await page.focus("[data-test-id='replace-perPage']");
  await page.keyboard.type("9");

  await page.click("[data-test-id='replace-submit']");

  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength
  );

  expect(await page.evaluate(() => window.location.search)).toBe(
    "?category=cars&page=99&perPage=9"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        page: "99",
        perPage: "9",
      },
      null,
      2
    )
  );
});
