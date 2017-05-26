import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

import MarkdownRender from "../../../components/MarkdownRender";
import ComponentDetail from "../../../components/ComponentDetail";
import ComponentDescription from "./components/ComponentDescription";

import CommandBar from "react-uwp/CommandBar";
import Button from "react-uwp/Button";
import AppBarButton from "react-uwp/AppBarButton";
import Switch from "react-uwp/Switch";
import CheckBox from "react-uwp/CheckBox";
import Radius from "react-uwp/Radius";
import HyperLink from "react-uwp/HyperLink";
import Link from "react-uwp/Link";
import CalendarView from "react-uwp/CalendarView";

export default class IndexOfComponentsByFunction extends React.Component<any, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

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
    const buttonsStyle: React.CSSProperties ={
      margin: "0 10px"
    };

    return (
      <div {...attributes}>
        <MarkdownRender
          text={
`# Components
---
The UI framework for Windows provides an extensive library of controls that support UI development. Some of these controls have a visual representation; others function as the containers for other controls or content, such as images and media.
Here's a list by function of the common controls you can use in your app.`
          }
        />

        <MarkdownRender text="## Commands" />
        <ComponentDescription
          description={
`### CommandBar
A specialized app bar that handles the resizing of app bar button elements.`
          }
          direction="column"
          themeStyle={{ height: 140 }}
          isChromeMode
        >
          <CommandBar
            primaryCommands={[
              <AppBarButton icon={"\uE72D"} label="Share" />,
              <AppBarButton icon="Edit" label="Edit" />,
              <AppBarButton icon="Delete" label="Delete" />,
              <AppBarButton icon="Save" label="Save" />
            ]}
          />
        </ComponentDescription>

        <MarkdownRender text="## Buttons" />
        <ComponentDescription
          description={
`### Button
A control that responds to user input and raises a **Click** event.`
          }
        >
          <Button>Button</Button>
        </ComponentDescription>

        <ComponentDescription
          description={
`### Hyperlink
A UWP Design Link.`
          }
        >
          <CheckBox style={buttonsStyle} label="CheckBox Button" />
          <Radius label="Radius Button" />
          <Switch style={buttonsStyle} />
        </ComponentDescription>
        <CalendarView />
      </div>
    );
  }
}
