## Server Rendering
### Autoprefixer
React-UWP has to use the same user agent for the auto prefixer.
On the client side, the default value is `navigator.userAgent`.
But on the server side, the `navigator` is `undefined`. You need to provide it to React-UWP.

The `userAgent` can take one of the following values:
- a regular user agent like
`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36`
- `'all'` to prefix for all user agents
- `false` to disable the prefixer

We rely on the [Theme](/components/theme) context to spread the user agent to all of our component.
For instance, you can provide it like this:

``` jsx
import * as React from "react";

import { Theme as UWPThemeProvider, getTheme } from "react-uwp/Theme";
import Button from "react-uwp/Button";

const theme = getTheme({
  themeName: "dark",
  accent: "#0078D7",
  useFluentDesign: true,
  desktopBackgroundImage: "http://127.0.0.1:8092/static/images/jennifer-bailey-10753.jpg"
  userAgent: req.headers['user-agent']
});

export class App extends React.Component {
  render() {
    return (
      <UWPThemeProvider
        theme={theme}
        needGenerateAcrylic={false} // if using SSR, set this config to false, using fallback color.
      >
        <Button>Server Side Rendering...</Button>
      </UWPThemeProvider>
    )
  }
}

export default App;
```

### [Example Codes](https://github.com/myxvisual/react-uwp-ssr-example)
