import { FC, useRef } from "react";
import { Print } from "../components/Print";
import { usePathParam, usePush, useSearchParam } from "../config/router";

export const RouterIsolatedRendersPage = () => {
  return (
    <div>
      <Print text="Router isolated renders" />
      <p>
        A page that shows how the updates in the route parameters are isolated.
        Changing the value of a parameter only re-renders a component that uses
        the parameter. There will be no re-rendering of the components that use
        other parameters.
      </p>
      <p>
        <SearchParam paramName="searchParam1" />
      </p>
      <p>
        <SearchParam paramName="searchParam2" />
      </p>
      <p>
        <PathParam paramName="pathParam1" />
      </p>
      <p>
        <PathParam paramName="pathParam2" />
      </p>
      <ChangeParamsButtons />
    </div>
  );
};

const SearchParam: FC<{
  paramName: "searchParam1" | "searchParam2";
}> = ({ paramName }) => {
  const paramValue = useSearchParam(
    "/router-isolated-renders/:pathParam1/:pathParam2",
    paramName
  );
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <textarea
      data-test-id={paramName}
      readOnly
      rows={2}
      cols={40}
      value={JSON.stringify({
        value: paramValue,
        renders: renderCount.current,
      })}
    />
  );
};

const PathParam: FC<{
  paramName: "pathParam1" | "pathParam2";
}> = ({ paramName }) => {
  const paramValue = usePathParam(
    "/router-isolated-renders/:pathParam1/:pathParam2",
    paramName
  );
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <textarea
      data-test-id={paramName}
      readOnly
      rows={2}
      cols={40}
      value={JSON.stringify({
        value: paramValue,
        renders: renderCount.current,
      })}
    />
  );
};

const ChangeParamsButtons = () => {
  const updateParam = useUpdateParam();

  return (
    <ul>
      <li>
        <button
          onClick={() => updateParam("pathParam1")}
          data-test-id="update-pathParam1"
        >
          Update pathParam1
        </button>
      </li>
      <li>
        <button
          onClick={() => updateParam("pathParam2")}
          data-test-id="update-pathParam2"
        >
          Update pathParam2
        </button>
      </li>
      <li>
        <button
          onClick={() => updateParam("searchParam1")}
          data-test-id="update-searchParam1"
        >
          Update searchParam1
        </button>
      </li>
      <li>
        <button
          onClick={() => updateParam("searchParam2")}
          data-test-id="update-searchParam2"
        >
          Update searchParam2
        </button>
      </li>
    </ul>
  );
};

const useUpdateParam = () => {
  const push = usePush();

  const updateParam = (paramName: ParamName) => {
    push("/router-isolated-renders/:pathParam1/:pathParam2", (prevConfig) => {
      const pathParamUpdate =
        paramName === "pathParam1" || paramName === "pathParam2"
          ? {
              [paramName]: prevConfig.pathParams[paramName] + "-update",
            }
          : {};

      const searchParamUpdate =
        paramName === "searchParam1" || paramName === "searchParam2"
          ? {
              [paramName]: prevConfig.searchParams
                ? prevConfig.searchParams[paramName] + "-update"
                : "start",
            }
          : {};

      return {
        pathParams: {
          ...prevConfig.pathParams,
          ...pathParamUpdate,
        },
        searchParams: {
          ...prevConfig.searchParams,
          ...searchParamUpdate,
        },
      };
    });
  };

  return updateParam;
};

type ParamName = "pathParam1" | "pathParam2" | "searchParam1" | "searchParam2";
