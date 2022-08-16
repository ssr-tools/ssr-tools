import Fastify from "fastify";
import { renderToStream } from "@ssr-tools/core/renderToStream";
import fastifyStatic from "@fastify/static";
import { webpackConfig } from "./config/webpackConfig";
import { URL } from "url";
import { Document } from "./components/Document";

import { Providers } from "./components/Providers.server";
import { fetchManifest } from "@ssr-tools/core/fetchManifest";
import { App } from "./components/App";
import { renderToStaticMarkup } from "react-dom/server";
import { ErrorMessage } from "./components/ErrorMessage";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: webpackConfig.clientOutputPath,
  prefix: `/${webpackConfig.assetsPrefix}`,
});

fastify.get("*", async (request, reply) => {
  const appUrl = new URL(
    request.url,
    `${request.protocol}://${request.headers.host}`
  );

  const assetsUrl = new URL(webpackConfig.assetsPrefix, appUrl);

  const manifestUrl = `${assetsUrl}/manifest.json`;

  const manifest = await fetchManifest(manifestUrl);

  if (!manifest) throw new Error(`Cannot load manifest from "${manifestUrl}"`);

  const mainScriptUrl = `${assetsUrl}/${manifest.main}`;

  const { stream, abort } = renderToStream({
    jsx: (
      <Providers url={appUrl}>
        <Document>
          <App />
        </Document>
      </Providers>
    ),
    pipeableStreamOptions: {
      bootstrapScripts: [mainScriptUrl.toString()],
      onShellError: (error) => {
        abort();
        reply
          .type("text/html; charset=UTF-8")
          .status(500)
          .send(
            "<!DOCTYPE html>" +
              renderToStaticMarkup(
                <Document>
                  <ErrorMessage error={error} />
                </Document>
              )
          );
      },
    },
  });

  return reply.type("text/html; charset=UTF-8").send(stream);
});

(async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
