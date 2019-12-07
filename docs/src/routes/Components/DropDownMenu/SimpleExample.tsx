import * as React from "react";
import * as PropTypes from "prop-types";

import DropDownMenu from "react-uwp/DropDownMenu";

const wrapperStyle: React.CSSProperties = {
  margin: 10
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={{ width: "100%" }}>
        <DropDownMenu
          wrapperStyle={wrapperStyle}
          values={["1", "2"]}
          defaultValue="2"
        />

        <DropDownMenu
          values={["A", "B", "C"]}
          wrapperStyle={wrapperStyle}
          style={{ width: 400, height: 40 }}
        />

        <DropDownMenu
          wrapperStyle={{ margin: "10px 0" }}
          enableFullWidth
          values={["--- Full Width ---", "A", "a"]}
        />
      </div>
    );
  }
}
