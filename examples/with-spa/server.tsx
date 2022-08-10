import { renderToFile } from "@ssr-tools/core/renderToFile";
import fs from "fs";
import http from "http";
import path from "path";
import { Document } from "./components/Document";
import { lookup } from "mrmime";
import { promisify } from "util";
import { fetchManifest } from "@ssr-tools/core/fetchManifest";
import { webpackConfig } from "./config/webpackConfig";

const appServerPort = 3001;

const run = async () => {
  const staticAssetsUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:${webpackConfig.devServerPort}`
      : `http://localhost:${appServerPort}`;

  await createIndexHtmlWithRetry(staticAssetsUrl);

  if (process.env.NODE_ENV !== "development") return process.exit(0);

  http.createServer(devServer).listen(appServerPort);
};

let retriesLeft = 5;

const createIndexHtmlWithRetry = async (staticAssetsUrl: string) => {
  try {
    await createIndexHtml(staticAssetsUrl);
  } catch (err) {
    if (retriesLeft === 0) throw err;
    retriesLeft -= 1;

    await promisify(setTimeout)(1000);
    await createIndexHtmlWithRetry(staticAssetsUrl);
  }
};

const createIndexHtml = async (staticAssetsUrl: string) => {
  const manifest = await fetchManifest(`${staticAssetsUrl}/manifest.json`);
  const indexHtmlPath = path.join(process.cwd(), "dist", "index.html");

  if (!manifest) throw new Error("Cannot load the manifest");

  const bootstrapScript = new URL(manifest.main, staticAssetsUrl).toString();

  return renderToFile(
    indexHtmlPath,
    <Document bootstrapScript={bootstrapScript} />
  );
};

const devServer: http.RequestListener = (req, res) => {
  const url = req.url?.startsWith("/client") ? req.url : "index.html";

  fs.readFile(path.join(process.cwd(), "dist", url), (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end(JSON.stringify(err));
    }

    res.writeHead(200, {
      "Content-Type": lookup(url) ?? "text/html; charset=utf-8",
    });

    return res.end(data);
  });
};

void run();
