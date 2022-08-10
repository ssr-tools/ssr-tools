import ReactDomServer from "react-dom/server";

import { Transform } from "stream";
import { RenderToStreamConfig } from "./types";

/**
 * Renders a given `jsx` to a stream. Use it on the server.
 */
export const renderToStream = ({
  jsx,
  pipeableStreamOptions: { onShellReady, ...pipeableStreamOptions } = {},
}: RenderToStreamConfig) => {
  const stream = new Transform({
    transform(chunk: Buffer, encoding, callback) {
      this.push(chunk, encoding);
      callback();
    },
  });

  const { pipe, abort } = ReactDomServer.renderToPipeableStream(jsx, {
    onShellReady: () => {
      onShellReady?.();
      pipe(stream);
      return;
    },
    ...pipeableStreamOptions,
  });

  return {
    stream,
    /** abort the stream e.g. when an error occurs */
    abort,
  };
};
