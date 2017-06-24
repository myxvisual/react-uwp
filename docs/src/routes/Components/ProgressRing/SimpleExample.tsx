import * as React from "react";
import * as PropTypes from "prop-types";

import ProgressRing from "react-uwp/ProgressRing";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <ProgressRing size={25} />
        <ProgressRing size={50} />
        <ProgressRing size={75} />
        <ProgressRing size={75} dotsNumber={4} />
        <ProgressRing size={100} speed={6125} />
        <ProgressRing size={100} dotsStyle={{ background: "yellowgreen" }} />
      </div>
    );
  }
}
