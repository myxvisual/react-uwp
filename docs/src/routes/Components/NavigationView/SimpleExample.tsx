import * as React from "react";
import * as PropTypes from "prop-types";

import NavigationView from "react-uwp/NavigationView";
import SplitViewCommand from "react-uwp/SplitViewCommand";
import Content from "./components/Content";

export default class SimpleExample extends React.Component<React.HTMLAttributes<HTMLDivElement>> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const baseStyle: React.CSSProperties = {
      margin: 10
    };
    const navigationTopNodes = [
      <SplitViewCommand icon={"\uE716"} />,
      <SplitViewCommand label="Print" icon="PrintLegacy" />
    ];

    const navigationBottomNode = [
      <SplitViewCommand label="Settings" icon={"\uE713"} />,
      <SplitViewCommand label="CalendarDay" icon={"\uE161"} />
    ];

    const { theme } = this.context;

    return (
      <div>

        <NavigationView
          style={baseStyle}
          pageTitle="San Francisco"
          displayMode="overlay"
          autoResize={false}
          background={theme.listLow}
          initWidth={48}
          navigationTopNodes={navigationTopNodes}
          navigationBottomNodes={navigationBottomNode}
          focusNavigationNodeIndex={3}
        >
          <Content />
        </NavigationView>

        <NavigationView
          style={{ ...baseStyle }}
          pageTitle="San Francisco"
          displayMode="minimal"
          autoResize={false}
          navigationTopNodes={navigationTopNodes}
          navigationBottomNodes={navigationBottomNode}
          focusNavigationNodeIndex={1}
        >
          <Content />
        </NavigationView>

        <div>
          <NavigationView
            isControlled
            style={{ width: 640, height: 640, ...baseStyle }}
            pageTitle="San Francisco"
            displayMode="compact"
            autoResize={false}
            defaultExpanded
            navigationTopNodes={navigationTopNodes}
            navigationBottomNodes={navigationBottomNode}
            focusNavigationNodeIndex={2}
          >
            <img src={require("./components/images/golden-gate-bridge-2037990_1280.jpg")} height="100%" style={{ objectFit: "cover" }} />
          </NavigationView>
        </div>

      </div>
    );
  }
}
