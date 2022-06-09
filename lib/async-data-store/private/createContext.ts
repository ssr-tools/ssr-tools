import React from "react";
import { AsyncDataStoreContextType } from "../types";

export const createContext = <T extends Record<string, unknown>>() =>
  React.createContext<AsyncDataStoreContextType<T>>({
    get value(): never {
      throw new Error("Missing AsyncDataStoreContext");
    },
  });
