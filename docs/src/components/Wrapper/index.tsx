import * as React from "react";
import * as Router from "react-router";
import * as PropTypes from "prop-types";

import scrollToYEasing from "react-uwp/common/browser/scrollToYEasing";

import Header from "./components/Header";
import Footer from "./components/Footer";
import getTheme from "react-uwp/styles/getTheme";
import getDocVersion from "../../common/getDocVersion";

import IconButton from "react-uwp/IconButton";
import FloatNav from "react-uwp/FloatNav";
import { ThemeType } from "react-uwp/styles/ThemeType";
import setScrollBarStyle from "react-uwp/styles/setScrollBarStyle";

export interface DataProps {
  onChangeRenderContentWidth?: (renderContentWidth?: string | number, screenType?: "phone" | "tablet" | "laptop" | "pc") => void;
}

export interface WrapperProps extends DataProps, Router.RouteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface WrapperState {
  renderContentWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 320;
const emptyFunc = () => {};

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  static defaultProps = {
    onChangeRenderContentWidth: emptyFunc
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  state: WrapperState = {};

  componentWillMount() {
    this.resize();
  }

  componentDidMount() {
    setScrollBarStyle();
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
    const { renderContentWidth } = this.state;
    const { theme } = this.context;

    return (
      <div
        className={className}
        id={id}
        style={theme.prepareStyles({
          display: "flex",
          flexDirection: "column",
          color: theme.baseMediumHigh,
          background: theme.chromeLow,
          ...style
        }) as any}
      >
        <Header
          docVersion={getDocVersion()}
          headerHeight={HEADER_HEIGHT}
          renderContentWidth={renderContentWidth}
        />
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`
          }}
        >
          {children}
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
                style={{
                  color: "#fff"
                }}
                hoverStyle={{}}
                onClick={() => {
                  theme.saveTheme(getTheme(theme.isDarkTheme ? "Light" : "Dark", theme.accent));
                }}
              >
                {theme.isDarkTheme ? "Brightness" : "QuietHours"}
              </IconButton>,
              <IconButton
                style={{
                  background: theme.accent,
                  color: "#fff"
                }}
                hoverStyle={{
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

