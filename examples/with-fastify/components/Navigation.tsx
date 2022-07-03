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
          "& > li > a:hover": {
            borderLeft: "10px solid black",
            paddingLeft: 5,
          },
          "& > li > a:before": {
            content: '"🔗 "',
          },
          [activeSelector]: {
            borderLeft: "10px solid black",
            paddingLeft: 5,
          },
        }}
      >
        <li>
          <A
            className={currentPathPattern === "/" ? activeClassName : ""}
            pathPattern="/"
          >
            Index
          </A>
        </li>
        <li>
          <A
            className={
              currentPathPattern === "/hello-world" ? activeClassName : ""
            }
            pathPattern="/hello-world"
          >
            Hello world
          </A>
        </li>
        <li>
          <A
            className={currentPathPattern === "/css" ? activeClassName : ""}
            pathPattern="/css"
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
