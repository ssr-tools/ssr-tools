export const scrollToElementWithId = (id: string) => {
  const elementWithId = document.getElementById(id);

  // By default browser also focus the anchored element for better a11y.
  // It's important that .focus() goes before .scrollIntoView(), otherwise
  // the element may not be scrolled into view if it's totally outside the
  // viewport.
  elementWithId?.focus();

  elementWithId?.scrollIntoView({
    behavior: "auto",
    block: "start",
    inline: "start",
  });
};
