import { ReactElement } from "react";

import ReactDom from "react-dom/client";

/**
 * Use it with combination with `renderToStream` on the server
 */
export const hydrateStream = (root: HTMLElement, element: ReactElement) =>
  ReactDom.hydrateRoot(root, element);
