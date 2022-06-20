/**
 * It should catch client-like import paths e.g.:
 * `import { Foo } from "Foo.client.tsx"`
 *
 * It won't be tested against filename or absolute module name, but rather
 * against the string that we pass to `require(...)` or `import`.
 */
export const clientModuleRegExp = /(.{1,}.*\.client$|^client$)/g;
