import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  href?: string;
}
export interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement>, DataProps {}

export interface LinkState {
  hover?: boolean;
}

const emptyFunc = () => {};
export default class Link extends React.Component<LinkProps, LinkState> {
  static defaultProps: LinkProps = {
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc
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
    const { onMouseEnter, onMouseLeave, ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <a
        {...attributes}
        onMouseEnter={this.mouseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
        style={styles.root}
      />
    );
  }
}

function getStyles(link: Link): {
  root?: React.CSSProperties;
} {
  const { context, props: { style }, state: { hover } } = link;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    root: theme.prefixStyle({
      fontSize: 14,
      color: hover ? theme.baseMedium : theme.accent,
      cursor: "pointer",
      textDecoration: "none",
      transition: "all .25s 0s ease-in-out",
      background: "none",
      ...style
    })
  };
}
