import * as React from "react";
import * as PropTypes from "prop-types";

import ScrollReveal from "react-uwp/ScrollReveal";
import IconButton from "react-uwp/IconButton";
import CheckBox from "react-uwp/CheckBox";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div>
        <ScrollReveal
          style={{ padding: 10, background: theme.accent, color: "#fff" }}
          animatedStyle={{ background: "yellowgreen" }}
        >
          <div style={{ display: "inline-block" }}>Scroll the Window</div>
        </ScrollReveal>

        <ScrollReveal
          speed={850}
          style={{ transform: "scale(0)", padding: 10, background: theme.baseLow }}
          animatedStyle={{ transform: "scale(1)" }}
        >
          <div style={{ display: "inline-block" }}>Scale In Animation</div>
        </ScrollReveal>

        <ScrollReveal
          speed={500}
          style={{ transform: "translateX(120px)", opacity: 0 }}
          animatedStyle={{ transform: "translateX(0)", opacity: 1 }}
        >
          <div style={{ display: "inline-block" }}>
            <CheckBox />
            <IconButton>HeartFillLegacy</IconButton>
          </div>
        </ScrollReveal>
      </div>
    );
  }
}
