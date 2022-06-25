import { Form } from "@ssr-tools/css/stylable/Form";
import { Print } from "../components/Print";
import { A, buildHref, useSearchParam, push, replace } from "../config/router";

export const SearchParamsPage = () => {
  const category = useSearchParam("/search-params", "category");
  const page = useSearchParam("/search-params", "page");
  const perPage = useSearchParam("/search-params", "perPage");

  return (
    <div>
      <Print text="Search params page" />
      <p>
        A page that demonstrates <code>useSearchParam</code> hook in action.
      </p>
      <h2>Parsed search params</h2>
      <textarea
        rows={5}
        cols={40}
        readOnly
        value={JSON.stringify(
          {
            category,
            page,
            perPage,
          },
          null,
          2
        )}
      />
      <h2>Example URLs with search params</h2>
      <ul>
        {searchParamsList.map((searchParams, i) => (
          <li key={i}>
            <A pathPattern="/search-params" searchParams={searchParams}>
              {buildHref("/search-params", {
                searchParams,
              })}
            </A>
          </li>
        ))}
      </ul>
      <h2>Push state</h2>
      <p>This form pushes the search params to the history</p>
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

          const [category, page, perPage] = Array.from(e.target.elements);

          if (!(category instanceof HTMLInputElement)) return;
          if (!(page instanceof HTMLInputElement)) return;
          if (!(perPage instanceof HTMLInputElement)) return;

          push("/search-params", {
            searchParams: {
              category: category.value,
              page: page.value,
              perPage: perPage.value,
            },
          });
        }}
      >
        <label>
          category
          <input name="category" />
        </label>
        <label>
          page
          <input name="page" />
        </label>
        <label>
          perPage
          <input name="perPage" />
        </label>
        <button type="submit">push</button>
      </Form>
      <h2>Replace state</h2>
      <p>This form replaces the search params in the history</p>
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

          const [category, page, perPage] = Array.from(e.target.elements);

          if (!(category instanceof HTMLInputElement)) return;
          if (!(page instanceof HTMLInputElement)) return;
          if (!(perPage instanceof HTMLInputElement)) return;

          replace("/search-params", {
            searchParams: {
              category: category.value,
              page: page.value,
              perPage: perPage.value,
            },
          });
        }}
      >
        <label>
          category
          <input name="category" />
        </label>
        <label>
          page
          <input name="page" />
        </label>
        <label>
          perPage
          <input name="perPage" />
        </label>
        <button type="submit">replace</button>
      </Form>
    </div>
  );
};

const searchParamsList: Array<
  Partial<Record<"page" | "perPage" | "category", string>>
> = [
  {
    category: "cars",
    page: "1",
    perPage: "20",
  },
  {
    category: "cars",
    page: "2",
    perPage: "20",
  },
  {
    category: "houses",
    page: "9999",
    perPage: "100",
  },
  {
    category: "products",
  },
  {
    page: "100",
  },
];
