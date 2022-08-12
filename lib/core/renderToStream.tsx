import ReactDomServer from "react-dom/server";

import { Transform } from "stream";
import { RenderToStreamConfig } from "./types";

/**
 * Renders a given `jsx` to a stream. Use it on the server.
 */
export const renderToStream = ({
  jsx,
  timeoutMs = 10000,
  pipeableStreamOptions: {
    onShellReady,
    onShellError,
    ...pipeableStreamOptions
  } = {},
}: RenderToStreamConfig) => {
  const stream = new Transform({
    transform(chunk: Buffer, encoding, callback) {
      this.push(chunk, encoding);
      callback();
    },
  });

  const pipeableStream = ReactDomServer.renderToPipeableStream(jsx, {
    onShellReady: () => {
      onShellReady?.();
      pipeableStream.pipe(stream);
      return;
    },
    onShellError(error) {
      if (typeof onShellError === "function") return onShellError(error);

      // eslint-disable-next-line no-console
      console.error(
        "An error occured and you did not provide `onShellError` to" +
          " `pipeableStreamOptions` in `renderToStream` function." +
          " That means your stream got stuck and won't recover since shell" +
          " is not complete. To avoid that, you should abort the stream and" +
          " provide a fallback response with the relevant status code to the" +
          " `onShellError`.",
        "Original error:",
        JSON.stringify(error, null, 2)
      );
    },
    ...pipeableStreamOptions,
  });

  const abort = () => {
    pipeableStream.abort();
    stream.end();
  };

  if (timeoutMs !== "never") {
    setTimeout(abort, timeoutMs);
  }

  return {
    stream,
    /** abort the stream e.g. when an error occurs */
    abort,
  };
};
