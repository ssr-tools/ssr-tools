import { useEffect, useState } from "react";

export const usePathname = (initialPathname: string) => {
  const [pathname, setPathname] = useState(initialPathname);

  useEffect(() => {
    const handlePopstate = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  return pathname;
};
