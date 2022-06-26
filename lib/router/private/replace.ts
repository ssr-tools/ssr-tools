/**
 * It replaces the state in the browser's history and triggers the PopStateEvent
 */
export const replace = (href: string) => {
  window.history.replaceState({}, "", href);
  // history.replaceState does not trigger a popstate event
  window.dispatchEvent(new PopStateEvent("popstate", {}));
};
