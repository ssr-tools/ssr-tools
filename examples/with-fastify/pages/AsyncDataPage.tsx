import { Suspense } from "react";
import { Print } from "../components/Print";
import { AsyncData } from "../config/asyncDataStore";
import { StyledSpan } from "../components/StyleSpan";

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
              <StyledSpan>
                {data}
                <span>ok</span>
              </StyledSpan>
            )}
          </AsyncData>
        </p>
      </Suspense>
    </>
  );
};
