import * as React from "react";
import * as PropTypes from "prop-types";

import MenuSimpleExample from "../Menu/SimpleExample";
import CheckBoxSimpleExample from "../CheckBox/SimpleExample";
import DatePickerExample from "../DatePickers/DatePicker/SimpleExample";
import Theme, { getTheme } from "react-uwp/Theme";

export class FluentDesignExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          padding: 20,
          background: theme.useFluentDesign ? theme.acrylicTexture80.background : "none"
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    const baseStyle: React.CSSProperties = {
      width: window.innerWidth > 960 ? "50%" : "100%",
      padding: 20
    };
    return (
      <div
        style={theme.prefixStyle({
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%"
        })}
      >
        <Theme
          style={baseStyle}
          theme={getTheme({
            themeName: "dark",
            accent: theme.accent
          })}
        >
          <p>Dark Theme without Fluent Design</p>
          <MenuSimpleExample />
          <CheckBoxSimpleExample />
          <DatePickerExample />
        </Theme>

        <Theme
          style={baseStyle}
          theme={getTheme({
            themeName: "light",
            accent: theme.accent
          })}
        >
          <p>Light Theme without Fluent Design</p>
          <MenuSimpleExample />
          <CheckBoxSimpleExample />
          <DatePickerExample />
        </Theme>

        <Theme
          style={{ ...baseStyle, padding: 0 }}
          theme={getTheme({
            themeName: "dark",
            accent: theme.accent,
            useFluentDesign: true,
            desktopBackgroundImage: theme.desktopBackgroundImage
          })}
        >
          <FluentDesignExample>
            <p>Dark Theme with Fluent Design</p>
            <MenuSimpleExample />
            <CheckBoxSimpleExample />
            <DatePickerExample />
          </FluentDesignExample>
        </Theme>

        <Theme
          style={{ ...baseStyle, padding: 0 }}
          theme={getTheme({
            themeName: "light",
            accent: theme.accent,
            useFluentDesign: true,
            desktopBackgroundImage: theme.desktopBackgroundImage
          })}
        >
          <FluentDesignExample>
            <p>Light Theme with Fluent Design</p>
            <MenuSimpleExample />
            <CheckBoxSimpleExample />
            <DatePickerExample />
          </FluentDesignExample>
        </Theme>
      </div>
    );
  }
}
