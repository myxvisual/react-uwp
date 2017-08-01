import * as React from "react";
import * as PropTypes from "prop-types";
import PseudoClasses from "../PseudoClasses";

export interface DataProps {
  href?: string;
}
export interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement>, DataProps {}

const emptyFunc = () => {};
export default class Link extends React.Component<LinkProps> {
  static defaultProps: LinkProps = {
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { style, className, ...attributes } = this.props;
    const { theme } = this.context;
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
    const styleClasses = theme.prepareStyle({
      className: "link",
      style: inlineStyle,
      extendsClassName: className
    });

    return (
      <PseudoClasses {...styleClasses}>
        <a {...attributes} />
      </PseudoClasses>
    );
  }
}
