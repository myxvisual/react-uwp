import * as React from "react";
import * as PropTypes from "prop-types";

import ScrollReveal from "react-uwp/ScrollReveal";
import IconButton from "react-uwp/IconButton";
import CheckBox from "react-uwp/CheckBox";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    const topOffset = window.innerHeight / 16;
    return (
      <div>
        <ScrollReveal
          speed={2000}
          topOffset={topOffset}
          leaveStyle={{ padding: 10, marginRight: 10, background: theme.accent, color: "#fff" }}
          enterStyle={{ background: "yellowgreen" }}
        >
          <div style={{ display: "inline-block" }}>Scroll the Window</div>
        </ScrollReveal>

        <ScrollReveal
          speed={850}
          topOffset={topOffset}
          leaveStyle={{ transform: "scale(0)", padding: 10, marginRight: 10, background: theme.baseLow }}
          enterStyle={{ transform: "scale(1)" }}
        >
          <div style={{ display: "inline-block" }}>Scale In Animation</div>
        </ScrollReveal>

        <ScrollReveal
          speed={500}
          topOffset={topOffset}
          leaveStyle={{ marginRight: 10, transform: "translateX(120px)", opacity: 0 }}
          enterStyle={{ transform: "translateX(0)", opacity: 1 }}
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
