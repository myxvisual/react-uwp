import * as React from "react";

import ElementState from "../../components/ElementState";
import Input from "../Input";
import Icon from "../Icon";
import { ThemeType } from "../../style/ThemeType";

let theme: ThemeType;
const defaultProps: AutoSuggestBoxProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	leftNode?: any;
	rightNode?: any;
}
interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface AutoSuggestBoxState {}

export default class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
	static defaultProps: AutoSuggestBoxProps = {
		...defaultProps,
		rightNode: <Icon style={{ fontSize: 14 }}>&#xE721;</Icon>
	};
	state: AutoSuggestBoxState = {};
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { leftNode, rightNode, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					color: theme.baseMediumHigh,
					background: theme.altMediumHigh,
					padding: "6px 10px",
					fontSize: 14,
					...attributes.style,
				}}
			>
				<Input
					leftNode={leftNode}
					rightNode={rightNode}
					defaultValue="AutoSuggestBox"
				/>
			</ElementState>
		);
	}
}
