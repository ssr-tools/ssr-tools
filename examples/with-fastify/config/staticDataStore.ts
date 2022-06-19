import { createStaticDataStore } from "@ssr-tools/static-data-store/createStaticDataStore";

import * as sup from "superstruct";

const { StaticDataStoreProvider, StaticDataStoreScriptTag, useStaticData } =
  createStaticDataStore({
    identifier: "static-data-store",
    validate: (value) => staticDataStruct.create(value),
  });

const staticDataStruct = sup.object({
  initialPathname: sup.string(),
  initialHash: sup.string(),
  texts: sup.array(sup.string()),
});

export { StaticDataStoreProvider, StaticDataStoreScriptTag, useStaticData };
