import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "../../../components/MarkdownRender";
import ComponentDetail from "../../../components/ComponentDetail";
import ComponentDescription from "./components/ComponentDescription";

import {
  CommandBar,
  AppBarButton,
  Button,
  CheckBox,
  Radius,
  HyperLink
} from "react-uwp";

export default class IndexOfComponentsByFunction extends React.Component<any, void> {
  static contextTypes = { theme: PropTypes.object };

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

    return (
      <div {...attributes}>
        <MarkdownRender
          text={
`# Controls by function
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
          <HyperLink>HyperLink</HyperLink>
          <CheckBox />
          <Radius />
        </ComponentDescription>
      </div>
    );
  }
}
