import * as React from "react";
import * as PropTypes from "prop-types";

import getTheme from "react-uwp/styles/getTheme";
import Icon from "react-uwp/Icon";
import DropDownMenu from "react-uwp/DropDownMenu";
import ColorPicker from "react-uwp/ColorPicker";

export interface DataProps {
  renderContentWidth?: number | string;
}

export interface CustomThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CustomThemeState {}

export default class CustomTheme extends React.Component<CustomThemeProps, CustomThemeState> {
  static defaultProps: CustomThemeProps = {};

  state: CustomThemeState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      renderContentWidth,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.content}>
          <div>
            <div style={{ width: 320, fontWeight: "lighter" }}>
              <Icon style={{ fontSize: 120, linHeight: 1.6 }}>Color</Icon>
              <p style={{ fontSize: 24 }}>Custom Beautiful Themes</p>
              <p style={{ fontSize: 13 }}>React-UWP just to achieve design specifications, more simple design of different themes, let you have complete design freedom.</p>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 18, lineHeight: 1.6 }}>
                Choose Theme
              </p>
              <DropDownMenu
                values={[
                  "Dark",
                  "Light"
                ]}
                defaultValue={theme.themeName}
                onChangeValue={value => {
                  theme.saveTheme(getTheme(value as any, theme.accent));
                }}
              />
            </div>
          </div>
          <div style={{ padding: "20px 0" }}>
            <ColorPicker
              defaultColor={theme.accent}
              onChangedColor={color => {
                  theme.saveTheme(getTheme(theme.themeName, color));
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

function getStyles(customTheme: CustomTheme): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, renderContentWidth }
  } = customTheme;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      backgroundImage: `linear-gradient(90deg, ${theme.listLow}, transparent)`,
      ...style
    }),
    content: prepareStyles({
      padding: 20,
      width: renderContentWidth,
      margin: "0 auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap"
    })
  };
}
