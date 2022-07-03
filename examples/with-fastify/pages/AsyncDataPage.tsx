import { Suspense } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Print } from "../components/Print";
import { StyledSpan } from "../components/StyleSpan";
import { AsyncData } from "../config/asyncDataStore";

export const AsyncDataPage = () => {
  return (
    <>
      <Print text="AsyncData" />
      <Suspense fallback={<LoadingSpinner>Wait for text...</LoadingSpinner>}>
        <AsyncData dataKey="text">
          {(text) => (
            <Suspense
              fallback={
                <LoadingSpinner>Wait for text long time...</LoadingSpinner>
              }
            >
              <AsyncData dataKey="longWaitText">
                {(longWaitText) => (
                  <div data-test-id="both-texts">
                    {longWaitText} <StyledSpan>{text}</StyledSpan>
                  </div>
                )}
              </AsyncData>
            </Suspense>
          )}
        </AsyncData>
      </Suspense>
      <p data-test-id="text">
        <Suspense fallback={<LoadingSpinner>Wait for text...</LoadingSpinner>}>
          <AsyncData dataKey="text">{(text) => text}</AsyncData>
        </Suspense>
      </p>
      <p data-test-id="longWaitText">
        <Suspense
          fallback={<LoadingSpinner>Wait for text long time...</LoadingSpinner>}
        >
          <AsyncData dataKey="longWaitText">
            {(longWaitText) => longWaitText}
          </AsyncData>
        </Suspense>
      </p>
      <p data-test-id="text">
        <Suspense fallback={<LoadingSpinner>Wait for text...</LoadingSpinner>}>
          <AsyncData dataKey="text">{(text) => text}</AsyncData>
        </Suspense>
      </p>
      <p data-test-id="longWaitText">
        <Suspense
          fallback={<LoadingSpinner>Wait for text long time...</LoadingSpinner>}
        >
          <AsyncData dataKey="longWaitText">
            {(longWaitText) => longWaitText}
          </AsyncData>
        </Suspense>
      </p>
    </>
  );
};
