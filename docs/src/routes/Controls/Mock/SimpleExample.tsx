import * as React from "react";

import AutoSuggestBox from "react-uwp/src/controls/AutoSuggestBox";

export default class SimpleExample extends React.PureComponent<void, void> {
	render() {
		return (
			<AutoSuggestBox
				placeholder="AutoSuggestBox"
				style={{ width: "100%" }}
			/>
		);
	}
}
