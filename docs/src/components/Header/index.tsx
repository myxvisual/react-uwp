import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";
import Link from "./components/Link";
import ReactIcon from "../ReactIcon";

export interface DataProps {
  maxWidth?: number | string;
  headerHeight?: number;
}

export interface HeaderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface HeaderState {}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  static defaultProps: HeaderProps = {
    headerHeight: 60
  };

  state: HeaderState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      maxWidth,
      headerHeight,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div style={{ width: "100%", height: headerHeight }}>
        <div
          {...attributes}
          style={styles.root}
        >
          <div style={styles.content}>
            <a style={styles.logo} href="/">
              <ReactIcon fill={theme.accent} />
              <p style={{ marginLeft: 2 }}>React UWP</p>
            </a>
            <div style={{ marginLeft: 20, height: "100%" }}>
              <Link headerHeight={headerHeight} href="/">Get Started</Link>
              <Link headerHeight={headerHeight} href="/">Documentation</Link>
              <Link headerHeight={headerHeight} href="/">Design</Link>
              <Link headerHeight={headerHeight} href="/">Resources</Link>
              <Link headerHeight={headerHeight} href="/">Examples</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function getStyles(header: Header): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
  logo?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, maxWidth, headerHeight }
  } = header;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.altHigh,
      width: "100%",
      height: headerHeight,
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      left: 0,
      top: 0,
      zIndex: 1,
      ...style
    }),
    content: prepareStyles({
      display: "flex",
      flexDirection: "row",
      width: maxWidth,
      height: "100%"
    }),
    logo: prepareStyles({
      display: "flex",
      flex: "0 0 auto",
      flexDirection: "row",
      alignItems: "center",
      color: theme.accent,
      fontSize: 15,
      height: headerHeight,
      textDecoration: "none"
    })
  };
}
