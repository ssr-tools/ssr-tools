import { Span } from "@ssr-tools/css/stylable/Span";
import { FC, ReactNode, Suspense } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Print } from "../components/Print";
import { AsyncData } from "../config/asyncDataStore";

export const AsyncDataPage = () => {
  return (
    <>
      <Print text="Async data" />
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
                    {longWaitText} <BoldUnderline>{text}</BoldUnderline>
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

const BoldUnderline: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <Span
    css={{
      "&": {
        fontWeight: "bold",
        textDecoration: "underline",
      },
    }}
  >
    {children}
  </Span>
);
