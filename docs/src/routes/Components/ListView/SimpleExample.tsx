import * as React from "react";
import * as PropTypes from "prop-types";

import ListView, { ListViewProps } from "react-uwp/ListView";
import Separator from "react-uwp/Separator";
import CheckBox from "react-uwp/CheckBox";
import Toggle from "react-uwp/Toggle";
import Icon from "react-uwp/Icon";

const listSource = [{
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

const baseStyle: React.CSSProperties = {
  margin: "10px 10px 10px 0"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={baseStyle}>
        <ListView
          listSource={listSource}
          style={baseStyle}
        />
        <ListView
          listSource={Array(15).fill(0).map((zero, index) => (
            <div key={`${index}`}>
              {Array(index + 1).fill(0).map((zero, index) => (
                <Icon key={index}>RatingStarFillZeroWidthLegacy</Icon>
              ))}
            </div>
          ))}
          style={baseStyle}
          listItemStyle={{ height: 40 }}
        />
        <ListView
          listSource={Array(15).fill(0).map((numb, index) => index)}
        />
      </div>
    );
  }
}
