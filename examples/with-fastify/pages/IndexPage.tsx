import { lazy, Suspense } from "react";
import { Print } from "../components/Print";

export const IndexPage = () => {
  return (
    <>
      <Print text="Index" />
      <Suspense fallback={<>Lazy loading... 🦥</>}>
        <LazyLoaded />
      </Suspense>
    </>
  );
};

const LazyLoaded = lazy(async () => {
  const { ToLazyLoad } = await import("../components/ToLazyLoad");

  return {
    default: ToLazyLoad,
  };
});
