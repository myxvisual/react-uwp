import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {
  headerHeight?: number;
}

export interface LinkProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export interface LinkState {
  hovered?: boolean;
}

const emptyFunc = () => {};
export default class Link extends React.Component<LinkProps, LinkState> {
  static defaultProps: LinkProps = {
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc
  };

  state: LinkState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

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
      <a
        {...attributes}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={styles.root}
      >
        {children}
      </a>
    );
  }
}

function getStyles(link: Link): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, headerHeight },
    state: { hovered }
  } = link;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      display: "inline-block",
      lineHeight: `${headerHeight}px`,
      fontSize: 15,
      color: theme.baseMediumHigh,
      background: hovered ? theme.accentDarker1 : "none",
      textDecoration: hovered ? "underline" : "none",
      padding: "0 26px",
      cursor: "pointer",
      transition: "all .25s",
      ...style
    })
  };
}
