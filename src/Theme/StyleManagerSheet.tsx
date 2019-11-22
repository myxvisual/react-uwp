import * as React from "react";

export interface StyleManagerSheetState {
  CSSText?: string;
}

export class StyleManagerSheet extends React.Component<StyleManagerSheetState, StyleManagerSheetState> {
  state: StyleManagerSheetState = {
    CSSText: this.props.CSSText
  };

  render() {
    return (
      <style scoped>{this.state.CSSText}</style>
    );
  }
}
