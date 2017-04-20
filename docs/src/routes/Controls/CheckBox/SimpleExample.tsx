import * as React from "react";

import CheckBox from "react-uwp/src/controls/CheckBox";

const checkBoxStyle: React.CSSProperties = {
	margin: 10
};
export default class SimpleExample extends React.PureComponent<void, void> {
	render() {
		return (
			<div>
				<CheckBox style={checkBoxStyle} isChecked />
				<CheckBox style={checkBoxStyle} isChecked={false} />
				<CheckBox style={checkBoxStyle} isChecked={null} />
				<CheckBox style={checkBoxStyle} isChecked disabled />
				<CheckBox style={checkBoxStyle} isChecked={false} disabled />
				<CheckBox style={checkBoxStyle} isChecked={null} disabled />
			</div>
		);
	}
}
