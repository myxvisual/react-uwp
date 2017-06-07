import * as React from "react";
import * as PropTypes from "prop-types";

import Separator from "react-uwp/Separator";
import Icon from "react-uwp/Icon";
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
          style={this.context.theme.prepareStyles({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            height: 200,
            width: 200,
            margin: 10,
            fontSize: 40,
            background: this.context.theme.chromeLow
          })}
        >
          <Icon>HeartFillLegacy</Icon>
          <Separator direction="column" />
          <Icon>EmojiLegacy</Icon>
        </div>
      </div>
    );
  }
}
