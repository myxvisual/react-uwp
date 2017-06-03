import * as React from "react";
import * as PropTypes from "prop-types";

import RadioButton from "react-uwp/RadioButton";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return <RadioButton />;
  }
}
