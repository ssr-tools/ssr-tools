/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-has-content */

import { FC, HTMLProps, ReactNode } from "react";
import { push } from "./push";

/**
 * It's a wrapper for `<a />` tag. It takes the same props as `<a />`, but it
 * handles `onClick` differently. Instead navigating the browser the different
 * page, it triggers the PopStateEvent that is handled by Router.
 */
export const A: FC<AProps> = (props) => {
  const handleClick: NonNullable<typeof props.onClick> = (e) => {
    e.preventDefault();
    push(props.href);

    props.onClick?.(e);
  };

  return <a onClick={handleClick} {...props} />;
};

export type AProps = HTMLProps<HTMLAnchorElement> & {
  children?: ReactNode;
  href: string;
};
