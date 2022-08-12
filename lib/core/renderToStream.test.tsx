import { renderToStream } from "./renderToStream";
import { renderToPipeableStream } from "react-dom/server";
import assert from "assert";
import React from "react";

jest.mock("react-dom/server", () => ({
  renderToPipeableStream: jest.fn<
    ReturnType<typeof renderToPipeableStream>,
    Parameters<typeof renderToPipeableStream>
  >(),
}));

test("shows additional info when onShellError is NOT provided", () => {
  assert(jest.isMockFunction(renderToPipeableStream));

  const consoleErrorSpy = jest.spyOn(console, "error");

  consoleErrorSpy.mockImplementationOnce(() => null);

  const testError = new Error("Test error");

  renderToPipeableStream.mockImplementationOnce((...[, options]) => {
    options?.onShellError(testError);
  });

  renderToStream({
    jsx: <h1>Hello world!</h1>,
  });

  expect(renderToPipeableStream).toBeCalledWith(<h1>Hello world!</h1>, {
    onShellError: expect.any(Function),
    onShellReady: expect.any(Function),
  });

  expect(consoleErrorSpy).toBeCalledTimes(1);

  expect(consoleErrorSpy).toBeCalledWith(
    "An error occured and you did not provide `onShellError` to" +
      " `pipeableStreamOptions` in `renderToStream` function." +
      " That means your stream got stuck and won't recover since shell" +
      " is not complete. To avoid that, you should abort the stream and" +
      " provide a fallback response with the relevant status code to the" +
      " `onShellError`.",
    "Original error:",
    JSON.stringify(testError, null, 2)
  );
});

test("DOES NOT show additional info when onShellError is provided", () => {
  assert(jest.isMockFunction(renderToPipeableStream));

  const consoleErrorSpy = jest.spyOn(console, "error");

  consoleErrorSpy.mockImplementationOnce(() => null);

  const testError = new Error("Test error");

  renderToPipeableStream.mockImplementationOnce((...[, options]) => {
    options?.onShellError(testError);
  });

  renderToStream({
    jsx: <h1>Hello world!</h1>,
    pipeableStreamOptions: {
      onShellError() {
        // custom handler
      },
    },
  });

  expect(renderToPipeableStream).toBeCalledWith(<h1>Hello world!</h1>, {
    onShellError: expect.any(Function),
    onShellReady: expect.any(Function),
  });

  expect(consoleErrorSpy).toBeCalledTimes(0);
});

test("sets up auto-abort for stream when timeoutMs is NOT provided", () => {
  const setTimeoutSpy = jest.spyOn(globalThis, "setTimeout");

  assert(jest.isMockFunction(renderToPipeableStream));

  renderToStream({
    jsx: <h1>Hello world!</h1>,
  });

  expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 10000);
});

test("sets up auto-abort for stream when timeoutMs is a number", () => {
  const setTimeoutSpy = jest.spyOn(globalThis, "setTimeout");

  assert(jest.isMockFunction(renderToPipeableStream));

  const timeoutMs = 30000;

  renderToStream({
    jsx: <h1>Hello world!</h1>,
    timeoutMs,
  });

  expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), timeoutMs);
});

test('DOES NOT set up auto-abort for stream when timeoutMs is "never"', () => {
  const setTimeoutSpy = jest.spyOn(globalThis, "setTimeout");

  assert(jest.isMockFunction(renderToPipeableStream));

  renderToStream({
    jsx: <h1>Hello world!</h1>,
    timeoutMs: "never",
  });

  expect(setTimeoutSpy).toBeCalledTimes(0);
});
