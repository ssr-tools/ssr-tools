import { readManifests } from "@ssr-tools/core/readManifests";
import { renderToFile } from "@ssr-tools/core/renderToFile";
import fs from "fs";
import http from "http";
import path from "path";
import { Document } from "./components/Document";
import { webpackConfig } from "./config/webpackConfig";
import { lookup } from "mrmime";

const run = async () => {
  await createIndexHtml();

  if (process.env.NODE_ENV !== "development") return process.exit(0);

  // run dev server on http://localhost:3001
  http.createServer(devServer).listen(3001);
};

const createIndexHtml = async () => {
  const manifests = await readManifests(webpackConfig);
  const indexHtmlPath = path.join(process.cwd(), "dist", "index.html");

  const bootstrapScriptPath = path.join(
    "client",
    manifests.manifestClient["main"]
  );

  return renderToFile(
    indexHtmlPath,
    <Document bootstrapScript={bootstrapScriptPath} />
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
