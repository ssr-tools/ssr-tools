import Fastify from "fastify";
import { renderToStream } from "@ssr-tools/core/renderToStream";
import fastifyStatic from "@fastify/static";
import { webpackConfig } from "./config/webpackConfig";
import { URL } from "url";
import { Document } from "./components/Document";

import { Providers } from "./components/Providers.server";
import { fetchManifest } from "@ssr-tools/core/fetchManifest";

const fastify = Fastify({
  logger: true,
});

const staticAssetsPrefix = "/public";

fastify.register(fastifyStatic, {
  root: webpackConfig.clientOutputPath,
  prefix: staticAssetsPrefix,
});

fastify.get("*", async (request, reply) => {
  const appUrl = new URL(request.url, `http://${request.headers.host}`);

  const assetsUrl =
    process.env.NODE_ENV === "production"
      ? new URL(staticAssetsPrefix, appUrl)
      : `http://localhost:${webpackConfig.devServerPort}`;

  const manifestUrl = `${assetsUrl}/manifest.json`;

  const manifest = await fetchManifest(manifestUrl);

  if (!manifest) throw new Error(`Cannot load manifest from "${manifestUrl}"`);

  const mainScriptUrl = `${assetsUrl}/${manifest.main}`;

  const { stream } = renderToStream({
    jsx: (
      <Providers url={appUrl}>
        <Document />
      </Providers>
    ),
    pipeableStreamOptions: {
      bootstrapScripts: [mainScriptUrl.toString()],
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
