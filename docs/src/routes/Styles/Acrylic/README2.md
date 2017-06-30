### How to Generate Acrylic Textures ?

``` jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { UWPThemeProvider, getTheme } from "react-uwp/Theme";
import MyComponent from "./MyComponent";

class App extends React.Component<void> {
  render() {
    return (
      <UWPThemeProvider
        theme={getTheme({
          themeName: "dark", // set custom theme
          accent: "#0078D7", // set accent color
          useFluentDesign: true, // sure you want use new fluent design.
          desktopBackgroundImage: "http://127.0.0.1:8092/staticimages/jennifer-bailey-10753.jpg" // set global desktop background image
        })}
      >
        <MyComponent />
      </UWPThemeProvider>
    )
  }
}

```
then, you can use acrylic texture background from context theme.

``` jsx
import * as React from "react";
import * as PropTypes from "prop-types";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div>
        <AutoSuggestBox background={theme.acrylicTexture60.background} />
      </div>
    );
  }
}

```
