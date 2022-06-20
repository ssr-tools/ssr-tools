/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-has-content */

import { FC, HTMLProps, ReactNode } from "react";

/**
 * It's a wrapper for `<a />` tag. It takes the same props as `<a />`, but it
 * handles `onClick` differently.
 */
export const A: FC<AProps> = (props) => {
  const handleClick: NonNullable<typeof props.onClick> = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", props.href);

    // history.pushState does not trigger a popstate event
    window.dispatchEvent(new PopStateEvent("popstate", {}));

    props.onClick?.(e);
  };

  return <a onClick={handleClick} {...props} />;
};

export type AProps = HTMLProps<HTMLAnchorElement> & {
  children?: ReactNode;
};
