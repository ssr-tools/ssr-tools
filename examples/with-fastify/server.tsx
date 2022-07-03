import Fastify from "fastify";
import { renderToStream } from "@ssr-tools/core/renderToStream";
import fastifyStatic from "fastify-static";
import { webpackConfig } from "./config/webpackConfig";
import { URL } from "url";
import { Document } from "./components/Document";

import { readManifests } from "@ssr-tools/core/readManifests";
import { Providers } from "./components/Providers.server";

const fastify = Fastify({
  logger: true,
});

const staticAssetsPrefix = "/public";

fastify.register(fastifyStatic, {
  root: webpackConfig.clientOutputPath,
  prefix: staticAssetsPrefix,
});

fastify.get("*", async (request, reply) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  const { manifestClient } = await getManifests();

  const { stream } = renderToStream({
    manifestClient,
    jsx: (
      <Providers url={url}>
        <Document />
      </Providers>
    ),
    staticAssetsPrefix,
  });

  return reply.type("text/html; charset=UTF-8").send(stream);
});

(async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

const getManifests = (() => {
  let prevManifestsPromise: PromiseResult<ReturnType<typeof readManifests>>;

  return async () => {
    prevManifestsPromise = prevManifestsPromise
      ? prevManifestsPromise
      : await readManifests(webpackConfig);
    return prevManifestsPromise;
  };
})();

type PromiseResult<T> = T extends Promise<infer Result> ? Result : never;
