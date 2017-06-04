import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import ComponentDescription from "./components/ComponentDescription";

import AppBarSeparator from "react-uwp/AppBarSeparator";
import CommandBar from "react-uwp/CommandBar";
import Button from "react-uwp/Button";
import AppBarButton from "react-uwp/AppBarButton";
import Toggle from "react-uwp/Toggle";
import CheckBox from "react-uwp/CheckBox";
import RadioButton from "react-uwp/RadioButton";
import HyperLink from "react-uwp/HyperLink";
import CalendarView from "react-uwp/CalendarView";
import Slider from "react-uwp/Slider";

export default class IndexOfComponentsByFunction extends React.Component<any, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      location, // tslint:disable-line:no-unused-variable
      params, // tslint:disable-line:no-unused-variable
      route, // tslint:disable-line:no-unused-variable
      router, // tslint:disable-line:no-unused-variable
      routeParams, // tslint:disable-line:no-unused-variable
      routes, // tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;
    const baseStyle: React.CSSProperties = {
      margin: 10
    };

    return (
      <div {...attributes}>
        <MarkdownRender
          text={
`# Components
---
The UI framework for Windows provides an extensive library of controls that support UI development. Some of these controls have a visual representation; others function as the containers for other controls or content, such as images and media.`
          }
        />
        <ComponentDescription isChromeMode themeStyle={{ padding: 40 }}>
          <CommandBar
            primaryCommands={[
              <AppBarButton icon={"\uE72D"} label="Share" />,
              <AppBarButton icon="Edit" label="Edit" />,
              <AppBarButton icon="Delete" label="Delete" />,
              <AppBarButton icon="Save" label="Save" />
            ]}
            secondaryCommands={[
              <p>Open with</p>,
              <p>Print</p>,
              <p>Set as</p>,
              <p>View actual size</p>,
              <AppBarSeparator />,
              <p>File info</p>,
              <AppBarSeparator />,
              <p>Send feedback</p>
            ]}
          />
        </ComponentDescription>

        <ComponentDescription direction="row" themeStyle={{ padding: 0 }}>
          <div style={this.context.theme.prepareStyles({ width: "100%", padding: 20, display: "flex", flexDirection: "column" })}>
            <div>
              <Button style={baseStyle}>Button</Button>
              <CheckBox style={baseStyle} label="CheckBox Button" />
              <RadioButton style={baseStyle} label="RadioButton" />
              <Toggle style={baseStyle} />
              <HyperLink style={baseStyle}>HyperLink</HyperLink>
              <Slider />
            </div>
            <div>
              <CalendarView style={baseStyle} />
            </div>
          </div>
        </ComponentDescription>
      </div>
    );
  }
}
