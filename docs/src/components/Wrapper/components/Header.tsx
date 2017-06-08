import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import IconButton from "react-uwp/IconButton";
import NavLink from "./NavLink";
import { WrapperState } from "../";
import ReactIcon from "../../ReactIcon";

export interface DataProps extends WrapperState {
  headerHeight?: number;
  docVersion?: string;
}

export interface HeaderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Header extends React.Component<HeaderProps, void> {
  static defaultProps: HeaderProps = {
    headerHeight: 60
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      renderContentWidth,
      headerHeight,
      docVersion,
      screenType,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const isPhoneScreen = screenType === "phone";

    return (
      <header style={{ width: "100%", height: headerHeight }}>
        <div
          {...attributes}
          style={styles.root}
        >
          <div style={styles.content}>
            {isPhoneScreen && (
              <IconButton>GlobalNavButton</IconButton>
            )}
            <Link style={styles.logo} to={`${docVersion}/`}>
              <ReactIcon fill={theme.accent} />
              <p style={{ marginLeft: 2 }}>React UWP</p>
            </Link>
            <div style={styles.navContent}>
              {!isPhoneScreen && (
                <div style={styles.links}>
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
              )}
              {isPhoneScreen ? (
                <IconButton>Search</IconButton>
              ) : (
                <AutoSuggestBox
                  background="none"
                  placeholder="Search Feature is building..."
                />
              )}
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
  navContent?: React.CSSProperties;
  links?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, renderContentWidth, screenType, headerHeight }
  } = header;
  const { prepareStyles } = theme;
  const isPhoneScreen = screenType === "phone";

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.isDarkTheme ? "hsla(0, 0%, 6%, 0.85)" : "hsla(0, 0%, 94%, 0.85)",
      boxShadow: theme.isDarkTheme ? void 0 : `0 2px 8px ${theme.listLow}`,
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
      justifyContent: isPhoneScreen ? "space-between" : void 0,
      width: renderContentWidth,
      height: "100%",
      overflow: "auto",
      flexWrap: "no-wrap"
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
    }),
    navContent: prepareStyles({
      width: isPhoneScreen ? void 0 : "100%",
      marginLeft: 20,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    links: prepareStyles({
      color: "inherit",
      height: "100%",
      overflow: "hidden"
    })
  };
}
