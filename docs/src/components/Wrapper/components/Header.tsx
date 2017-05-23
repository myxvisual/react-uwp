import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import ThemeType from "react-uwp/styles/ThemeType";
import NavLink from "./NavLink";
import ReactIcon from "../../ReactIcon";

export interface DataProps {
  renderContentWidth?: number | string;
  headerHeight?: number;
  docVersion?: string;
}

export interface HeaderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Header extends React.Component<HeaderProps, void> {
  static defaultProps: HeaderProps = {
    headerHeight: 60
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      renderContentWidth,
      headerHeight,
      docVersion,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <header style={{ width: "100%", height: headerHeight }}>
        <div
          {...attributes}
          style={styles.root}
        >
          <div style={styles.content}>
            <Link style={styles.logo} to={`${docVersion}/`}>
              <ReactIcon fill={theme.accent} />
              <p style={{ marginLeft: 2 }}>React UWP</p>
            </Link>
            <div style={{ marginLeft: 20, height: "100%" }}>
              <NavLink headerHeight={headerHeight} to={`${docVersion}/get-started`}>
                Get Started
              </NavLink>
              <NavLink headerHeight={headerHeight} to={`${docVersion}/components`}>
                Documentation
              </NavLink>
              <NavLink headerHeight={headerHeight} to={`${docVersion}/resources`}>
                Resources
              </NavLink>
              <NavLink headerHeight={headerHeight} to={`${docVersion}/examples`}>
                Examples
              </NavLink>
            </div>
          </div>
        </div>
      </header>
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
    props: { style, renderContentWidth, headerHeight }
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
      zIndex: 20,
      ...style
    }),
    content: prepareStyles({
      display: "flex",
      flexDirection: "row",
      width: renderContentWidth,
      height: "100%"
    }),
    logo: prepareStyles({
      display: "flex",
      flex: "0 0 auto",
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12,
      color: theme.accent,
      fontSize: 15,
      height: headerHeight,
      textDecoration: "none"
    })
  };
}
