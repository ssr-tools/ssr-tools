/**
 * It should catch server-like import paths e.g.:
 * `import { Foo } from "Foo.server.tsx"`
 *
 * It won't be tested against filename or absolute module name, but rather
 * against the string that we pass to `require(...)` or `import`.
 */
export const serverModuleRegExp = /(.{1,}.*\.server$|^server$)/g;
