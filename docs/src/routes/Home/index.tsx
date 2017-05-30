import * as React from "react";
import * as ReactRouter from "react-router";
import * as PropTypes from "prop-types";

import FlipView, { FlipViewProps } from "react-uwp/FlipView";
import { WrapperState } from "components/Wrapper";
import FlipViewItem from "./components/FlipViewItem";
import Categories from "./components/Categories";
import Banner from "./components/Banner";
import CustomTheme from "./components/CustomTheme";
import IndexOfComponentsByFunction from "../Components/IndexOfComponentsByFunction";

export interface DataProps extends WrapperState {}
export interface HomeProps extends DataProps, ReactRouter.RouteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
export interface HomeState {}

export default class Home extends React.Component<HomeProps, HomeState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: HomeState = {
    showFocus: true
  };

  render() {
    const {
      renderContentWidth,
      screenType
    } = this.props;
    const { theme } = this.context;
    const FLIP_HEIGHT = screenType === "phone" ? 240 : 500;

    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", background: theme.listLow }}>
          <FlipView
            style={{
              height: FLIP_HEIGHT,
              background: "none",
              margin: "0 auto",
              width: renderContentWidth
            }}
          >
            <FlipViewItem
              screenType={screenType}
              title="Reveal"
              description="A new lighting effect brings focus to interactive elements."
              linkInfo="ENHANCE APP WITH REVEAL"
              link="/styles"
              image={require("../../assets/images/reveal.png")}
            />
            <FlipViewItem
              screenType={screenType}
              title="Acrylic material"
              description="Our first material brings depth to your designs. "
              linkInfo="ADD ACRYLIC TO YOUR APP"
              link="/components"
              image={require("../../assets/images/acrylic.png")}
            />
            <FlipViewItem
              screenType={screenType}
              title="Design Toolkits"
              description="Templates and tools for designing UWP apps."
              linkInfo="GET THE TOOLKITS"
              link="/resources"
              image={require("../../assets/images/toolkits.png")}
            />
          </FlipView>
        </div>
        <Categories
          style={{
            height: "auto",
            padding: "20px 0",
            margin: "0 auto",
            width: renderContentWidth
          }}
        />
        <Banner renderContentWidth={renderContentWidth} />
        <CustomTheme renderContentWidth={renderContentWidth} />
        <IndexOfComponentsByFunction
          style={{
            padding: 20,
            margin: "0 auto",
            width: renderContentWidth
          }}
        />
      </div>
    );
  }
}
