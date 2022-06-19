# @ssr-tools

🚧 **The library is in early stage of the development, therefore is not recommended to use it on production** 🚧

`@ssr-tools` is a set of simple modules for a server-side rendered application development with React.

That’s an alternative approach to the React based frameworks, that often happen to be very limiting. With `@ssr-tools` you can compose the app from the modules that it really needs, no more no less.

# [Documentation](https://ssr-tools.notion.site/ssr-tools-documentation-ccb835a0f49941f99c19cc3732e47b66)

[See documentation for the user of the library https://ssr-tools.notion.site/ssr-tools-documentation-ccb835a0f49941f99c19cc3732e47b66.](https://ssr-tools.notion.site/ssr-tools-documentation-ccb835a0f49941f99c19cc3732e47b66) 


# Development

Below you can find a guidance for the `@ssr-tools` maintainers.

## Getting started

Before you start, you’ll need [NodeJS](https://nodejs.org/en/), [Git](http://git-scm.com/) and access to the terminal on your machine.

Open up the terminal and follow the instructions:

1. Clone the repo `git clone git@github.com:ssr-tools/ssr-tools.git`
2. Install shared dependencies `npm i`
3. You may also have to run `npm i` in the scope of a [workspace](https://docs.npmjs.com/cli/v8/using-npm/workspaces) that’d like to work on. For instance, if you’d like to work on a `@ssr-tools/css`, first you have to run `npm i -w lib/css`.
4. To test your work during the development, you either need to: 
    1. create some test cases and run: `npm run test` or `npm run test:e2e`, or
    2. use some example project to “click around”. To do that, you have to start the development server of the example project e.g.: `npm run dev -w examples/with-fastify` and open up the browser using the development server’s address e.g.: `http://localhost:3000` .

## Project structure

`@ssr-tools` takes an advantage of [the monorepo approach](https://en.wikipedia.org/wiki/Monorepo) and [npm workspaces.](https://docs.npmjs.com/cli/v8/using-npm/workspaces) The project does not have a single entry point by design.

### `/`

Besides subdirectories, it also consists of the configuration files.

### `/lib`

It consists of the directories that maps to the packages available to install:

- `/lib/css` → `npm i @ssr-tools/css`
- `/lib/async-data-store` → `npm i @ssr-tools/async-data-store`
- `/lib/eslint-config-ssr-tools` → `npm i eslint-config-ssr-tools` (this one is not under `@ssr-tools` to follow [the convention of ESLint’s sharable configs](https://eslint.org/docs/developer-guide/shareable-configs))
- and so on…

Each package in `lib` is an independent project, **they should never depend on each other.**

### `/examples`

It consists of the directories that maps to the example project. You may use them to run E2E tests or just “click around”.

- `/examples/with-fastify`
- and so on…

### `/scripts`

It consists of the shell scripts that automate repeating tasks such as building the project or publishing it to the npm registry. You can find more info about the particular script by reading comments in its code.

## Commit convention

We loosely follow the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Publishing a new version

1. Test your changes and make sure everything works as expected
2. Review the code and refactor it
3. Merge the changes to the `main` branch
4. Update the changelog
5. Bump the version following [SemVer](https://semver.org/)
6. Run `publishPackage` script in the package’s scope, e.g.: `npm run publishPackage -w lib/css`
7. After the new version has been published, commit the new version, e.g.: `git add . && git commit -m "build(css): 0.0.13" && git push`

## Tests

The tests are powered by [Jest](https://jestjs.io/) and [Puppeteer](https://pptr.dev/).

### Integration & Unit

To run integration & unit tests use `npm run test`.

These tests are built upon [React Test Utilities](https://reactjs.org/docs/test-utils.html). They are located in the `*.test.ts(x)` files inside the `/lib` directory.

### E2E

To run E2E tests use `npm run test:e2e` . 

These tests run in a real browser which is driven by Puppeteer. They are located in `*.e2e.ts` files inside the `/examples` directory. Make sure you did start the development server for the tested example, otherwise you’ll get an error.
