import { FC } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { StyleCacheProvider } from "@ssr-tools/css/components/StyleCacheProvider";
import { StyleBuilder } from "@ssr-tools/css/components/StyleBuilder";

export const Document: FC<{
  bootstrapScript: string;
}> = ({ bootstrapScript }) => (
  <StyleCacheProvider>
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Example with SPA</title>
        {globalStyles}
      </head>
      <body>
        <div id="root">
          <LoadingSpinner size={80} />
        </div>
        <script type="application/javascript" src={bootstrapScript} />
      </body>
    </html>
  </StyleCacheProvider>
);

const globalStyles = (
  <StyleBuilder
    css={{
      "*": {
        margin: 0,
        padding: 0,
      },
      html: {
        height: "100%",
        fontFamily: "monospace",
        display: "flex",
      },
      body: {
        margin: "0 auto",
        width: "80ch",
        paddingTop: 10,
      },
      "#root": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      },
    }}
  />
);
