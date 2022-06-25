import { Form } from "@ssr-tools/css/stylable/Form";
import { Print } from "../components/Print";
import { A, buildHref, usePathParam, push, replace } from "../config/router";

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
      <h2>Push state</h2>
      <p>This form pushes the path params to the history</p>
      <Form
        css={{
          "&": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!(e.target instanceof HTMLFormElement)) return;

          const [category, product] = Array.from(e.target.elements);

          if (!(category instanceof HTMLInputElement)) return;
          if (!(product instanceof HTMLInputElement)) return;

          push("/path-params/:category/:product", {
            pathParams: {
              category: category.value,
              product: product.value,
            },
          });
        }}
      >
        <label>
          category
          <input name="category" />
        </label>
        <label>
          product
          <input name="product" />
        </label>
        <button type="submit">push</button>
      </Form>
      <h2>Replace state</h2>
      <p>This form replaces the path params in the history</p>
      <Form
        css={{
          "&": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!(e.target instanceof HTMLFormElement)) return;

          const [category, product] = Array.from(e.target.elements);

          if (!(category instanceof HTMLInputElement)) return;
          if (!(product instanceof HTMLInputElement)) return;

          replace("/path-params/:category/:product", {
            pathParams: {
              category: category.value,
              product: product.value,
            },
          });
        }}
      >
        <label>
          category
          <input name="category" />
        </label>
        <label>
          product
          <input name="product" />
        </label>
        <button type="submit">replace</button>
      </Form>
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
