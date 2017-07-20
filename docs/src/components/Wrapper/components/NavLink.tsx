import * as React from "react";
import * as PropTypes from "prop-types";
import { Link, LinkProps } from "react-router";

export interface DataProps {
  headerHeight?: number;
}

export interface NavLinkProps extends DataProps, LinkProps {}

export interface NavLinkState {
  hovered?: boolean;
}

const emptyFunc = () => {};
export default class NavLink extends React.Component<NavLinkProps, NavLinkState> {
  static defaultProps: NavLinkProps = {
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc,
    to: "/"
  };

  state: NavLinkState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
    this.props.onMouseEnter(e);
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (this.state.hovered) {
      this.setState({ hovered: false });
    }
    this.props.onMouseLeave(e);
  }

  render() {
    const {
      headerHeight,
      children,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <Link
        {...attributes as LinkProps}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={styles.root}
      >
        {children}
      </Link>
    );
  }
}

function getStyles(navLink: NavLink): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, headerHeight },
    state: { hovered }
  } = navLink;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      lineHeight: `${headerHeight}px`,
      fontSize: 15,
      background: hovered ? theme.baseLow : "none",
      color: "inherit",
      textDecoration: hovered ? "underline" : "none",
      padding: "0 26px",
      cursor: "pointer",
      transition: "all .25s",
      ...style
    })
  };
}
