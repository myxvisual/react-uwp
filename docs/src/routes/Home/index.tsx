import * as React from "react";
import * as ReactRouter from "react-router";
import * as PropTypes from "prop-types";

import FlipView, { FlipViewProps } from "react-uwp/FlipView";
import ThemeType from "react-uwp/styles/ThemeType";
import { WrapperState } from "../../components/Wrapper";
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

const FLIP_HEIGHT = 500;
export default class Home extends React.Component<HomeProps, HomeState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  state: HomeState = {
    showFocus: true
  };

  render() {
    const {
      renderContentWidth,
      screenType
    } = this.props;
    const { theme } = this.context;

    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", background: theme.altMediumHigh }}>
          <FlipView
            style={{
              height: FLIP_HEIGHT,
              background: "none",
              margin: "0 auto",
              width: renderContentWidth
            }}
          >
            <FlipViewItem
              title="Reveal"
              description="A new lighting effect brings focus to interactive elements."
              linkInfo="ENHANCE YOUR APP WITH REVEAL"
              link="/reveal"
              image={require("../../assets/images/reveal.png")}
            />
            <FlipViewItem
              title="Acrylic material"
              description="Our first material brings depth to your designs. "
              linkInfo="ADD ACRYLIC TO YOUR APP"
              link="/components"
              image={require("../../assets/images/acrylic.png")}
            />
            <FlipViewItem
              title="Design Toolkits"
              description="Templates and tools for designing UWP apps."
              linkInfo="GET THE TOOLKITS"
              link="/toolkits"
              image={require("../../assets/images/toolkits.png")}
            />
          </FlipView>
        </div>
        <Categories
          style={{
            height: "auto",
            padding: "64px 0",
            margin: "0 auto",
            width: renderContentWidth
          }}
        />
        <Banner renderContentWidth={renderContentWidth} />
        <CustomTheme renderContentWidth={renderContentWidth} />
        <IndexOfComponentsByFunction
          style={{
            margin: "0 auto",
            width: renderContentWidth
          }}
        />
      </div>
    );
  }
}
