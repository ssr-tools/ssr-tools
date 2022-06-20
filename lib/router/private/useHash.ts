import { useState, useEffect } from "react";
import { Hash } from "../types";

export const useHash = (initialHash: string) => {
  const [hash, setHash] = useState<Hash>({
    value: initialHash,
    updatesCount: 0,
  });

  useEffect(() => {
    const handlePopstate = () =>
      setHash((prev) => ({
        value: window.location.hash.replace("#", ""),
        updatesCount: prev.updatesCount + 1,
      }));

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  return hash;
};
