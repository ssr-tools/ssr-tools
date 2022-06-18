import Fastify from "fastify";
import { renderToStream } from "@ssr-tools/core/renderToStream";
import fastifyStatic from "fastify-static";
import { webpackConfig } from "./config/webpackConfig";
import { App } from "./components/App";
import { URL } from "url";
import { Document } from "./components/Document";
import path from "path";

import { readManifests } from "@ssr-tools/core/readManifests";
import { AsyncRevalidationProvider } from "./components/AsyncRevalidationProvider.server";
import { AsyncProvider } from "./components/AsyncProvider.server";
import { StaticProvider } from "./components/StaticProvider.server";

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

  const { manifestClient, manifestServer } = await getManifests();

  const jsx = (
    <StaticProvider url={url}>
      <Document>
        <link
          href={path.join(staticAssetsPrefix, manifestServer["pure-min.css"])}
          rel="stylesheet"
        />
        <div id="root">
          <AsyncRevalidationProvider>
            <AsyncProvider>
              <App />
            </AsyncProvider>
          </AsyncRevalidationProvider>
        </div>
      </Document>
    </StaticProvider>
  );

  const { stream } = renderToStream({
    manifestClient,
    jsx,
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
