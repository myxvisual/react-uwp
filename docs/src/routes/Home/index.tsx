import * as React from "react";
import * as ReactRouter from "react-router";
import * as PropTypes from "prop-types";

import FlipView, { FlipViewProps } from "react-uwp/FlipView";
import ThemeType from "react-uwp/styles/ThemeType";
import FlipViewItem from "./components/FlipViewItem";
import { WrapperState } from "../../components/Wrapper";

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
      <div style={theme.prepareStyles({ width: "100%", background: theme.altMediumHigh })}>
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
    );
  }
}
