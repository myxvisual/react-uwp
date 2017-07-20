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
}

export default class DoubleThemeRender extends React.Component<DoubleThemeRenderProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { children, direction, themeStyle, useBorder, useChromeColor, useSingleTheme, ...attributes } = this.props;
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

    return  useSingleTheme || theme.useFluentDesign ? (
      <div
        style={prefixStyle({
          width: "100%",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        })}
      >
        {children}
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
          style={prefixStyle({
            background: theme.useFluentDesign ? void 0 : (
              useChromeColor ? darkTheme.chromeLow : darkTheme.altHigh
            ),
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
          theme={lightTheme}
          style={prefixStyle({
            background: theme.useFluentDesign ? void 0 : (
              useChromeColor ? lightTheme.chromeLow : lightTheme.altHigh
            ),
            ...currThemeStyle
          })}
        >
          {children}
        </Theme>
      </div>
    );
  }
}
