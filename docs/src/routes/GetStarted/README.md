## Installation
---
React-UWP is available as an [npm package](https://www.npmjs.org/package/react-uwp).

Use NPM to get Fabric components and core styling. All you need is node.js and gulp.

``` bash
npm install --save react-uwp
```

## Usage
---
React-UWP components require a theme to be provided.
The quickest way to get up and running is by using the `Theme` to inject the theme into your application context.then, you can use any of the components as demonstrated in documentation.


**./App.js**
```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import Theme as UWPThemeProvider from "react-uwp/Theme";
import MyComponent from "./MyComponent";

class App extends React.Component<void, void> {
  render() {
    return (
      <UWPThemeProvider>
        <MyComponent />
      </UWPThemeProvider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
```

**./MyComponent.js**
```jsx
import * as React from "react";
import Button from "material-ui/Button";

export default class MyComponent extends React.Component<void, void> {
  render() {
    return (
      <Button tooltip="Mini Tooltip" />
    )
  }
}
```
`Notice:` that in the above example, we used:
```jsx
import Button from "react-uwp/Button";
```

instead of
```jsx
import { Button } from "react-uwp";
```

This will make your build process faster and your build output smaller.

For a complete mapping of React-UWP components to `import`,
see [`/src/index.ts`](https://github.com/myxvisual/react-uwp/blob/master/src/index.ts) inside the Material-UI npm package root directory.

### Custom Theme

We have implemented a default theme to render all React-UWP components.
Styling components to your liking is simple and hassle-free.
This can be achieved in the following two ways:
- [With the theme](/styles/styling-components/custom-theme), you can use a custom theme to style components.
- [With the inline style](/styles/styling-components/use-inlinestyle-replace-the-default-style), you can override individual
component styles via the style property.
