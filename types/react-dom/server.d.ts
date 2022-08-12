import { ReactNode } from "react";
import type { Writable } from "stream";

// I was about to remove this declaration, but the original ones from React
// are undocumented, so I decide to keep it. Although, I may get into trouble
// when I wouldn't realize something has changed in the React typedefs.
declare module "react-dom/server" {
  export function renderToPipeableStream(
    children: ReactNode,
    options?: {
      identifierPrefix?: string;
      /**
       * `namespaceURI` is needed if you'd like to use non-HTML root element
       * for the app, such as `<svg />`. In such case you'd provide here what's
       * inside the `xmlns` attribute of the `<svg />`.
       * More here: https://github.com/facebook/react/pull/21113
       */
      namespaceURI?: string;
      /**
       * `nonce` is an attribute that ReactDomServer adds to the `<script />`
       * tag that encloses the (inline) `bootstrapScriptContent`.
       * More here: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce
       */
      nonce?: string;
      /**
       * `bootstrapScriptContent` injects
       * `<script>{bootstrapScriptContent}</script>` to the document,
       * before the stream starts to drain.
       * It's especially useful when you need a script that starts the React.
       */
      bootstrapScriptContent?: string;
      /**
       * `bootstrapScripts` is similar to `bootstrapScriptContent`, but injects:
       *
       * ```
       * <script src="{bootstrapScript}" async=""></script>
       * ```
       */
      bootstrapScripts?: string[];
      /**
       * `bootstrapModules` is similar to `bootstrapScriptContent`, but injects:
       *
       * ```
       * <script type="module" src="{bootstrapModule}" async=""></script>
       * ```
       */
      bootstrapModules?: string[];
      /**
       * `progressiveChunkSize` allows to change the default size of the chunks
       * included in the rendering stream. The default value is determined by
       * the React authors through some reasonable heuristics and should be
       * good in most cases.
       */
      progressiveChunkSize?: number;
      /**
       * `onShellReady` is called when there is at least a root fallback ready
       * to show.
       */
      onShellReady?: () => void;
      /**
       * `onShellError` is called when the shell didn't complete. That means
       * you probably want to emit a different response to the stream instead.
       */
      onShellError?: (error: unknown) => void;
      /**
       * `onAllReady` is called when all pending tasks are done but it may not
       * have flushed yet.
       */
      onAllReady?: () => void;
      /**
       * `onError` is called when an error happens anywhere in the tree. It
       * might recover.
       */
      onError?: (error: unknown) => void;
    }
  ): {
    /**
     * Cancel any pending I/O and put anything remaining into
     * client rendered mode.
     */
    abort(): void;
    /**
     * It pipes the generated rendering stream into another stream.
     */
    pipe<T extends Writable>(destination: T): T;
  };
}
