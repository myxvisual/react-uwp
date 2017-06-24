import * as React from "react";
import * as PropTypes from "prop-types";

import CalendarDatePicker from "react-uwp/CalendarDatePicker";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return <CalendarDatePicker />;
  }
}
