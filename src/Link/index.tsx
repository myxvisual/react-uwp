import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";

export interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {}

export interface LinkState {
  hover?: boolean;
}

export default class Link extends React.Component<LinkProps, LinkState> {
  static defaultProps: LinkProps = {
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: LinkState = {};
  shouldComponentUpdate(nextProps: LinkProps, nextState: LinkState, nextContext: any) {
    return nextProps !== this.props || nextState !== this.state || nextContext.theme !== this.context;
  }

  mouseEnterHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    this.setState({ hover: true });
    this.props.onMouseEnter(e);
  }

  mouseLeaveHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    this.setState({ hover: false });
    this.props.onMouseLeave(e);
  }

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { onMouseEnter, onMouseLeave, ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <a
        {...attributes}
        onMouseEnter={this.mouseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
      />
    );
  }
}

function getStyles(link: Link): {
  root?: React.CSSProperties;
} {
  const { context, state: { hover } } = link;
  const { theme } = context;
  // tslint:disable-next-line:no-unused-variable
  const { prepareStyles } = theme;

  return {
    root: theme.prepareStyles({
      fontSize: 14,
      color: hover ? theme.baseMedium : theme.accent,
      cursor: "pointer",
      textDecoration: "none",
      transition: "all .25s 0s ease-in-out",
      background: "none"
    })
  };
}
