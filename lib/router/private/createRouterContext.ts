import { createContext } from "react";
import { RouterContextType } from "../types";

export const createRouterContext = () =>
  createContext<RouterContextType>({
    get routerRef(): never {
      throw new Error("RouterContext is not provided");
    },
    get subscribe(): never {
      throw new Error("RouterContext is not provided");
    },
  });
