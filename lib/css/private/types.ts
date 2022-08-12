import { CSSProperties } from "react";
import { Nested } from "../Nested";

export type CssObject = Record<string, CSSProperties | Nested>;

export type SimpleCssObject = Record<string, CSSProperties>;
