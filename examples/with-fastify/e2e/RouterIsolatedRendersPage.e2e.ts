import { goToPage } from "../../../test-utils/goToPage";

test("re-renders components only if necessary", async () => {
  await goToPage(
    new URL(
      "/router-isolated-renders/start/start?searchParam1=start&searchParam2=" +
        "start",
      "http://localhost:8080"
    )
  );

  expect(await getParamsValues()).toEqual({
    pathParam1: {
      value: "start",
      renders: 1,
    },
    pathParam2: {
      value: "start",
      renders: 1,
    },
    searchParam1: {
      value: "start",
      renders: 1,
    },
    searchParam2: {
      value: "start",
      renders: 1,
    },
  });

  await page.click("[data-test-id='update-pathParam1']");
  await page.click("[data-test-id='update-pathParam1']");
  await page.click("[data-test-id='update-pathParam1']");

  expect(await getParamsValues()).toEqual({
    pathParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    pathParam2: {
      value: "start",
      renders: 1,
    },
    searchParam1: {
      value: "start",
      renders: 1,
    },
    searchParam2: {
      value: "start",
      renders: 1,
    },
  });

  await page.click("[data-test-id='update-searchParam1']");
  await page.click("[data-test-id='update-searchParam1']");
  await page.click("[data-test-id='update-searchParam1']");

  expect(await getParamsValues()).toEqual({
    pathParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    pathParam2: {
      value: "start",
      renders: 1,
    },
    searchParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    searchParam2: {
      value: "start",
      renders: 1,
    },
  });

  await page.click("[data-test-id='update-pathParam2']");

  expect(await getParamsValues()).toEqual({
    pathParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    pathParam2: {
      value: "start-update",
      renders: 2,
    },
    searchParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    searchParam2: {
      value: "start",
      renders: 1,
    },
  });

  await page.click("[data-test-id='update-searchParam2']");

  expect(await getParamsValues()).toEqual({
    pathParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    pathParam2: {
      value: "start-update",
      renders: 2,
    },
    searchParam1: {
      value: "start-update-update-update",
      renders: 4,
    },
    searchParam2: {
      value: "start-update",
      renders: 2,
    },
  });
});

const getParamsValues = async () => {
  const pathParam1 = await page.evaluate(
    () => document.querySelector("[data-test-id='pathParam1']")?.textContent
  );

  const pathParam2 = await page.evaluate(
    () => document.querySelector("[data-test-id='pathParam2']")?.textContent
  );

  const searchParam1 = await page.evaluate(
    () => document.querySelector("[data-test-id='searchParam1']")?.textContent
  );

  const searchParam2 = await page.evaluate(
    () => document.querySelector("[data-test-id='searchParam2']")?.textContent
  );

  return {
    pathParam1: JSON.parse(pathParam1 ?? "{}"),
    pathParam2: JSON.parse(pathParam2 ?? "{}"),
    searchParam1: JSON.parse(searchParam1 ?? "{}"),
    searchParam2: JSON.parse(searchParam2 ?? "{}"),
  };
};
