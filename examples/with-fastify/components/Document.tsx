import { App } from "./App";

export const Document = () => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Example with Fastify</title>
    </head>
    <body>
      <div id="root">
        <App />
      </div>
    </body>
  </html>
);
