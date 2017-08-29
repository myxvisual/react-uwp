import * as React from "react";
import * as PropTypes from "prop-types";

import TransformCard from "react-uwp/TransformCard";
import CalendarDatePicker from "react-uwp/CalendarDatePicker";
import Button from "react-uwp/Button";

import Slider from "../Slider/SimpleExample";
import SplitViewCommand from "../SplitViewCommand/SimpleExample";
import TextBox from "../TextBox/SimpleExample";
import Toggle from "../Toggle/SimpleExample";
import Tooltip from "../Tooltip/SimpleExample";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div>
        <TransformCard defaultRotateY={-7} perspective={1000}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "auto",
              minHeight: 520,
              padding: "40px 20px",
              background: theme.listLow
            }}
          >
            <Slider />
            <CalendarDatePicker />
            <SplitViewCommand />
            <TextBox />
            <Toggle />
            <Tooltip />
          </div>
        </TransformCard>

        <div>
          <TransformCard xMaxRotate={30} yMaxRotate={30} perspective={240}>
            <img
              style={{
                width: 240,
                marginTop: 40,
                height: "auto"
              }}
              src={require("../../../assets/images/reveal.png")}
            />
          </TransformCard>
        </div>
      </div>
    );
  }
}
