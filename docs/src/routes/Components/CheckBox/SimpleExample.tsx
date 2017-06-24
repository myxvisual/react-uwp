import * as React from "react";

import CheckBox from "react-uwp/CheckBox";

const baseStyle: React.CSSProperties = {
  margin: "10px 10px 10px 0"
};
export default class SimpleExample extends React.Component {
  render() {
    return (
      <div>
        <div>
          <CheckBox
            style={baseStyle}
            defaultChecked
          />
          <CheckBox
            style={baseStyle}
            defaultChecked={false}
          />
          <CheckBox
            style={baseStyle}
            defaultChecked={null}
          />
        </div>

        <div>
          <CheckBox
            style={baseStyle}
            defaultChecked
            label="Checked"
          />
          <CheckBox
            style={baseStyle}
            defaultChecked={false}
            label="UnChecked"
          />
          <CheckBox
            style={baseStyle}
            defaultChecked={null}
            label="UnSure"
          />
        </div>

        <div>
          <CheckBox
            style={baseStyle}
            defaultChecked
            disabled
            label="Disabled"
            labelPosition="left"
          />
          <CheckBox
            style={baseStyle}
            defaultChecked={false}
            disabled
            label="Disabled"
            labelPosition="left"
          />
          <CheckBox
            style={baseStyle}
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
