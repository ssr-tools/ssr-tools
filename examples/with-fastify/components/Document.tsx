import { FC, ReactNode } from "react";

export const Document: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Example with Fastify</title>
    </head>
    <body>{children}</body>
  </html>
);
