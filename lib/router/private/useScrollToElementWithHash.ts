import { useEffect } from "react";
import { Hash } from "../types";

export const useScrollToElementWithHash = (hash: Hash) => {
  useEffect(() => {
    return hash.value ? scrollToElementWithId(hash.value) : undefined;
  }, [
    // We keep the whole `hash` object in deps so that we can scroll again
    // to the same hash when needed
    hash,
  ]);
};

const scrollToElementWithId = (id: string) => {
  const elementWithId = document.getElementById(id);

  // By default browser also focus the anchored element for better a11y.
  // It's important that .focus() goes before .scrollIntoView(), otherwise
  // the element may not be scrolled into view if it's totally outside the
  // viewport.
  elementWithId?.focus();

  elementWithId?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start",
  });
};
