import { Print } from "../components/Print";
import { A, buildHref, usePathParam } from "../config/router";

export const PathParamsPage = () => {
  const category = usePathParam("/path-params/:category/:product", "category");
  const product = usePathParam("/path-params/:category/:product", "product");

  return (
    <div>
      <Print text="PathParams" />
      <p>
        A page that demonstrates <code>usePathParam</code> hook in action.
      </p>
      <h2>Parsed path params</h2>
      <p>
        Path pattern: <code>/path-params/:category/:product</code>
      </p>
      <textarea
        rows={4}
        cols={40}
        readOnly
        value={JSON.stringify(
          {
            category,
            product,
          },
          null,
          2
        )}
      />
      <ul>
        {pathParamsList.map((pathParams, i) => (
          <li key={i}>
            <A
              pathPattern="/path-params/:category/:product"
              pathParams={pathParams}
            >
              {buildHref("/path-params/:category/:product", {
                pathParams,
              })}
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
};

const pathParamsList: Array<Record<"category" | "product", string>> = [
  {
    category: "cars",
    product: "ferrari",
  },
  {
    category: "house",
    product: "mug",
  },
];
