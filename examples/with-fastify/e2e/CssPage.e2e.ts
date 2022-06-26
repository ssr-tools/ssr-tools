import { goToPage } from "../../../test-utils/goToPage";

test(
  "applies CSS correctly after multiple re-renders and unmounting of an" +
    " element",
  async () => {
    const { consoleLines } = await goToPage(
      new URL("css", "http://localhost:3000")
    );

    await page.waitForNetworkIdle();

    expect(consoleLines).toContainEqual({ type: "log", text: "Css" });

    expect(
      await page.evaluate(
        () => document.querySelector("[data-test-id='counter']")?.textContent
      )
    ).toBe("0");

    const getCounterComputedColor = () =>
      page.evaluate(() => {
        const counter = document.querySelector("[data-test-id='counter']");
        return counter && window.getComputedStyle(counter).color;
      });

    expect(await getCounterComputedColor()).toBe("rgb(0, 0, 255)");

    expect(
      await page.evaluate(
        () => document.querySelector("[data-test-id='disappear']")?.textContent
      )
    ).toBe("I'll disappear if counter is bigger than 3");

    await page.click("[data-test-id='add-1']");
    await page.click("[data-test-id='add-1']");
    await page.click("[data-test-id='add-1']");

    expect(
      await page.evaluate(
        () => document.querySelector("[data-test-id='counter']")?.textContent
      )
    ).toBe("3");

    expect(
      await page.evaluate(() =>
        document.querySelector("[data-test-id='disappear']")
      )
    ).toBe(null);

    expect(await getCounterComputedColor()).toBe("rgb(0, 0, 255)");
  }
);
