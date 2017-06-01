import * as React from "react";
import * as PropTypes from "prop-types";

import Flyout from "react-uwp/Flyout";
import FlyoutContent from "react-uwp/FlyoutContent";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <Flyout>
        <p>Your Content Component</p>

        <FlyoutContent
          show={false}
          style={{ height: 80 }}
        >
          Your Top FlyoutContent
        </FlyoutContent>
        <FlyoutContent
          show={false}
          verticalPosition="bottom"
          style={{ height: 80 }}
          enterDelay={850}
        >
          Your Bottom FlyoutContent with delay 850ms
        </FlyoutContent>

      </Flyout>
    );
  }
}
