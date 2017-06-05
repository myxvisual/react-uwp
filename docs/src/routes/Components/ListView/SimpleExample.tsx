import * as React from "react";
import * as PropTypes from "prop-types";

import ListView, { ListViewProps, ListItem } from "react-uwp/ListView";
import Separator from "react-uwp/Separator";
import CheckBox from "react-uwp/CheckBox";
import Toggle from "react-uwp/Toggle";
import Icon from "react-uwp/Icon";

const listSource: ListItem[] = [{
  itemNode: <p>Text</p>
}, {
  itemNode: <Separator />,
  disabled: true
}, ...Array(12).fill(0).map((numb, index) => (
  <span key={`${index}`}>
    <span>Confirm{index + 1}</span>
    <Toggle background="none" style={{ float: "right" }} />
  </span>
)),
  <span>
    <span>Confirm</span>
    <CheckBox background="none" style={{ float: "right" }} />
  </span>
];

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={{ margin: "10px auto" }}>
        <ListView
          listSource={listSource}
          style={{ width: 300, margin: "10px auto" }}
        />
        <ListView
          listSource={Array(6).fill(0).map((numb, index) => (
            <div key={`${index}`}>{Array(index + 1).fill(<Icon>RatingStarFillZeroWidthLegacy</Icon>)}</div>
          ))}
          style={{ width: 150, margin: "10px auto" }}
          listItemStyle={{ height: 40 }}
        />
        <ListView
          listSource={Array(6).fill(0).map((numb, index) => index)}
        />
      </div>
    );
  }
}
