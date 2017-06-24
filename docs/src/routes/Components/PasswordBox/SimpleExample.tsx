import * as React from "react";
import * as PropTypes from "prop-types";

import PasswordBox from "react-uwp/PasswordBox";

const baseStyle: React.CSSProperties = {
  margin: "10px 10px 10px 0"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <PasswordBox defaultValue="The Secret Password..." style={baseStyle} />

        <PasswordBox
          style={{ width: 340, ...baseStyle }}
          placeholder="Input Your Password"
          passwordBoxHeight={28}
        />

        <PasswordBox
          style={baseStyle}
          defaultShowPassword
          defaultValue="This My Password"
        />
      </div>
    );
  }
}
