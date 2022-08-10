import { FC, ReactNode } from "react";
import { AsyncDataStoreProvider } from "../config/asyncDataStore";

export const AsyncProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <AsyncDataStoreProvider
    readers={{
      text: () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                "You had been waiting for this text for a one second." +
                  " It was resolved on the client-side."
              ),
            1000
          )
        ),
      longWaitText: () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                "You had been waiting for this text for 2 seconds." +
                  " It was resolved on the client-side."
              ),
            2000
          )
        ),
    }}
  >
    {children}
  </AsyncDataStoreProvider>
);
