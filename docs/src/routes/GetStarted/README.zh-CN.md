## 安装
React-UWP 现在是发布了，以便于使用 [npm 包](https://www.npmjs.org/package/react-uwp)。

使用 `NPM` 来获取 `React-UWP` 的所有组件和关键样式。你只需要的就是安装好了 `node.js`。

``` bash
npm install --save react-uwp
```

## 使用
React-UWP 的组件需要提供一个主题给它。
最快方法是使用 `Theme` 组件将主题注入到难打应用程序上下文中。然后，你就可以使用任何在文档示例中的组件了.
> 如果你是用 TypeScript 写代码, 建议添加 `ReactUWP` 命名空间到 `tsconfig.json`。

``` js
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/react-uwp" // 舔加在这里
    ],
    // ....
    "include": [
      "./node_modules/react-uwp/index.d.ts" // 或者舔加在这里
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
          themeName: "dark", // 设置主题模式
          accent: "#0078D7", // 设置主要颜色
          useFluentDesign: true, // 确定你是否要使用新的 Fluent Design
          desktopBackgroundImage: "http://127.0.0.1:8092/static/images/jennifer-bailey-10753.jpg" // 设置全局桌面背景图片
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
`提示:` 在上面的代码中，我们是这样引用组件的:
```jsx
import Button from "react-uwp/Button";
```

替代于
```jsx
import { Button } from "react-uwp";
```

这样会让你的编译过程更加快和编译的体积更小。

完整查阅所有组件 `import`，可以查看[`/src/index.ts`](https://github.com/myxvisual/react-uwp/blob/master/src/index.ts) 位于 React-UWP npm 包根目录下。

### 自定义主题

我们已经实现了一个默认主题来渲染所有的 React-UWP 组件。
可以根据您的喜好来设计组件，是简单而且轻松的。
可以通过以下两种方式实现：
- [使用主题](/styles/styling-components/custom-theme)，您可以使用自定义主题来对组件进行样式化。
- [使用内联样式](/styles/styling-components/use-inlinestyle-replace-the-default-style)，你可以覆盖组件样式通过 style 属性。

# 需要提供新的组件？
请检查 [React-UWP Trello](https://trello.com/b/lrDKBog2/react-uwp-requests) 并投票支持请求，或查看 [ROADMAP.md](https://github.com/myxvisual/react-uwp/blob/master/ROADMAP.md)。

如果您没有看到现有的请求卡片，请在仓库中提交 [issue](https://github.com/myxvisual/react-uwp/issues)。
