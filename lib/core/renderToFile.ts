import fs from "fs";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

export const renderToFile = async (path: string, jsx: ReactElement) => {
  const content = `<!DOCTYPE html>${renderToString(jsx)}`;
  fs.writeFileSync(path, content, {
    encoding: "utf-8",
  });
};
