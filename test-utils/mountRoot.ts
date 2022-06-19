import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

export const mountRoot = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  return {
    container,
    root,
    cleanUp: () =>
      act(() => {
        root.unmount();
        container.remove();
      }),
  };
};
