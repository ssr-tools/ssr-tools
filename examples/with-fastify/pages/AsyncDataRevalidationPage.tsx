import { Suspense, useState } from "react";
import { Print } from "../components/Print";
import { AsyncData } from "../config/asyncDataRevalidationStore";

export const AsyncDataRevalidationPage = () => {
  const [currentText, setCurrentText] = useState<"text1" | "text2">("text1");

  return (
    <>
      <Print text="Async data revalidation" />
      <p>
        The data on this page is revalidated after 3 seconds (and some
        interaction with the app).
      </p>
      {currentText === "text1" && (
        <>
          <div>
            <Suspense
              fallback={
                <div data-test-id="fallback-text1">Wait for text1...</div>
              }
            >
              <AsyncData dataKey="text1">
                {(text1) => <span data-test-id="text1">{text1}</span>}
              </AsyncData>
            </Suspense>
          </div>
          <div>
            <button
              onClick={() => setCurrentText("text2")}
              data-test-id="change-to-text2"
            >
              Change to text2
            </button>
          </div>
        </>
      )}
      {currentText === "text2" && (
        <>
          <div>
            <Suspense
              fallback={
                <div data-test-id="fallback-text2">Wait for text2...</div>
              }
            >
              <AsyncData dataKey="text2">
                {(text2) => <span data-test-id="text2">{text2}</span>}
              </AsyncData>
            </Suspense>
          </div>
          <div>
            <button
              onClick={() => setCurrentText("text1")}
              data-test-id="change-to-text1"
            >
              Change to text1
            </button>
          </div>
        </>
      )}
    </>
  );
};
