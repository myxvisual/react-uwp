### How to use Typography style? [Source typographyStyles](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L122)

``` jsx
import * as React from "react";
import * as PropTypes from "prop-types";

export default class SimpleExample extends React.Component {
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
