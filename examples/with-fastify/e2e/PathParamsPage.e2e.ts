import { goToPage } from "../../../test-utils/goToPage";

test("retrieves correct params on load", async () => {
  await goToPage(
    new URL("/path-params/furniture/wardrobe", "http://localhost:3000")
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "furniture",
        product: "wardrobe",
      },
      null,
      2
    )
  );
});

test("retrieves correct params on clicking links", async () => {
  await goToPage(new URL("/path-params/foo/bar", "http://localhost:3000"));

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "foo",
        product: "bar",
      },
      null,
      2
    )
  );

  await page.click("[data-test-id='link-cars-ferrari'");

  expect(await page.evaluate(() => window.location.pathname)).toBe(
    "/path-params/cars/ferrari"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        product: "ferrari",
      },
      null,
      2
    )
  );

  await page.click("[data-test-id='link-house-mug'");

  expect(await page.evaluate(() => window.location.pathname)).toBe(
    "/path-params/house/mug"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "house",
        product: "mug",
      },
      null,
      2
    )
  );
});

test("does not match incomplete params", async () => {
  await goToPage(new URL("/path-params", "http://localhost:3000"));

  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='page-not-found']")?.textContent
    )
  ).toBe("Page not found");

  await goToPage(new URL("/path-params/foo", "http://localhost:3000"));

  expect(
    await page.evaluate(
      () =>
        document.querySelector("[data-test-id='page-not-found']")?.textContent
    )
  ).toBe("Page not found");
});

test("retrieves correct params on push", async () => {
  await goToPage(new URL("/path-params/foo/bar", "http://localhost:3000"));

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "foo",
        product: "bar",
      },
      null,
      2
    )
  );

  const initialHistoryLength = await page.evaluate(() => window.history.length);

  await page.focus("[data-test-id='push-category']");
  await page.keyboard.type("cars");

  await page.focus("[data-test-id='push-product']");
  await page.keyboard.type("mercedes");

  await page.click("[data-test-id='push-submit']");

  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength + 1
  );

  expect(await page.evaluate(() => window.location.pathname)).toBe(
    "/path-params/cars/mercedes"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        product: "mercedes",
      },
      null,
      2
    )
  );
});

test("retrieves correct params on replace", async () => {
  await goToPage(new URL("/path-params/foo/bar", "http://localhost:3000"));

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "foo",
        product: "bar",
      },
      null,
      2
    )
  );

  const initialHistoryLength = await page.evaluate(() => window.history.length);

  await page.focus("[data-test-id='replace-category']");
  await page.keyboard.type("cars");

  await page.focus("[data-test-id='replace-product']");
  await page.keyboard.type("mercedes");

  await page.click("[data-test-id='replace-submit']");

  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength
  );

  expect(await page.evaluate(() => window.location.pathname)).toBe(
    "/path-params/cars/mercedes"
  );

  expect(
    await page.evaluate(() => document.querySelector("textarea")?.textContent)
  ).toBe(
    JSON.stringify(
      {
        category: "cars",
        product: "mercedes",
      },
      null,
      2
    )
  );
});
