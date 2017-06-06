import * as React from "react";

import CheckBox from "react-uwp/CheckBox";

const checkBoxStyle: React.CSSProperties = {
  margin: 10
};
export default class SimpleExample extends React.Component<{}, void> {
  render() {
    return (
      <div>
        <div>
          <CheckBox
            style={checkBoxStyle}
            defaultChecked
          />
          <CheckBox
            style={checkBoxStyle}
            defaultChecked={false}
          />
          <CheckBox
            style={checkBoxStyle}
            defaultChecked={null}
          />
        </div>

        <div>
          <CheckBox
            style={checkBoxStyle}
            defaultChecked
            label="Checked"
          />
          <CheckBox
            style={checkBoxStyle}
            defaultChecked={false}
            label="UnChecked"
          />
          <CheckBox
            style={checkBoxStyle}
            defaultChecked={null}
            label="UnSure"
          />
        </div>

        <div>
          <CheckBox
            style={checkBoxStyle}
            defaultChecked
            disabled
            label="Disabled"
            labelPosition="left"
          />
          <CheckBox
            style={checkBoxStyle}
            defaultChecked={false}
            disabled
            label="Disabled"
            labelPosition="left"
          />
          <CheckBox
            style={checkBoxStyle}
            defaultChecked={null}
            disabled
            label="Disabled"
            labelPosition="left"
          />
        </div>
      </div>
    );
  }
}
