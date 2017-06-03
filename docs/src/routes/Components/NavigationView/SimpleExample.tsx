import * as React from "react";
import * as PropTypes from "prop-types";

import NavigationView from "react-uwp/NavigationView";
import Content from "./components/Content";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const baseStyle: React.CSSProperties = {
      margin: 20
    };
    return (
      <div>

        <NavigationView
          style={baseStyle}
          pageTitle="San Francisco"
          displayMode="overlay"
          autoResize={false}
        >
          <Content />
        </NavigationView>

        <NavigationView
          style={baseStyle}
          pageTitle="San Francisco"
          displayMode="compact"
          autoResize={false}
        >
          <Content />
        </NavigationView>

        <NavigationView
          style={baseStyle}
          pageTitle="San Francisco"
          displayMode="inline"
          autoResize={false}
        >
          <Content />
        </NavigationView>

      </div>
    );
  }
}
