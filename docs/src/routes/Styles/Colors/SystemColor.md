## This a System Color palette.

You can get `theme` in your Component. example code:

```jsx
import * as React from "react";
import * as PropTypes from "prop-types";

export default class ThemeChild extends React.Component<void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        {this.context.theme.accent}
      </div>
    )
  }
}
```
