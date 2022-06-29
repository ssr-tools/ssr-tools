import { Form } from "@ssr-tools/css/stylable/Form";
import { Print } from "../components/Print";
import {
  A,
  buildHref,
  usePush,
  useReplace,
  useSearchParam,
} from "../config/router";

export const SearchParamsPage = () => {
  const category = useSearchParam("/search-params", "category");
  const page = useSearchParam("/search-params", "page");
  const perPage = useSearchParam("/search-params", "perPage");
  const push = usePush();
  const replace = useReplace();

  return (
    <div>
      <Print text="SearchParams" />
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
        {searchParamsList.map((searchParams, i) => {
          const { category, page, perPage } = searchParams;

          return (
            <li key={i}>
              <A
                data-test-id={`link-${category}-${page}-${perPage}`}
                pathPattern="/search-params"
                searchParams={searchParams}
              >
                {buildHref("/search-params", {
                  searchParams,
                })}
              </A>
            </li>
          );
        })}
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
          <input name="category" data-test-id="push-category" />
        </label>
        <label>
          page
          <input name="page" data-test-id="push-page" />
        </label>
        <label>
          perPage
          <input name="perPage" data-test-id="push-perPage" />
        </label>
        <button type="submit" data-test-id="push-submit">
          push
        </button>
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
          <input name="category" data-test-id="replace-category" />
        </label>
        <label>
          page
          <input name="page" data-test-id="replace-page" />
        </label>
        <label>
          perPage
          <input name="perPage" data-test-id="replace-perPage" />
        </label>
        <button type="submit" data-test-id="replace-submit">
          replace
        </button>
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
