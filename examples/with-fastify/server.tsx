import Fastify from "fastify";
import { renderToStream } from "@ssr-tools/core/renderToStream";
import fastifyStatic from "@fastify/static";
import { webpackConfig } from "./config/webpackConfig";
import { URL } from "url";
import { Document } from "./components/Document";
import path from "path";

import { Providers } from "./components/Providers.server";
import { loadManifest } from "@ssr-tools/core/loadManifest";
import { App } from "./components/App";
import { renderToStaticMarkup } from "react-dom/server";
import { ErrorMessage } from "./components/ErrorMessage";

const assetsPrefix =
  webpackConfig.assetsPrefix instanceof URL
    ? webpackConfig.assetsPrefix.pathname
    : webpackConfig.assetsPrefix;

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: webpackConfig.clientOutputPath,
  prefix: assetsPrefix,
});

fastify.get("*", async (request, reply) => {
  const appUrl = new URL(
    request.url,
    `${request.protocol}://${request.headers.host}`
  );

  const assetsUrl = new URL(assetsPrefix, appUrl);

  const manifestPath = path.join(
    webpackConfig.clientOutputPath,
    "manifest.json"
  );

  const manifest = await loadManifest(manifestPath);

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
    await fastify.listen({
      port: webpackConfig.appPort,
      host: webpackConfig.appHost,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
