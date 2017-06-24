## The Accent Color palette is fork from Google Material Design.

see the spec [Color palette](https://material.io/guidelines/style/color.html#color-color-tool).

usage:
```jsx
import Theme from "react-uwp/Theme";
import getTheme from "react-uwp/styles/getTheme";
import * as accentColors from "react-uwp/styles/accentColors";
import { red500 } from "react-uwp/styles/accentColors";

accentColors.red500 === "#f44336" /// true

export default class ThemeWrapper extends React.Component<void> {
  render() {
    return (
      <Theme theme={getTheme("Dark", accentColors.red500)}>
        <YourComponent />
      </Theme>
    )
  }
}

```
