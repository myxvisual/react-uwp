import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import * as readmeDoc1 from "!raw!./README1.md";
import * as readmeDoc2 from "!raw!./README2.md";

export default class Fonts extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <MarkdownRender text={readmeDoc1 as any} />
        <MarkdownRender style={{ marginTop: 80 }} text={readmeDoc2 as any} />
      </div>
    );
  }
}
