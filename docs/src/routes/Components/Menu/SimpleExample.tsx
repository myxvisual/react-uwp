import * as React from "react";
import * as PropTypes from "prop-types";

import Menu, { MenuItem } from "react-uwp/Menu";

const baseStyle: React.CSSProperties = {
  margin: "10px 0"
};
export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={baseStyle}>
        <Menu>
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
        <MenuItem label="Rename" />
        <MenuItem label="Select" />
        <MenuItem label="Child Menu">
          <MenuItem label="Rename" />
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
