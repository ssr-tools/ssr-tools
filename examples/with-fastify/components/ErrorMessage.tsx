import { FC } from "react";

export const ErrorMessage: FC<{
  error: unknown;
}> = ({ error }) => (
  <>
    <h1>
      {error instanceof Error && error.message
        ? `Error 500: "${error.message}"`
        : "Error 500"}
    </h1>
    <a href="/">Go back to the home page</a>
  </>
);
