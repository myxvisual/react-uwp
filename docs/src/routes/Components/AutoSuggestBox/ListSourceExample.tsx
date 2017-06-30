import * as React from "react";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";

export interface ListSourceExampleState {
  listSource: string[];
}

const colors = ["Blue", "Red", "Green", "Grey", "Black", "Yellow", "Purple", "Brown", "White", "Orange", "Pink", "Violet", "Olive", "Cyan", "Magenta", "Gold", "Lavender", "Indigo", "Maroon", "Turquoise", "Chartreuse", "Coral", "Beige", "Azure", "Lime", "Teal", "Sky Blue", "Forest Green", "Silver", "Tan", "Salmon (color)", "Midnight blue", "Cornflower blue", "Fuchsia", "Ivory", "Khaki", "Steel blue", "Aquamarine", "Goldenrod", "Crimson", "Royal blue", "Slate gray", "Plum", "Spring green", "Powder blue", "Alice blue", "Orchid", "Dodger blue", "Lemon chiffon", "Light blue", "Navajo white"];

const autoSuggestBoxStyle: React.CSSProperties = {
  display: "block",
  margin: "20px auto"
};

export default class ListSourceExample extends React.Component<{}, ListSourceExampleState> {
  state: ListSourceExampleState = {
    listSource: []
  };

  handleChangeValue = (value: string) => {
    this.setState({
      listSource: value ? colors.filter(color => color.toLowerCase().includes(value.toLowerCase())) : []
    });
  }

  render() {
    const { listSource } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <AutoSuggestBox
          placeholder="Type some colors. (Dynamic listSource)"
          style={autoSuggestBoxStyle}
          listSource={listSource}
          onChangeValue={this.handleChangeValue}
        />
        <AutoSuggestBox
          placeholder="Focus this Input. (Static listSource)"
          style={autoSuggestBoxStyle}
          listSource={colors.slice(0, 8)}
          onChangeValue={this.handleChangeValue}
        />
      </div>
    );
  }
}
