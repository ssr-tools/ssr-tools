import { Print } from "../components/Print";
import { A, buildHref, useSearchParam } from "../config/router";

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
