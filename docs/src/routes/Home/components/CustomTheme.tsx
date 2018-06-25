import * as React from "react";
import * as PropTypes from "prop-types";

import getTheme from "react-uwp/styles/getTheme";
import { WrapperState } from "components/Wrapper";
import Icon from "react-uwp/Icon";
import DropDownMenu from "react-uwp/DropDownMenu";
import ColorPicker from "react-uwp/ColorPicker";
import CheckBox from "react-uwp/CheckBox";
import TextBox from "react-uwp/TextBox";
import ScrollReveal, { slideLeftInProps, slideBottomInProps, scaleInProps } from "react-uwp/ScrollReveal";

export interface DataProps {}

export interface CustomThemeProps extends DataProps, WrapperState, React.HTMLAttributes<HTMLDivElement> {}

export default class CustomTheme extends React.Component<CustomThemeProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  fileInput: HTMLInputElement;

  render() {
    const {
      renderContentWidth,
      screenType,
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
            <ScrollReveal {...{ ...slideLeftInProps, speed: 850 }}>
            <div style={{ width: 320, fontWeight: "lighter" }}>
              <Icon style={{ fontSize: 120, linHeight: 1.6 } as React.CSSProperties}>Color</Icon>
              <p style={{ fontSize: 24 }}>Custom Beautiful Themes</p>
              <p style={{ fontSize: 13 }}>React-UWP just to achieve design specifications, more simple design of different themes, let you have complete design freedom.</p>
            </div>
            </ScrollReveal>
            <ScrollReveal {...{ ...slideBottomInProps, speed: 850, useWrapper: false }}>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 18, lineHeight: 1.6 }}>
                Choose Theme
              </p>
              <DropDownMenu
                values={[
                  "Dark",
                  "Light"
                ]}
                background={theme.useFluentDesign ? theme.acrylicTexture40.background : theme.chromeLow}
                defaultValue={theme.isDarkTheme ? "Dark" : "Light"}
                onChangeValue={value => {
                  theme.saveTheme(getTheme({
                    themeName: value.toLowerCase() as any,
                    accent: theme.accent,
                    useFluentDesign: theme.useFluentDesign,
                    desktopBackgroundImage: theme.desktopBackgroundImage
                  }));
                }}
              />
              <CheckBox
                style={{ marginLeft: 8 }}
                defaultChecked={theme.useFluentDesign}
                label="Use New Fluent Design"
                onCheck={useFluentDesign => {
                  theme.saveTheme(getTheme({
                    themeName: theme.themeName,
                    accent: theme.accent,
                    useFluentDesign,
                    desktopBackgroundImage: theme.desktopBackgroundImage
                  }));
                }}
              />
              <TextBox
                background="none"
                defaultValue="Paste Image URL or Upload..."
                style={{ marginTop: 4 }}
                onChangeValue={desktopBackgroundImage => {
                  const image = new Image();
                  image.addEventListener("load", function(e) {
                    theme.saveTheme(getTheme({
                      themeName: theme.themeName,
                      accent: theme.accent,
                      useFluentDesign: theme.useFluentDesign,
                      desktopBackgroundImage
                    }));
                  });
                  image.src = desktopBackgroundImage;
                }}
                rightNode={
                  <Icon
                    style={{
                      fontSize: 12,
                      height: 32,
                      width: 32,
                      lineHeight: "32px",
                      cursor: "pointer"
                    }}
                    hoverStyle={{
                      background: theme.listLow
                    }}
                    onClick={() => {
                      this.fileInput.click();
                    }}
                  >
                    UpLegacy
                  </Icon>
                }
              />
              <input
                ref={fileInput => this.fileInput = fileInput}
                type="file"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.currentTarget.files[0];
                  const reader  = new FileReader();
                    reader.addEventListener("load", () => {
                      theme.saveTheme(getTheme({
                        themeName: theme.themeName,
                        accent: theme.accent,
                        useFluentDesign: theme.useFluentDesign,
                        desktopBackgroundImage: reader.result
                      }));
                    }, false);
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            </ScrollReveal>
          </div>
          <ScrollReveal {...scaleInProps}>
          <ColorPicker
            style={{ margin: "10px 0" }}
            defaultColor={theme.accent}
            onChangedColor={accent => {
              theme.saveTheme(getTheme({
                themeName: theme.themeName,
                accent,
                useFluentDesign: theme.useFluentDesign,
                desktopBackgroundImage: theme.desktopBackgroundImage
              }));
            }}
          />
          </ScrollReveal>
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
  const { prefixStyle } = theme;

  return {
    root: prefixStyle(style),
    content: prefixStyle({
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
