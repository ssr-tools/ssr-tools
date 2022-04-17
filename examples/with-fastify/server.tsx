import Fastify from "fastify";
import { renderToStream } from "@ssr-tools/core/renderToStream";
import fastifyStatic from "fastify-static";
import { webpackConfig } from "./config/webpackConfig";
import { App } from "./components/App";
import { URL } from "url";
import { Document } from "./components/Document";
import path from "path";

import {
  StaticDataStoreProvider,
  StaticDataStoreScriptTag,
} from "./config/staticDataStore";
import { AsyncDataStoreProvider } from "./config/asyncDataStore";
import { readManifests } from "@ssr-tools/core/readManifests";

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
    <AsyncDataStoreProvider
      type="server"
      dataFetching={{
        text: () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  "You had been waiting for this text 3 seconds. It was resolved on the server-side."
                ),
              3000
            )
          ),
        longWaitText: () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  "You had been waiting for this text 10 seconds. It was resolved on the server-side."
                ),
              10000
            )
          ),
      }}
    >
      <StaticDataStoreProvider
        staticData={{
          initialPathname: url.pathname,
          initialHash: url.hash,
          texts: [
            "This text comes from the server-side.",
            "It's rendered on the server and also injected to the <script /> tag.",
            "That's how the client can use the same text after hydration.",
          ],
        }}
      >
        <Document>
          <link
            href={path.join(staticAssetsPrefix, manifestServer["pure-min.css"])}
            rel="stylesheet"
          />
          <div id="root">
            <App />
          </div>
          <StaticDataStoreScriptTag />
        </Document>
      </StaticDataStoreProvider>
    </AsyncDataStoreProvider>
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
