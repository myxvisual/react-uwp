import * as React from "react";
import * as PropTypes from "prop-types";

import NavigationView from "react-uwp/NavigationView";
import SplitViewCommand from "react-uwp/SplitViewCommand";
import Content from "./components/Content";

export default class SimpleExample extends React.Component<React.HTMLAttributes<HTMLDivElement>, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const baseStyle: React.CSSProperties = {
      margin: 10
    };
    const navigationTopNodes = [
      <SplitViewCommand icon={"\uE716"} />,
      <SplitViewCommand label="Print" icon={"\uE2F6"} />
    ];

    const navigationBottomNode = [
      <SplitViewCommand label="Settings" icon={"\uE713"} />,
      <SplitViewCommand label="CalendarDay" icon={"\uE161"} />
    ];

    const { theme } = this.context;

    return (
      <div style={theme.prepareStyles({ background: theme.chromeLow, ...this.props.style })}>

        <NavigationView
          style={baseStyle}
          pageTitle="San Francisco"
          displayMode="overlay"
          autoResize={false}
          background="none"
          initWidth={0}
          navigationTopNodes={navigationTopNodes}
          navigationBottomNodes={navigationBottomNode}
        >
          <Content />
        </NavigationView>

        <NavigationView
          style={{ height: 688, ...baseStyle }}
          pageTitle="San Francisco"
          displayMode="minimal"
          autoResize={false}
          navigationTopNodes={navigationTopNodes}
          navigationBottomNodes={navigationBottomNode}
        >
          <Content />
        </NavigationView>

        <div>
          <NavigationView
            style={{ height: 640, ...baseStyle }}
            pageTitle="San Francisco"
            displayMode="compact"
            autoResize={false}
            defaultExpanded
            navigationTopNodes={navigationTopNodes}
            navigationBottomNodes={navigationBottomNode}
          >
            <Content />
          </NavigationView>
        </div>

      </div>
    );
  }
}
