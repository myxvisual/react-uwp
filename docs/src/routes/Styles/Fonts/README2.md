# How Use Fonts in React-UWP
---

In current version, we only export two group fonts, [theme.fonts.sansSerifFonts](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L58) and [theme.fonts.segoeMDL2Assets](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L59), example code:

``` jsx
import * as React from "react";
import * as PropTypes from "prop-types";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <h5 style={{ fontFamily: theme.fonts.sansSerifFonts }}>
        The Title
      </h5>
    );
  }
}

```
