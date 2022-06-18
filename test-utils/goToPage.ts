import { ConsoleMessageType } from "puppeteer";

/**
 * Use it only for `e2e` tests.
 *
 * It opens up the page in the puppeteer browser. It collects the console output
 * and returns it in the `consoleLines` property.
 *
 * When there is an uncaught JS error on the page, it logs the error and closes
 * the page and browser. That's necessary to avoid silent errors raised by
 * puppeteer.
 */
export const goToPage = async (url: URL) => {
  try {
    const consoleLines: Array<{
      text: string;
      type: ConsoleMessageType;
    }> = [];

    page.on("pageerror", (e) => {
      // eslint-disable-next-line no-console
      console.error("Page error", e);
      // eslint-disable-next-line no-console
      console.error("Browser is going to be closed...");
      page.close();
      browser.close();
    });

    page.on("console", (e) => {
      consoleLines.push({
        text: e.text(),
        type: e.type(),
      });
    });

    await page.goto(url.toString());

    return {
      consoleLines,
    };
  } catch (err) {
    const stringifiedErr = String(err);

    if (stringifiedErr.startsWith("Error: net::ERR_CONNECTION_REFUSED")) {
      // eslint-disable-next-line no-console
      console.error("It seems that the server is not running.");
      throw err;
    }

    // eslint-disable-next-line no-console
    console.error(
      "Something went wrong when trying to open http://localhost:3000",
      err
    );

    throw err;
  }
};
