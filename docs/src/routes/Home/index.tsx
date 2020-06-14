import * as React from "react";
import * as ReactRouter from "react-router";
import * as PropTypes from "prop-types";

import Image from "react-uwp/Image";
import MediaPlayer from "react-uwp/MediaPlayer";
import Toast from "react-uwp/Toast";
import RevealEffect from "react-uwp/RevealEffect";
import getRootPath from "utils/getRootPath";

import FlipView, { FlipViewProps } from "react-uwp/FlipView";
import { WrapperState } from "components/Wrapper";
import FlipViewItem from "./components/FlipViewItem";
import Categories from "./components/Categories";
import Banner from "./components/Banner";
import CustomTheme from "./components/CustomTheme";

const docVersion = getRootPath();
export interface DataProps extends WrapperState {}
export interface HomeProps extends DataProps, ReactRouter.RouteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
export interface HomeState {
  showToast?: boolean;
}

const newWindow = window as any;
export default class Home extends React.Component<HomeProps, HomeState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  showToastTimer: any;

  state: HomeState = {
    showToast: false
  };

  componentDidMount() {
    if (!newWindow.__REACT_UWP__showedToast) {
      this.showToastTimer = setTimeout(() => {
        newWindow.__REACT_UWP__showedToast = true;
        this.setState({ showToast: true });

        this.showToastTimer = setTimeout(() => {
          this.setState({ showToast: false });
        }, 5750);
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.showToastTimer);
  }

  render() {
    const {
      renderContentWidth,
      screenType
    } = this.props;
    const { theme } = this.context;
    const { showToast } = this.state;
    const isPhoneScreen = screenType === "phone";
    const FLIP_HEIGHT = isPhoneScreen ? 240 : 500;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      styles,
      className: "Home"
    });

    return (
      <div style={{ width: "100%" }}>
        <div {...classes.flipViewWrp}>
          <FlipView
            style={{
              height: FLIP_HEIGHT,
              margin: "0 auto",
              width: renderContentWidth,
              background: "none"
            }}
          >
            <FlipViewItem
              screenType={screenType}
              title="Reveal"
              description="A new lighting effect brings focus to interactive elements."
              linkInfo="ENHANCE APP WITH REVEAL"
              link={`${docVersion}/styles`}
              image={require("../../assets/images/reveal.png")}
            />
            <FlipViewItem
              screenType={screenType}
              title="Acrylic material"
              description="Our first material brings depth to your designs. "
              linkInfo="ADD ACRYLIC TO YOUR APP"
              link={`${docVersion}/styles/acrylic`}
              image={require("../../assets/images/acrylic.png")}
            />
            <FlipViewItem
              screenType={screenType}
              title="Design Toolkits"
              description="Templates and tools for designing UWP apps."
              linkInfo="GET THE TOOLKITS"
              link={`${docVersion}/resources`}
              image={require("../../assets/images/toolkits.png")}
            />
          </FlipView>
          <RevealEffect
            effectEnable="border"
            hoverSize={300}
          />
        </div>
        <Categories
          renderContentWidth={renderContentWidth}
          style={{
            height: "auto",
            padding: "40px 0",
            width: "100%",
            background: theme.altMedium
          }}
        />
        <Banner renderContentWidth={renderContentWidth} />
        <CustomTheme
          renderContentWidth={renderContentWidth}
          screenType={screenType}
          style={{ padding: "140px 0", ...theme.acrylicTexture40.style }}
        />
        <div style={{ padding: "120px 0", ...theme.acrylicTexture80.style }}>
          <MediaPlayer
            displayMode={isPhoneScreen ? "minimum" : "default"}
            style={{ margin: "0 auto", width: isPhoneScreen ? window.innerWidth : renderContentWidth, display: "block" }}
            url="https://www.youtube.com/watch?v=vcBGj4R7Fo0"
            width={isPhoneScreen ? (window.innerWidth - 40) : (renderContentWidth as any - 40)}
            height={((isPhoneScreen ? window.innerWidth : renderContentWidth) as any) / 2}
          />
        </div>

        <Toast
          defaultShow={showToast}
          logoNode={<Image style={{ clipPath: "circle(16px at 16px 16px)" }} src={require("assets/images/icon-32x32.png")} />}
          title="Welcome to React-UWP"
          closeDelay={5000}
          description={["Thank you for supporting this project."]}
          showCloseIcon
        />
      </div>
    );
  }
}

function getStyles(Home: Home) {
  const {
    context: { theme },
    props: { style, screenType }
  } = Home;

  const { prefixStyle } = theme;
  const isPhoneScreen = screenType === "phone";
  const FLIP_HEIGHT = isPhoneScreen ? 240 : 500;

  return {
    root: prefixStyle({
      ...style
    }),
    flipViewWrp: prefixStyle({
      width: "100%",
      height: FLIP_HEIGHT,
      position: "relative",
      borderBottom: `1px solid ${theme.listLow}`,
      ...theme.acrylicTexture60.style
    })
  };
}
