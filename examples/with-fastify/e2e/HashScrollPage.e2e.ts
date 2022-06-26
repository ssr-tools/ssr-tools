import { goToPage } from "../../../test-utils/goToPage";

test("scrolls to sections on load", async () => {
  const { sectionOneTop, sectionTwoTop, sectionThreeTop } =
    await getSectionsTopPositions();

  await goToPage(new URL("hash-scroll#section-one", "http://localhost:3000"));

  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    sectionOneTop,
    -2
  );

  await goToPage(new URL("hash-scroll#section-two", "http://localhost:3000"));

  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    sectionTwoTop,
    -2
  );

  await goToPage(new URL("hash-scroll#section-three", "http://localhost:3000"));

  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    sectionThreeTop,
    -2
  );
});

test("scrolls to sections when clicking on links", async () => {
  const { sectionOneTop, sectionTwoTop, sectionThreeTop } =
    await getSectionsTopPositions();

  await goToPage(new URL("hash-scroll", "http://localhost:3000"));

  await page.click("[data-test-id='section-one-link']");

  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    sectionOneTop,
    -2
  );

  await goToPage(new URL("hash-scroll", "http://localhost:3000"));

  await page.click("[data-test-id='section-two-link']");

  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    sectionTwoTop,
    -2
  );

  await goToPage(new URL("hash-scroll", "http://localhost:3000"));

  await page.click("[data-test-id='section-three-link']");

  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    sectionThreeTop,
    -2
  );
});

const getSectionsTopPositions = async () => {
  await goToPage(new URL("hash-scroll", "http://localhost:3000"));

  await page.waitForNetworkIdle();

  const sectionOneTop = await page.evaluate(
    () =>
      document.getElementById("section-one")?.getBoundingClientRect().top ?? 0
  );

  const sectionTwoTop = await page.evaluate(
    () =>
      document.getElementById("section-two")?.getBoundingClientRect().top ?? 0
  );

  const sectionThreeTop = await page.evaluate(
    () =>
      document.getElementById("section-three")?.getBoundingClientRect().top ?? 0
  );

  return {
    sectionOneTop,
    sectionTwoTop,
    sectionThreeTop,
  };
};
