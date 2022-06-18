import { FC, ReactNode } from "react";
import { AsyncDataStoreProvider } from "../config/asyncDataRevalidationStore";

export const AsyncRevalidationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <AsyncDataStoreProvider
    readers={{
      text1: ((): (() => Promise<string>) => {
        let counter = 0;
        return () => {
          counter += 1;
          return new Promise<string>((resolve) =>
            setTimeout(
              () => resolve(`Text 1, client-side, ${counter} call`),
              1000
            )
          );
        };
      })(),
      text2: ((): (() => Promise<string>) => {
        let counter = 0;
        return () => {
          counter += 1;
          return new Promise<string>((resolve) =>
            setTimeout(
              () => resolve(`Text 2, client-side, ${counter} call`),
              1000
            )
          );
        };
      })(),
    }}
  >
    {children}
  </AsyncDataStoreProvider>
);
