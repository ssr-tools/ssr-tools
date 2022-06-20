import { useState, useEffect } from "react";

export const useSearch = (initialSearch: string) => {
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const handlePopstate = () => {
      setSearch(window.location.search);
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  return search;
};
