import path from "path";
import ReactDomServer from "react-dom/server";

import { Transform } from "stream";
import { RenderToStreamConfig } from "./types";

/**
 * Renders a given `jsx` to a stream. Use it on the server.
 */
export const renderToStream = ({
  jsx,
  staticAssetsPrefix,
  manifestClient,
  pipeableStreamOptions: {
    bootstrapScripts,
    onShellReady,
    ...pipeableStreamOptions
  } = {},
}: RenderToStreamConfig) => {
  const stream = new Transform({
    transform(chunk: Buffer, encoding, callback) {
      this.push(chunk, encoding);
      callback();
    },
  });

  const { pipe, abort } = ReactDomServer.renderToPipeableStream(jsx, {
    // Here we need only `main` file. Then the `main` file loads other files
    // depending on route we have currently.
    bootstrapScripts: [path.join(staticAssetsPrefix, manifestClient["main"])],
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
