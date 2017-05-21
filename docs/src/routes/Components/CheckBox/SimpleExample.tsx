import * as React from "react";

import CheckBox from "react-uwp/CheckBox";

const checkBoxStyle: React.CSSProperties = {
  margin: 10
};
export default class SimpleExample extends React.Component<void, void> {
  render() {
    return (
      <div>
        <div>
          <CheckBox
            style={checkBoxStyle}
            isChecked
          />
          <CheckBox
            style={checkBoxStyle}
            isChecked={false}
          />
          <CheckBox
            style={checkBoxStyle}
            isChecked={null}
          />
        </div>

        <div>
          <CheckBox
            style={checkBoxStyle}
            isChecked
            label="Checked"
          />
          <CheckBox
            style={checkBoxStyle}
            isChecked={false}
            label="UnChecked"
          />
          <CheckBox
            style={checkBoxStyle}
            isChecked={null}
            label="UnSure"
          />
        </div>

        <div>
          <CheckBox
            style={checkBoxStyle}
            isChecked
            disabled
            label="Disabled"
            labelPosition="left"
          />
          <CheckBox
            style={checkBoxStyle}
            isChecked={false}
            disabled
            label="Disabled"
            labelPosition="left"
          />
          <CheckBox
            style={checkBoxStyle}
            isChecked={null}
            disabled
            label="Disabled"
            labelPosition="left"
          />
        </div>
      </div>
    );
  }
}
