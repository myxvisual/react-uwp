import * as React from "react";
import * as PropTypes from "prop-types";

import DropDownMenu from "react-uwp/DropDownMenu";
import { Theme } from "react-uwp";

export default class CustomStyle extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div style={{ width: "100%" }}>

        <DropDownMenu
          wrapperStyle={{ margin: 20 }}
          style={{
            border: `1px solid ${theme.accent}`,
            background: "#fff",
            color: "#333",
            borderRadius: 4
          }}
          itemHoverStyle={{ background: theme.listAccentLow }}
          itemSelectedStyle={{ background: theme.listAccentMedium }}
          values={["A", "B"]}
          revealConfig={{ effectEnable: "disabled" }}
        />
      </div>
    );
  }
}
