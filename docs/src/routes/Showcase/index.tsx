import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface ShowcaseProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Showcase extends React.Component<ShowcaseProps> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <a
          href="https://www.antcores.com/"
          target="__blank"
          style={{
            color: theme.accent,
            textAlign: "center",
            display: "inline-block"
          }}
        >
          <img
            src={require("./images/antcores.png")}
            style={{
              width: "80%",
              minWidth: 320
            }}
          />
          <p style={{ fontSize: 24, fontWeight: "lighter" }}>AntCores- A Design Web Sites</p>
        </a>
      </div>
    );
  }
}

function getStyles(showcase: Showcase): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = showcase;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      ...style
    })
  };
}
