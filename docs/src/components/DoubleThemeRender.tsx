import * as React from "react";
import * as PropTypes from "prop-types";

import Theme from "react-uwp/Theme";
import getTheme from "react-uwp/styles/getTheme";

export interface DoubleThemeRenderProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  themeStyle?: React.CSSProperties;
  useBorder?: boolean;
  useChromeColor?: boolean;
  useSingleTheme?: boolean;
  newTheme?: ReactUWP.ThemeType;
}

export default class DoubleThemeRender extends React.Component<DoubleThemeRenderProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { children, direction, themeStyle, useBorder, useChromeColor, useSingleTheme, newTheme, ...attributes } = this.props;
    const darkTheme = getTheme({ themeName: "dark", accent: this.context.theme.accent });
    const { prefixStyle } = darkTheme;
    const lightTheme = getTheme({ themeName: "light", accent: this.context.theme.accent });
    const isColumn = direction === "column";
    const currThemeStyle: React.CSSProperties = prefixStyle({
      width: "50%",
      minHeight: 240,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...themeStyle
    });

    const { theme } = this.context;

    return useSingleTheme || theme.useFluentDesign ? (
      <div
        style={prefixStyle({
          width: "100%",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        })}
      >
        {newTheme ? <Theme
          enableNoiseTexture
          desktopBackgroundConfig={{
            renderToScreen: false,
            enableRender: true
          }}
          theme={newTheme}
        >
          {children}
        </Theme> : children}
      </div>
    ) : (
      <div
        {...attributes}
        style={prefixStyle({
          display: "flex",
          flexDirection: isColumn ? "column" : "row",
          border: useBorder ? `1px solid ${darkTheme.listAccentLow}` : void 0,
          ...attributes.style
        })}
      >
        <Theme
          theme={darkTheme}
          enableNoiseTexture
          style={prefixStyle({
            ...prefixStyle({
              width: "50%",
              padding: "0 4px",
              minHeight: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...currThemeStyle
            })
          })}
        >
          {children}
        </Theme>
        <Theme
          enableNoiseTexture
          theme={lightTheme}
          style={prefixStyle({
            ...currThemeStyle
          })}
        >
          {children}
        </Theme>
      </div>
    );
  }
}
