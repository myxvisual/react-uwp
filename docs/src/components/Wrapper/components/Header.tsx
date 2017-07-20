import * as React from "react";
import { findDOMNode } from "react-dom";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import DropDownMenu from "react-uwp/DropDownMenu";
import IconButton from "react-uwp/IconButton";
import NavLink from "./NavLink";
import { WrapperState } from "../";
import ReactIcon from "../../ReactIcon";
import DocsTreeView from "../../DocsTreeView";

export interface DataProps extends WrapperState {
  headerHeight?: number;
  docVersion?: string;
}
import getCurrVersion from "common/getCurrVersion";

export interface HeaderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface HeaderState {
  currVersion?: string;
  currVersions?: string[];
  showDocsTreeView?: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  static defaultProps: HeaderProps = {
    headerHeight: 60
  };
  state: HeaderState = {
    currVersion: getCurrVersion(),
    currVersions: ["HEAD"],
    showDocsTreeView: false
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  docsTreeView: DocsTreeView;
  docsTreeViewElm: HTMLDivElement;
  navButton: IconButton;
  navButtonElm: HTMLDivElement;

  componentDidMount() {
    const self = this;
    const url = "https://www.react-uwp.com/versions.json";
    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.setState({
          currVersions: JSON.parse(request.responseText).concat(["HEAD"]).reverse()
        });
      }
    };

    request.open("GET", url, true);
    request.send();
    window.addEventListener("click", this.handleWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowClick);
  }

  handleWindowClick = (e: Event) => {
    if (!this.docsTreeViewElm && this.docsTreeView) this.docsTreeViewElm = findDOMNode(this.docsTreeView) as HTMLDivElement;
    if (!this.navButtonElm && this.navButton) this.navButtonElm = findDOMNode(this.navButton) as HTMLDivElement;
    const { showDocsTreeView } = this.state;
    const isOut = (this.docsTreeViewElm && this.navButtonElm) && !this.docsTreeViewElm.contains(e.target as any) && !this.navButtonElm.contains(e.target as any);
    if (isOut && showDocsTreeView) {
      this.setState({
        showDocsTreeView: !showDocsTreeView
      });
    }
  }

  handleChangeVersion = (version: string) => {
    const currVersion = getCurrVersion();
    if ((version === "HEAD" && currVersion === "HEAD") || (
      version === currVersion
    )) {
      return;
    }
    if (version === "HEAD" && currVersion !== "HEAD") {
      const href = location.href.replace(`${currVersion}/`, "");
      window.location.href = href;
    }
    if (version !== "HEAD" && currVersion === "HEAD") {
      window.location.pathname = `/${version}${location.pathname}`;
    }
    if (version !== "HEAD" && currVersion !== "HEAD") {
      const href = location.href.replace(currVersion, version);
      window.location.href = href;
    }
  }

  toggleShowDocsTreeView = (showDocsTreeView?: any) => {
    if (typeof showDocsTreeView === "boolean") {
      if (showDocsTreeView !== this.state.showDocsTreeView) {
        this.setState({ showDocsTreeView });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showDocsTreeView: !prevState.showDocsTreeView
      }));
    }
  }

  render() {
    const {
      renderContentWidth,
      headerHeight,
      docVersion,
      screenType,
      ...attributes
    } = this.props;
    const { currVersion, currVersions, showDocsTreeView } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const isPhoneScreen = screenType === "phone";
    const isBigScreen = screenType === "pc" || screenType === "laptop";

    return (
      <header style={{ width: "100%", height: headerHeight }}>
        {!isBigScreen ? (
          <DocsTreeView
            ref={docsTreeView => this.docsTreeView = docsTreeView}
            style={{
              position: "fixed",
              top: headerHeight,
              height: "calc(100vh - 48px)",
              left: 0,
              zIndex: theme.zIndex.header + 2,
              transition: "all .25s",
              transform: `translate3d(${showDocsTreeView ? "0" : "-100%"}, 0, 0)`
            }}
          />
        ) : null}
        <div
          {...attributes}
          style={styles.root}
        >
          <div style={styles.content}>
            {!isBigScreen && (
              <IconButton
                ref={navButton => this.navButton = navButton}
                size={isPhoneScreen ? 48 : 60}
                style={isPhoneScreen ? void 0 : { fontSize: 24 }}
                onClick={this.toggleShowDocsTreeView}
              >
                GlobalNavButton
              </IconButton>
            )}
            <Link style={styles.logo} to={`${docVersion}/`}>
              <ReactIcon height={isPhoneScreen ? 36 : 48} fill={theme.accent} />
              <p style={{ marginLeft: 2 }}>React UWP</p>
            </Link>
            <div style={styles.navContent}>
              {!isPhoneScreen && (
                <div style={styles.links}>
                  <NavLink headerHeight={headerHeight} to={`${docVersion}/get-started`}>
                    Get Started
                  </NavLink>
                  <NavLink headerHeight={headerHeight} to={`${docVersion}/components`}>
                    Components
                  </NavLink>
                  <NavLink headerHeight={headerHeight} to={`${docVersion}/resources`}>
                    Resources
                  </NavLink>
                  <NavLink headerHeight={headerHeight} to={`${docVersion}/showcase`}>
                    Showcase
                  </NavLink>
                </div>
              )}
              <div style={{ width: isPhoneScreen ? 80 : 120 }}>
                <DropDownMenu
                  wrapperAttributes={{
                    style: {
                      maxHeight: 174
                    }
                  }}
                  style={{
                    zIndex: theme.zIndex.header + 1,
                    position: "fixed",
                    top: isPhoneScreen ? 9 : 14,
                    right: isPhoneScreen ? 20 : (window.innerWidth - (renderContentWidth as any)) / 2
                  }}
                  itemWidth={isPhoneScreen ? 80 : 120}
                  defaultValue={currVersion}
                  background={theme.altHigh}
                  values={currVersions}
                  onChangeValue={this.handleChangeVersion}
                />
              </div>
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
  const { prefixStyle } = theme;
  const isPhoneScreen = screenType === "phone";

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.useFluentDesign ? (
        theme.isDarkTheme ? "hsla(0, 0%, 0%, 0.95)" : "hsla(0, 0%, 100%, 0.95)"
      ) : (
        theme.isDarkTheme ? "hsla(0, 0%, 5%, 0.85)" : "hsla(0, 0%, 95%, 0.85)"
      ),
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
      zIndex: theme.zIndex.header,
      ...style
    }),
    content: prefixStyle({
      display: "flex",
      flexDirection: "row",
      justifyContent: isPhoneScreen ? "space-between" : void 0,
      width: renderContentWidth,
      height: "100%",
      overflow: "auto",
      flexWrap: "nowrap"
    }),
    logo: prefixStyle({
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
    navContent: prefixStyle({
      width: isPhoneScreen ? void 0 : "100%",
      marginLeft: 20,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    links: prefixStyle({
      color: "inherit",
      height: "100%",
      overflow: "hidden"
    })
  };
}
