import * as React from "react";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import Icon from "react-uwp/Icon";

export interface ListSourceExampleState {
  listSource: string[];
}

const itemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
};

const colors = ["Blue", "Red", "Green", "Grey", "Black", "Yellow", "Purple", "Brown", "White", "Orange", "Pink", "Violet", "Olive", "Cyan", "Magenta", "Gold", "Lavender", "Indigo", "Maroon", "Turquoise", "Chartreuse", "Coral", "Beige", "Azure", "Lime", "Teal", "Sky Blue", "Forest Green", "Silver", "Tan", "Salmon (color)", "Midnight blue", "Cornflower blue", "Fuchsia", "Ivory", "Khaki", "Steel blue", "Aquamarine", "Goldenrod", "Crimson", "Royal blue", "Slate gray", "Plum", "Spring green", "Powder blue", "Alice blue", "Orchid", "Dodger blue", "Lemon chiffon", "Light blue", "Navajo white"].map((color, index) => (
  <div style={itemStyle} key={`${index}`} {...{ value: color }}>
    {color}
    <Icon>HeartFillLegacy</Icon>
  </div>
));

export default class ListSourceComplexExample extends React.Component<{}, ListSourceExampleState> {
  state: ListSourceExampleState = {
    listSource: colors.slice(0, 5) as any
  };

  handleChangeValue = (value: string) => {
    this.setState({
      listSource: value ? colors.filter(
        color => color.props.value.toLowerCase().includes(value.toLowerCase())
      ) as any : []
    });
  }

  render() {
    const { listSource } = this.state;
    return (
      <AutoSuggestBox
        placeholder="Focus this Input. (Initial listSource)"
        listSource={listSource}
        onChangeValue={this.handleChangeValue}
      />
    );
  }
}
