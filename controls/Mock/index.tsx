import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "react-uwp/style/ThemeType";


const defaultProps: MockProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}
interface MockProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface MockState {}

export default class Mock extends React.Component<MockProps, MockState> {
	static defaultProps: MockProps = { ...defaultProps, className: "" };
	state: MockState = {};
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { ...attributes } = this.props;
		let theme: ThemeType;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				style={attributes.style}
				hoverStyle={{ background: "red" }}
			>
				<div>
					Mock
				</div>
			</ElementState>
		);
	}
}
