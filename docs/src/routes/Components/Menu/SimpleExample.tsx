import * as React from "react";
import * as PropTypes from "prop-types";

import Menu, { MenuItem } from "react-uwp/Menu";
import Separator from "react-uwp/Separator";

const baseStyle: React.CSSProperties = {
  margin: "10px 0",
  display: "inline-block",
  verticalAlign: "middle"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={baseStyle}>
        <Menu menuItemHeight={36} expandedMethod="hover">
        <MenuItem
          icon="Share"
          label="Share"
        />
        <MenuItem
          icon="Copy"
          label="Copy"
        />
        <MenuItem
          icon="Delete"
          label="Delete"
        />
        <Separator />
        <MenuItem label="Rename" />
        <MenuItem label="Select" />
        <MenuItem label="Child Menu">
          <MenuItem label="Rename">
            <MenuItem
              label="Test"
            />
          </MenuItem>
          <MenuItem
            icon="Delete"
            label="Delete"
          />
        </MenuItem>
        </Menu>
      </div>
    );
  }
}
