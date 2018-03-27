import * as React from "react";
import * as Router from "react-router";
import * as PropTypes from "prop-types";

import scrollToYEasing from "react-uwp/common/browser/scrollToYEasing";

import Header from "./components/Header";
import Footer from "./components/Footer";
import getTheme from "react-uwp/styles/getTheme";
import getRootPath from "common/getRootPath";
import addCSSRule from "react-uwp/common/browser/addCSSRule";

import IconButton from "react-uwp/IconButton";
import FloatNav from "react-uwp/FloatNav";
import Tooltip from "react-uwp/Tooltip";

export interface DataProps {
  needScreenInfo?: boolean;
  onChangeRenderContentWidth?: (renderContentWidth?: string | number, screenType?: "phone" | "tablet" | "laptop" | "pc") => void;
}

export interface WrapperProps extends DataProps, Router.RouteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactElement<any>;
}

export interface WrapperState {
  headerHeight?: number;
  renderContentHeight?: number | string;
  renderContentWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const FOOTER_HEIGHT = 260;
const emptyFunc = () => {};

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  static defaultProps = {
    onChangeRenderContentWidth: emptyFunc,
    needScreenInfo: false
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: WrapperState = {
    headerHeight: 60
  };

  componentWillMount() {
    this.resize();
  }

  componentDidMount() {
    addCSSRule("body { overflow-x: hidden; }");
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize = (e?: Event) => {
    const { innerWidth } = window;
    if (innerWidth < 960) {
      const screenType = "phone";
      this.updateRenderContentWidth("100%", screenType);
    } else if (innerWidth >= 960 && innerWidth < 1366) {
      const screenType = "tablet";
      this.updateRenderContentWidth(960, screenType);
    } else if (innerWidth >= 1366 && innerWidth < 1920) {
      const screenType = "laptop";
      this.updateRenderContentWidth(1280, screenType);
    } else {
      const screenType = "pc";
      this.updateRenderContentWidth(1600, screenType);
    }
  }

  updateRenderContentWidth = (renderContentWidth: string | number, screenType: "phone" | "tablet" | "laptop" | "pc") => {
    if (this.state.renderContentWidth !== renderContentWidth) {
      this.props.onChangeRenderContentWidth(renderContentWidth, screenType);
      this.setState({
        renderContentWidth,
        screenType,
        headerHeight: screenType === "phone" ? 48 : 60
      });
    }
  }

  render() {
    const {
      className,
      id,
      style,
      path,
      children,
      needScreenInfo
    } = this.props;
    const { renderContentWidth, screenType, headerHeight } = this.state;
    const { theme } = this.context;
    const renderContentHeight = `calc(100vh - ${headerHeight + FOOTER_HEIGHT}px)`;

    let title = window.location.pathname.split("/").slice(-1)[0].split("-").map((str: string) => (str ? str[0].toUpperCase() + str.slice(1) : "")).join(" ");
    title = `${title ? `${title} - App Developer | Docs` : "React-UWP App Developer | Docs"}`;
    document.head.querySelector("title").textContent = title;

    const iconButtonStyle: React.CSSProperties = {
      color: "#fff",
      background: theme.accent
    };

    return (
      <div
        className={className}
        id={id}
        style={theme.prefixStyle({
          display: "flex",
          flexDirection: "column",
          ...style
        }) as any}
      >
        <Header
          screenType={screenType}
          docVersion={getRootPath()}
          headerHeight={headerHeight}
          renderContentWidth={renderContentWidth}
        />
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            position: "relative",
            minHeight: renderContentHeight
          }}
        >
          {React.cloneElement(children, needScreenInfo ? { renderContentWidth, screenType, renderContentHeight } : void 0)}
        </div>
        <Footer footerHeight={FOOTER_HEIGHT} renderContentWidth={renderContentWidth} />
        <div style={{ position: "fixed", right: 20, bottom: 40, zIndex: theme.zIndex.toast - 1 }}>
          <FloatNav
            topNode={
              <IconButton
                hoverStyle={iconButtonStyle}
                activeStyle={iconButtonStyle}
                onClick={() => location.href = "/"}
              >
                Home
              </IconButton>
            }
            expandedItems={[{
              iconNode: <IconButton
                hoverStyle={iconButtonStyle}
                activeStyle={iconButtonStyle}
              >
                {theme.useFluentDesign ? "HeartFill" : "Heart"}
              </IconButton>,
              title: "Toggle Fluent Design",
              onClick: () => {
                theme.saveTheme(getTheme({
                  themeName: theme.themeName,
                  accent: theme.accent,
                  useFluentDesign: !theme.useFluentDesign,
                  desktopBackgroundImage: theme.desktopBackgroundImage
                }));
              }
            }, {
              iconNode: <IconButton
                hoverStyle={iconButtonStyle}
                activeStyle={iconButtonStyle}
              >
                {theme.isDarkTheme ? "Brightness" : "QuietHours"}
              </IconButton>,
              title: "Toggle Theme",
              onClick: () => {
                theme.saveTheme(getTheme({
                  themeName: theme.isDarkTheme ? "light" : "dark",
                  accent: theme.accent,
                  useFluentDesign: theme.useFluentDesign,
                  desktopBackgroundImage: theme.desktopBackgroundImage
                }));
              }
            }]}
            bottomNode={[
              <IconButton
                style={iconButtonStyle}
                hoverStyle={iconButtonStyle}
                activeStyle={iconButtonStyle}
                onClick={() => scrollToYEasing()}
              >
                ScrollChevronUpLegacy
              </IconButton>
            ]}
          />
        </div>
      </div>
    );
  }
}

