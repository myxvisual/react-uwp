import * as React from "react";
import * as Router from "react-router";
import * as PropTypes from "prop-types";

import scrollToYEasing from "react-uwp/common/browser/scrollToYEasing";

import Header from "./components/Header";
import Footer from "./components/Footer";
import getTheme from "react-uwp/styles/getTheme";
import getRootPath from "../../common/getRootPath";

import IconButton from "react-uwp/IconButton";
import FloatNav from "react-uwp/FloatNav";

export interface DataProps {
  onChangeRenderContentWidth?: (renderContentWidth?: string | number, screenType?: "phone" | "tablet" | "laptop" | "pc") => void;
}

export interface WrapperProps extends DataProps, Router.RouteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface WrapperState {
  renderContentHeight?: number | string;
  renderContentWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 260;
const emptyFunc = () => {};

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  static defaultProps = {
    onChangeRenderContentWidth: emptyFunc
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: WrapperState = {};

  componentWillMount() {
    this.resize();
  }

  componentDidMount() {
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
        screenType
      });
    }
  }

  render() {
    const {
      className,
      id,
      style,
      path, // tslint:disable-line:no-unused-variable
      children
    } = this.props;
    const { renderContentWidth, screenType } = this.state;
    const { theme } = this.context;
    const renderContentHeight = `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`;

    return (
      <div
        className={className}
        id={id}
        style={theme.prepareStyles({
          display: "flex",
          flexDirection: "column",
          color: theme.baseHigh,
          background: theme.altHigh,
          ...style
        }) as any}
      >
        <Header
          screenType={screenType}
          docVersion={getRootPath()}
          headerHeight={HEADER_HEIGHT}
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
          {React.cloneElement(children as any, { renderContentWidth, screenType, renderContentHeight })}
        </div>
        <Footer footerHeight={FOOTER_HEIGHT} renderContentWidth={renderContentWidth} />
        <div style={{ position: "fixed", right: 20, bottom: 40, zIndex: 2000 }}>
          <FloatNav
            topNode={
              <IconButton
                hoverStyle={{
                  color: "#fff",
                  background: theme.accent
                }}
                onClick={() => location.href = "/"}
              >
                Home
              </IconButton>
            }
            bottomNode={[
              <IconButton
                hoverStyle={{
                  color: "#fff",
                  background: theme.accent
                }}
                onClick={() => {
                  theme.saveTheme(getTheme(theme.isDarkTheme ? "Light" : "Dark", theme.accent));
                }}
              >
                {theme.isDarkTheme ? "Brightness" : "QuietHours"}
              </IconButton>,
              <IconButton
                hoverStyle={{}}
                style={{
                  color: "#fff",
                  background: theme.accent
                }}
                onClick={() => scrollToYEasing(0)}
              >
                ScrollChevronUpLegacy
              </IconButton>
            ]}
            floatNavWidth={200}
          />
        </div>
      </div>
    );
  }
}

