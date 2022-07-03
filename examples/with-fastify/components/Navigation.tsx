import { A, useCurrentPathPattern } from "../config/router";

import { Ul } from "@ssr-tools/css/stylable/Ul";

export const Navigation = () => {
  const currentPathPattern = useCurrentPathPattern();

  return (
    <nav>
      <Ul
        css={{
          "&": {
            padding: 0,
            lineHeight: "1.5",
          },
          "& > li": {
            listStyle: "none",
          },
          "& > li > a": {
            color: "black",
            textDecoration: "none",
            transition: "all ease-in-out 300ms",
          },
          "& > li > a:before": {
            content: '"🔗 "',
          },
          [activeSelector]: {
            fontWeight: "bold",
          },
        }}
      >
        <li>
          <A
            className={currentPathPattern === "/" ? activeClassName : ""}
            pathPattern="/"
            data-test-id="index-link"
          >
            Index
          </A>
        </li>
        <li>
          <A
            className={currentPathPattern === "/css" ? activeClassName : ""}
            pathPattern="/css"
            data-test-id="css-link"
          >
            Css
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/static-data" ? activeClassName : ""
            }
            pathPattern="/static-data"
            data-test-id="static-data-link"
          >
            Static data
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/async-data" ? activeClassName : ""
            }
            pathPattern="/async-data"
          >
            Async data
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/async-data-revalidation"
                ? activeClassName
                : ""
            }
            pathPattern="/async-data-revalidation"
          >
            Async data revalidation
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/search-params" ? activeClassName : ""
            }
            pathPattern="/search-params"
            data-test-id="search-params-link"
            searchParams={{
              category: "cars",
              page: "1",
              perPage: "12",
            }}
          >
            Search params
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/path-params/:category/:product"
                ? activeClassName
                : ""
            }
            pathPattern="/path-params/:category/:product"
            pathParams={{
              category: "cars",
              product: "ferrari",
            }}
            data-test-id="path-params-link"
          >
            Path params
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/hash-scroll" ? activeClassName : ""
            }
            pathPattern="/hash-scroll"
          >
            Hash scroll
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern ===
              "/router-isolated-renders/:pathParam1/:pathParam2"
                ? activeClassName
                : ""
            }
            pathPattern="/router-isolated-renders/:pathParam1/:pathParam2"
            pathParams={{
              pathParam1: "start",
              pathParam2: "start",
            }}
            searchParams={{
              searchParam1: "start",
              searchParam2: "start",
            }}
          >
            Router Isolated Renders
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/wild-card" ? activeClassName : ""
            }
            pathPattern="/wild-card"
          >
            Wild card
          </A>
        </li>
        <li>
          <a
            className={currentPathPattern === null ? activeClassName : ""}
            href="/404"
            data-test-id="404-link"
          >
            404
          </a>
        </li>
      </Ul>
    </nav>
  );
};

const activeClassName = "active-navigation-link";
const activeSelector = `& > li > .${activeClassName}`;
