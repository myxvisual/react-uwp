import * as React from "react";
import * as PropTypes from "prop-types";

import * as accentColors from "react-uwp/styles/accentColors";
import MarkdownRender from "react-uwp/MarkdownRender";
import * as AccentColorDocs from "!raw!./AccentColor.md";

export interface AccentColorProps extends React.HTMLAttributes<HTMLDivElement> {}

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
const accentColorPluValues = [
  "A100",
  "A200",
  "A400",
  "A700"
];

export default class AccentColor extends React.Component<AccentColorProps> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={styles.root}>
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
              {(accentColors as any)[`${accentColorName}A100`] && (
                <div style={{ paddingTop: 2 }}>
                  {accentColorPluValues.map((value, index) => {
                    const color = (accentColors as any)[`${accentColorName}${value}`];
                    return <li
                      key={`${index}`}
                      style={{
                        background: color as any,
                        textTransform: "uppercase",
                        color: index < 3 ? "#000" : "#fff",
                        ...styles.colorItem
                      }}
                    >
                      <span>{value}</span>
                      <span style={{ float: "right" }}>{color}</span>
                    </li>;
                  })}
                </div>
              )}
            </ul>
          ))}
          <ul style={styles.colorContainer}>
            <li
              style={{
                width: 140,
                padding: 10,
                listStyleType: "none",
                background: "#000",
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: "50px",
                height: 70
              }}
            >
              <span>black</span>
              <span style={{ float: "right" }}>#000000</span>
            </li>
            <li
              style={{
                width: 140,
                padding: 10,
                listStyleType: "none",
                background: "#fff",
                textTransform: "uppercase",
                color: "#000",
                lineHeight: "50px",
                height: 70
              }}
            >
              <span>white</span>
              <span style={{ float: "right" }}>#ffffff</span>
            </li>
          </ul>
        </div>
        <MarkdownRender text={AccentColorDocs as any} style={{ clear: "both", margin: 10 }} />
      </div>
    );
  }
}


function getStyles(accentColor: AccentColor): {
  root?: React.CSSProperties;
  colorContainer?: React.CSSProperties;
  colorHead?: React.CSSProperties;
  colorItem?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = accentColor;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle(style),
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
