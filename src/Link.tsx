import { useTheme } from './hooks/useTheme';
import * as React from "react";
import { useContext } from "react";

import PseudoClasses from "./PseudoClasses";

export interface DataProps {
  href?: string;
}
export type LinkProps = DataProps & React.HTMLAttributes<HTMLAnchorElement>;

const Link: React.FC<LinkProps> = (props) => {
  const { style, children, className, onMouseEnter, onMouseLeave, ...attributes } = props;
  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);
  
  const cls = getCls(theme, props);

  return (
    <PseudoClasses className={cls.className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <a {...attributes}>
        {children}
      </a>
    </PseudoClasses>
  );
};

export default Link;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: LinkProps) => {
  const { style, className } = props;
  const inlineStyle = theme.prefixStyle({
    fontSize: 14,
    color: theme.accent,
    cursor: "pointer",
    textDecoration: "none",
    transition: "all .25s 0s ease-in-out",
    background: "none",
    "&:hover": {
      color: theme.baseMedium
    },
    ...style
  });

  const classStr = theme.prepareStyle(inlineStyle, "link");
  return {
    className: theme.classNames?.(classStr, className) || classStr
  };
};
