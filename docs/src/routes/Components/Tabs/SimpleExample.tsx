import * as React from "react";
import * as PropTypes from "prop-types";

import Tabs, { Tab } from "react-uwp/Tabs";
import Icon from "react-uwp/Icon";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    const baseStyle: React.CSSProperties = {
      display: "block",
      margin: "10px 0",
      height: 400
    };
    const tabStyle: React.CSSProperties = {
      background: theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeLow
    };
    return (
      <div>
        <Tabs style={baseStyle}>
          <Tab>
            Tab1
          </Tab>

          <Tab>
            Tab2
          </Tab>

          <Tab>
            Tab3
          </Tab>

          <Tab title="Custom TabTile">
            Custom TabTile
          </Tab>
        </Tabs>

        <Tabs
          tabStyle={tabStyle}
          style={baseStyle}
          tabTitleStyle={{ marginRight: 40 }}
          renderTitle={title => (
            <span>
              <Icon>
                {title}
              </Icon>
              <span style={{ marginLeft: 12 }}>{title}</span>
            </span>
          )}
        >
          <Tab title="People">
            People
          </Tab>

          <Tab title="NUIFace">
            NUIFace
          </Tab>

          <Tab title="Game">
            Game
          </Tab>

          <Tab title="Color">
            Color
          </Tab>
        </Tabs>
      </div>
    );
  }
}
