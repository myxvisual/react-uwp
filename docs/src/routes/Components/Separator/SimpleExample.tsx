import * as React from "react";
import * as PropTypes from "prop-types";

import Separator from "react-uwp/Separator";
import ListView from "react-uwp/ListView";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <ListView
          listSource={[0, <Separator disabled />, 1]}
        />
        <div
          style={{
            height: 200,
            width: 200,
            margin: 10,
            background: this.context.theme.chromeLow
          }}
        >
          <Separator direction="column" />
        </div>
      </div>
    );
  }
}
