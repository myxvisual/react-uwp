import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import * as text from "!raw!./MarkdownExample.md";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <MarkdownRender text={text as any} />
      </div>
    );
  }
}
