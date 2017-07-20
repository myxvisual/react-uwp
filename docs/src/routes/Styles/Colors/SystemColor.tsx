import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import * as SystemColorDocs from "!raw!./SystemColor.md";

export interface DataProps {}

export interface SystemColorProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const getColorInfos = (theme: ReactUWP.ThemeType) => {
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

export default class SystemColor extends React.Component<SystemColorProps> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const colorInfos: any = getColorInfos(theme);
    const colorInfoNames = Object.keys(colorInfos);

    return (
      <div {...attributes}>
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
        <MarkdownRender text={SystemColorDocs as any} style={{ margin: 10 }} />
      </div>
    );
  }
}

function getStyles(systemColor: SystemColor): {
  root?: React.CSSProperties;
  head?: React.CSSProperties;
  rowItem?: React.CSSProperties;
  thirdPart?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = systemColor;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle(style),
    head: {
      color: theme.baseHigh,
      width: "33%",
      display: "inline-block",
      fontSize: 18,
      padding: "20px 0",
      textDecoration: "underline"
    },
    rowItem: prefixStyle({
      display: "flex",
      flexDirection: "row"
    }),
    thirdPart: {
      width: "33%",
      display: "flex",
      flexDirection: "row",
      padding: "2px 0"
    }
  };
}
