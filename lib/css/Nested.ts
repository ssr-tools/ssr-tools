import type { SimpleCssObject } from "./private/types";

export class Nested {
  css: SimpleCssObject;

  constructor(css: SimpleCssObject) {
    this.css = css;
  }
}
