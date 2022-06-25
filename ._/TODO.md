<!-- TODO start -->
- Make sure that update to one value does not cause rerenders in components that depend on other values in the RouterContext
  - Avoid re-rendering the whole RouterProvider on all changes in the router. Put the state into ref, then allow some components to subscribe to the required state
- Add E2E tests for params
- Add more integration/unit tests
- Measure performance of searchParams and pathParams related hooks, and functions, and use snapshots to keep optimal performance
- Bump eslint version
<!-- TODO end -->

<!-- 
  This file is in the "._" directory, so that we can have it at the top of directory tree.

  We can Add todo list between TODO start and TODO end like:
  - todo 1
  - todo 2

  We should never remove `TODO start` and `TODO end` comments so that pre-push
  hook can inform about left todos.
-->