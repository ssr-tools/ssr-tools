import { A, useCurrentPathPattern } from "../config/router";

import "purecss/build/pure-min.css";
import { Ul } from "@ssr-tools/css/stylable/Ul";
import { StyleBuilder } from "@ssr-tools/css/components/StyleBuilder";

export const Navigation = () => {
  const currentPathPattern = useCurrentPathPattern();

  return (
    <nav>
      <StyleBuilder
        css={{
          "&": {
            borderBottom: "2px solid green",
          },
        }}
      >
        {(activeClassName) => (
          <Ul
            css={{
              "&": {
                display: "flex",
                columnGap: "10px",
              },
              "& li": {
                listStyle: "none",
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
                  currentPathPattern === "/pure-css" ? activeClassName : ""
                }
                pathPattern="/pure-css"
              >
                PureCss
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
              <a href="/404">404</a>
            </li>
          </Ul>
        )}
      </StyleBuilder>
    </nav>
  );
};
