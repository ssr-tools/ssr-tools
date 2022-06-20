import { createContext } from "react";
import { RouterContextType } from "../types";

export const createRouterContext = () =>
  createContext<RouterContextType>({
    get value(): never {
      throw new Error("RouterContext is not provided");
    },
  });
