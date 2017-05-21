import * as React from "react";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";

export default class SimpleExample extends React.Component<void, void> {
  render() {
    return (
      <AutoSuggestBox
        placeholder="AutoSuggestBox"
        style={{ width: "100%" }}
      />
    );
  }
}
