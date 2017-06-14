### How to use Typography style?

``` jsx
import * as React from "react";
import * as PropTypes from "prop-types";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <h5 style={theme.typographyStyles.header}>
        The Title
      </h5>
    );
  }
}

```
