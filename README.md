![img](https://github.com/myxvisual/react-uwp/blob/master/docs/public/static/images/icons/icon-144x144.png)

# [react-uwp](https://www.react-uwp.com/)

[![cdnjs](https://img.shields.io/cdnjs/v/react-uwp.svg?style=flat-square)](https://cdnjs.com/libraries/react-uwp)
[![npm package](https://img.shields.io/npm/v/react-uwp.svg?style=flat-square)](https://www.npmjs.org/package/react-uwp)
[![Build Status](https://travis-ci.org/myxvisual/react-uwp.svg?branch=master)](https://travis-ci.org/myxvisual/react-uwp)

[![PeerDependencies](https://img.shields.io/david/peer/myxvisual/react-uwp.svg?style=flat-square)](https://david-dm.org/myxvisual/react-uwp#info=peerDependencies&view=list)
[![Dependencies](https://img.shields.io/david/myxvisual/react-uwp.svg?style=flat-square)](https://david-dm.org/myxvisual/react-uwp)
[![DevDependencies](https://img.shields.io/david/dev/myxvisual/react-uwp.svg?style=flat-square)](https://david-dm.org/myxvisual/react-uwp#info=devDependencies&view=list)

[React](https://facebook.github.io/react/) Components that Implement [Microsoft's UWP Design](https://developer.microsoft.com/en-us/windows/apps/design) & [Fluent Design System](http://fluent.microsoft.com/).

# [Online Documentation](https://www.react-uwp.com/)
![img](https://github.com/myxvisual/react-uwp/blob/master/images/doc-site.JPG)
Visit [react-uwp.com](https://www.react-uwp.com/) online to review the API, see the components in action with live.
Or build the documentation to locally.

## Installation
React-UWP is available as an [npm package](https://www.npmjs.org/package/react-uwp).

Use NPM to get React-UWP components and core styling. All you need is node.js and gulp.

``` bash
npm install --save react-uwp
```

## Usage
React-UWP components require a theme to be provided.
The quickest way to get up and running is by using the `Theme` to inject the theme into your application context.then, you can use any of the components as demonstrated in documentation.

> If you coding by Typescript, add `ReactUWP` namespace to `tsconfig.json`.

``` js
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types"
    ],
    "filesGlob": [
      "**/*.ts",
      "**/*.tsx"
    ],
    "files": [
      "node_modules/react-uwp/index.d.ts" // add to here.
    ]
  }
}
```


**./App.js**
```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Theme as UWPThemeProvider, getTheme } from "react-uwp/Theme";
import MyComponent from "./MyComponent";

export class App extends React.Component {
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

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
```

**./MyComponent.js**
```jsx
import * as React from "react";
import Button from "react-uwp/Button";

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
see [`/src/index.ts`](https://github.com/myxvisual/react-uwp/blob/master/src/index.ts) inside the React-UWP npm package root directory.

### Custom Theme

We have implemented a default theme to render all React-UWP components.
Styling components to your liking is simple and hassle-free.
This can be achieved in the following two ways:
- [With the theme](https://www.react-uwp.com/Styles/Custom-Theme), you can use a custom theme to style components.
- [With the inline style](https://www.react-uwp.com/Styles/Styling-Components), you can override individual
component styles via the style property.
# Four Theme Style (Fluent Design & UWP Design)
![img](https://github.com/myxvisual/react-uwp/blob/master/images/four-theme-style.JPG)
