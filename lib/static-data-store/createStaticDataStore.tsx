import { createContext, FC, ReactNode, useContext, VFC } from "react";

export function createStaticDataStore<T extends Record<string, unknown>>({
  validate,
  identifier,
}: {
  validate: (parsedData: unknown) => T;
  identifier: string;
}) {
  const StaticDataStoreContext = createContext<{
    staticData: T | null;
  }>({
    staticData: null,
  });

  const StaticDataStoreProvider: FC<{
    staticData: T;
    children: ReactNode;
  }> = ({ children, staticData }) => {
    if (typeof window !== "undefined") {
      throw new Error(
        "StaticDataStoreProvider is meant to be used on the server-side only"
      );
    }

    return (
      <StaticDataStoreContext.Provider
        value={{
          staticData,
        }}
      >
        {children}
      </StaticDataStoreContext.Provider>
    );
  };

  const StaticDataStoreScriptTag: VFC = () => {
    const { staticData } = useContext(StaticDataStoreContext);

    if (typeof window !== "undefined") {
      throw new Error(
        "StaticDataStoreScriptTag is meant to be used on the server-side only"
      );
    }

    return (
      <script
        // TODO: handle `nonce` attr
        data-static-identifier={identifier}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(staticData),
        }}
        type="application/json"
      />
    );
  };

  const useStaticData = () => {
    const { staticData: staticDataForServer } = useContext(
      StaticDataStoreContext
    );

    const getDataForClient = () => {
      const dataScript = window.document.querySelector(
        `script[data-static-identifier=${identifier}]`
      );

      const stringifiedData = dataScript
        ? String(dataScript.textContent)
        : "{}";

      const parsedData = JSON.parse(stringifiedData);

      try {
        return validate(parsedData);
      } catch (err) {
        console.error("Cannot parse SSR data");
        console.error(err);
        return null;
      }
    };

    const data =
      typeof window !== "undefined" ? getDataForClient() : staticDataForServer;

    if (!data) throw new Error("Cannot get static data");
    return data;
  };

  return {
    StaticDataStoreProvider,
    StaticDataStoreScriptTag,
    useStaticData,
  };
}
