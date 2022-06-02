# @ssr-tools/css

CSS-in-JS lib that helps to define CSS for the React components on the client & server, without any additional configuration from either side. 

## Advantages

- Your CSS is not bigger than it has to be
  - Your app does not have to know what CSS it needs for a given route before rendering it. That's helpful since you don't have to tell what CSS file you need for a given route, neither adjust the webpack configuration to automatize the process. You get only CSS you need for a given component's tree - no more, no less.
- Your CSS is streamable
  - That means your app can take advantage of [a new suspense architecture in React 18](https://github.com/reactwg/react-18/discussions/37). It's particularly beneficial when you combine it with streamable data source like: [@ssr-tools/async-data-store](https://www.npmjs.com/package/@ssr-tools/async-data-store)
- Your CSS is backed by TypeScript
  - Since you define the CSS in the `.tsx` files, TypeScript constantly helps you to avoid typos in your CSS markup. Also, you get intellisense for your CSS automatically, since most likely your editor is already configured to support TypeScript. You don't need any additional configuration to support CSS.
- Your CSS is scoped
  - Each time you define a new CSS definition you get a new CSS scope. You won't get into the namespace conflicts (you can forget about things like BEM...), since each CSS class will automatically get a unique hash.
- Your CSS is debuggable
  - You can define an additional identifier for the CSS class, so that you can easily identify them in the browser's devtools. 
- Your CSS is written in your app code
  - You get less context switching. CSS-IN-JS is to CSS the same thing as ORM is to SQL.
- Your CSS is available for vendors or your custom code
  - You are not tighten to a predefined set of components, nor to `className` prop. You can provide a generated `className` to any component's prop.

## Usage

You should not need any additional configuration, just make sure your app uses React 18 or higher.

### 1. Install the module

```
npm i @ssr-tools/css
```

### 2. Wrap your entrypoint component with `<StyleCacheProvider>`

Usually, it would be `App.tsx`:

```tsx
// App.tsx

export const App = () => {
  return (
    <StyleCacheProvider>
      <Router />
      {/* ...other providers, etc... */}
    </StyleCacheProvider>
  )
};
```

### 3. Add some css

Now you can add the css using components from `@ssr-tools/css/stylables/*` or
`@ssr-tools/css/components/StyleBuilder`. See [Api](#api) section below.


## Api

### Stylables

Most of the time you can use predefined stylables - HTML elements written with a PascalCase. They accept the standard HTML attributes like HTML elements in React. However, they also need the `css` prop, and optionally `cssIdentifier`:

```tsx
import { Span } from "@ssr-tools/css/stylables/Span";

// ...

<Span
  // **optional** identifier useful for debugging
  cssIdentifier={NODE_ENV === "development" ? "hello" : undefined 
  css={{
    // & is replaced with a unique class name
    "&": { 
      color: "red"
    },
    "& > span": {
      color: "blue"
    }
  }}
>
  I'm red <span>I'm blue</span>
</Span>
```

### StyleBuilder

In case you need to provide the generated CSS to a custom component you can use `<StyleBuilder>` component. It gives you more flexibility, but at the cost of less convenient API. The api is similar to the stylable components' API:

```tsx
import { StyleBuilder } from "@ssr-tools/css/components/";
import { CustomComponent } from "./CustomComponent";

// ...

<StyleBuilder
  // **optional** identifier useful for debugging
  identifier={NODE_ENV === "development" ? "hello" : undefined

  css={{
    // & is replaced with a unique class name
    "&": { 
      color: "red"
    },
    "& > span": {
      color: "blue"
    }
  }}
>
  {className => <CustomComponent className={className} />}
</StyleBuilder>
```

## Similar solutions

- At first I've tried to use `@emotion/styled` which has similar approach of adding the `<style>` tag near the component children. However, it breaks the hydration process when I use it in `<Suspense>`. It somehow conflicts with the `<template>` tag that React uses internally to replace DOM elements during the HTML steaming. That's why decided I need something simpler.
