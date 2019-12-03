import * as React from "react";
import * as PropTypes from "prop-types";

import DropDownMenu from "react-uwp/DropDownMenu";

const baseStyle: React.CSSProperties = {
  margin: "10px 20px 10px 0"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <DropDownMenu
          style={baseStyle}
          values={["1", "2"]}
        />

        <DropDownMenu
          style={baseStyle}
          values={["1", "2"]}
          defaultValue="2"
        />

        <DropDownMenu
          values={["A", "B", "C"]}
          style={{ ...baseStyle, width: 320 }}
        />

        <DropDownMenu
          style={{
            ...baseStyle,
            width: "100%",
            lineHeight: "40px",
            display: "block",
            height: 40
          }}
          values={["--- Full Width ---", "A", "a"]}
        />
      </div>
    );
  }
}
