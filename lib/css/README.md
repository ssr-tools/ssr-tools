# @ssr-tools/css

CSS-in-JS lib that helps to define CSS for the React components on the client & server, without any additional configuration from either side. 

> I've tried to use `@emotion/styled` which has similar approach of adding the `<style>` tag near the component children. However, it breaks the hydration process when I use it in `<Suspense>`. It somehow conflicts with the `<template>` tag that React uses internally to replace DOM elements during the HTML steaming. 

## Style component

```tsx
<Style
  element="div"
  css={{
    color: "blue",
    "& > span": {
      color: "green"
    }
  }}
>
  I'm blue <span>I'm green</span>
</Style>
```