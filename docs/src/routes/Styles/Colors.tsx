import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";
import DropDownMenu from "react-uwp/DropDownMenu";
import MarkdownRender from "components/MarkdownRender";
import * as accentColors from "react-uwp/styles/accentColors";

export interface DataProps {}

export interface ColorsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ColorsState {
  showColorName?: "Default" | "Accents";
}

const accentColorNames = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "grey",
  "blueGrey"
];
const accentColorValues = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
];
const accentColorValuesPlus = [
  "A100",
  "A200",
  "A400",
  "A700"
];
const getColorInfos = (theme: ThemeType) => {
  const baseColor = theme.isDarkTheme ? "White" : "Black";
  const altColor = !theme.isDarkTheme ? "White" : "Black";
  return {
    baseLow: `20% ${baseColor}`,
    baseMediumLow: `40% ${baseColor}`,
    baseMedium: `60% ${baseColor}`,
    baseMediumHigh: `80% ${baseColor}`,
    baseHigh: `100% ${baseColor}`,
    "break-0": "",

    altLow: `20% ${altColor}`,
    altMediumLow: `40% ${altColor}`,
    altMedium: `60% ${altColor}`,
    altMediumHigh: `80% ${altColor}`,
    altHigh: `100% ${altColor}`,
    "break-1": "",

    listLow: `10% ${baseColor}`,
    listMedium: `20% ${baseColor}`,
    listAccentLow: "40% Accent",
    listAccentMedium: "60% Accent",
    listAccentHigh: "70% Accent",
    "break-2": "",

    accentLighter3: "100% Accent 3 shades lighter",
    accentLighter2: "100% Accent 2 shades lighter",
    accentLighter1: "100% Accent 1 shade lighter",
    accent: "100% User-selected accent color",
    accentDarker1: "100% Accent 1 shade darker ",
    accentDarker2: "100% Accent 2 shades darker ",
    accentDarker3: "100% Accent 3 shades darker",
    "break-3": "",

    chromeLow: `100% ${theme.chromeLow}`,
    chromeMediumLow: `100% ${theme.chromeMediumLow}`,
    chromeMedium: `100% ${theme.chromeMedium}`,
    chromeHigh: `100% ${theme.chromeHigh}`,
    "break-4": "",

    chromeAltLow: `100% ${theme.chromeAltLow}`,
    "break-5": "",

    chromeDisabledLow: `100% ${theme.chromeDisabledLow}`,
    chromeDisabledHigh: `100% ${theme.chromeDisabledHigh}`,
    "break-6": "",

    chromeBlackLow: `20% Black`,
    chromeBlackMediumLow: `40% Black`,
    chromeBlackMedium: `80% Black`,
    chromeBlackHigh: `100% Black`,
    "break-7": "",

    chromeWhite: "100% White"
  };
};

export default class Colors extends React.Component<ColorsProps, ColorsState> {
  static defaultProps: ColorsProps = {};

  state: ColorsState = {
    showColorName: "Accents"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };
  handleChangeColor = (value: string) => {
    this.setState({
      showColorName: value as any
    });
  }

  render() {
    const {
      ...attributes
    } = this.props;
    const { showColorName } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const colorInfos: any = getColorInfos(theme);
    const colorInfoNames = Object.keys(colorInfos);
    const showAccents = showColorName === "Accents";

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <DropDownMenu
          style={{ marginLeft: 10 }}
          itemWidth={300}
          values={showAccents ? [
            "Accents",
            "Default"
          ] : [
            "Default",
            "Accents"
          ]}
          onChangeValue={this.handleChangeColor}
        />
        {showAccents ? (
          <div>
            {accentColorNames.map((accentColorName, index) => (
              <ul key={`${index}`} style={styles.colorContainer}>
                <li
                  style={{
                    background: (accentColors as any)[`${accentColorName}500` as any],
                    ...styles.colorItem,
                    height: 140,
                    color: "#fff",
                    fontSize: 16,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                   <p>{accentColorName}</p>
                </li>
                {accentColorValues.map((value, index) => {
                  const color = (accentColors as any)[`${accentColorName}${value}`];
                  return <li
                    key={`${index}`}
                    style={{
                      background: color as any,
                      textTransform: "uppercase",
                      color: index < 5 ? "#000" : "#fff",
                      ...styles.colorItem
                    }}
                  >
                    <span>{value}</span>
                    <span style={{ float: "right" }}>{color}</span>
                  </li>;
                })}
              </ul>
            ))}
          </div>
        ) : (
          <div style={{ padding: 10 }}>
            <div style={styles.head}>
              Simple Name
            </div>
            <div style={styles.head}>
              {`${theme.themeName} Theme Opacity`}
            </div>
            <div style={styles.head}>
              {`${theme.themeName} Theme RGBA`}
            </div>
            {colorInfoNames.map((colorInfoName, index) => {
              const renderBreak = colorInfoName.indexOf("break-") === 0;
              return renderBreak ? (
                <div key={`${index}`} style={{ height: 20, width: 20 }} />
              ) : (
                <div key={`${index}`} style={styles.rowItem}>
                  <p style={styles.thirdPart}>{colorInfoName}</p>
                  <div style={styles.thirdPart}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 8,
                        border: `1px solid ${theme.baseMedium}`,
                        background: (theme as any)[colorInfoName as any]
                      }}
                    />
                    <p>{colorInfos[colorInfoName]}</p>
                  </div>
                  <p style={styles.thirdPart}>{(theme as any)[colorInfoName as any]}</p>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginLeft: 10, marginTop: 80, clear: "both" }}>
          <MarkdownRender
            text={showAccents ? `The Accent Color palette is fork from Google Material Design.

see the spec [Color palette](https://material.io/guidelines/style/color.html#color-color-tool).

usage:
\`\`\`jsx
import * as accentColors from "react-uwp/styles/accentColors";
import { red500 } from "react-uwp/styles/accentColors";

accentColors.red500 === "#f44336" /// true

\`\`\`
` : `This a System Color palette.

  You can get \`theme\` in your Component. example code:
  \`\`\`jsx
import * as React from "react";
import * as PropTypes from "prop-types";
import ThemeType from "react-uwp/styles/ThemeType";

export default class ThemeChild extends React.component<void, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    return (
      <div>
        {this.context.theme.accent}
      </div>
    )
  }
}
  \`\`\`
  `
            }
          />
        </div>
      </div>
    );
  }
}

function getStyles(colors: Colors): {
  root?: React.CSSProperties;
  head?: React.CSSProperties;
  rowItem?: React.CSSProperties;
  thirdPart?: React.CSSProperties;
  colorContainer?: React.CSSProperties;
  colorHead?: React.CSSProperties;
  colorItem?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = colors;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      padding: 20,
      background: theme.altMediumHigh,
      minHeight: "100%",
      fontSize: 13,
      fontWeight: "lighter",
      ...style
    }),
    head: {
      color: theme.baseHigh,
      width: "33%",
      display: "inline-block",
      fontSize: 18,
      padding: "20px 0",
      textDecoration: "underline"
    },
    rowItem: prepareStyles({
      display: "flex",
      flexDirection: "row"
    }),
    thirdPart: {
      width: "33%",
      display: "flex",
      flexDirection: "row",
      padding: "2px 0"
    },
    colorContainer: {
      float: "left",
      display: "inline-block",
      padding: 10
    },
    colorItem: {
      listStyleType: "none",
      padding: 10,
      width: 140
    }
  };
}
