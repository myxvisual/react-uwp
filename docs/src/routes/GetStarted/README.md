## Installation
React-UWP is available as an [npm package](https://www.npmjs.org/package/react-uwp).

Use `NPM` to get `React-UWP` components and core styling. All you need is `node.js`.

``` bash
npm install --save react-uwp
```

## Usage
React-UWP components require a theme to be provided.
The quickest way to get up and running is by using the `Theme` to inject the theme into your application context. then, you can use any of the components as demonstrated in documentation.

> If you coding by TypeScript, suggest
 add `ReactUWP` namespace to `tsconfig.json`.

``` js
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/react-uwp" // add to here.
    ],
    // ....
    "include": [
      "./node_modules/react-uwp/index.d.ts" // or add to here.
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
          themeName: "dark", // set custom theme mode
          accent: "#0078D7", // set accent color
          useFluentDesign: true, // sure you want use new Fluent Design
          desktopBackgroundImage: "http://127.0.0.1:8092/static/images/jennifer-bailey-10753.jpg" // set global desktop background image
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

export default class MyComponent extends React.Component<void> {
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
- [With the theme](/styles/styling-components/custom-theme), you can use a custom theme to style components.
- [With the inline style](/styles/styling-components/use-inlinestyle-replace-the-default-style), you can override individual
component styles via the style property.

# Need a component?
Please check the [React-UWP Trello](https://trello.com/b/lrDKBog2/react-uwp-requests) and vote up the request, or see the [ROADMAP.md](https://github.com/myxvisual/react-uwp/blob/master/ROADMAP.md).

If you don’t see an existing card, please file an [issue](https://github.com/myxvisual/react-uwp/issues) in the repository.
