/**
 * It pushes the state to the browser's history and triggers the PopStateEvent
 */
export const push = (href: string) => {
  window.history.pushState({}, "", href);
  // history.pushState does not trigger a popstate event
  window.dispatchEvent(new PopStateEvent("popstate", {}));
};
