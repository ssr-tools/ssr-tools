import { Suspense } from "react";
import { Print } from "../components/Print";
import { AsyncData } from "../config/asyncDataStore";
import { Span } from "@ssr-tools/css/stylable/Span";

export const AsyncDataPage = () => {
  return (
    <>
      <Print text="AsyncDataPage" />
      <p>
        <Suspense fallback={<>Wait for text...</>}>
          <AsyncData dataKey="text">{(data) => data}</AsyncData>
        </Suspense>
      </p>
      <p>
        <Suspense fallback={<>Wait for text long time...</>}>
          <AsyncData dataKey="longWaitText">{(data) => data}</AsyncData>
        </Suspense>
      </p>
      <Suspense fallback={<>Wait for both....</>}>
        <p>
          <AsyncData dataKey="text">{(data) => data}</AsyncData>
        </p>
        <p>
          <AsyncData dataKey="longWaitText">
            {(data) => (
              <Span
                css={{
                  "&": {
                    display: "flex",
                    flexDirection: "column",
                    color: "red",
                  },
                  "& > span": {
                    color: "blue",
                  },
                }}
              >
                {data}
                <span>ok</span>
              </Span>
            )}
          </AsyncData>
        </p>
      </Suspense>
    </>
  );
};
