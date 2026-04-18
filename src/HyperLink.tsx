import { useTheme } from './hooks/useTheme';
import * as React from "react";
import { useContext } from "react";

import Link from "./Link";

export interface DataProps {
  /**
   * `ref` to link, other attributes is applied to `HTMLAnchorElement`.
   */
  ref?: string;
  href?: string;
  target?: string;
}

export type HyperLinkProps = DataProps & React.HTMLAttributes<HTMLAnchorElement>;

const HyperLink: React.FC<HyperLinkProps> = (props) => {
  const { style, children, ...attributes } = props;
  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);

  const cls = getCls(theme, props);

  return (
    <Link {...attributes} style={cls.style}>
      {children}
    </Link>
  );
};

export default HyperLink;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: HyperLinkProps) => {
  const { style } = props;
  return {
    style: theme.prefixStyle({
      position: "relative",
      lineHeight: 1.8,
      padding: "2px 4px",
      textDecoration: "underline",
      ...style
    })
  };
};
