import * as React from "react";

import ElementState from "../../components/ElementState";
import Input from "../Input";
import Icon from "../Icon";
import { ThemeType } from "../../style/ThemeType";

const defaultProps: AutoSuggestBoxProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	leftNode?: any;
	rightNode?: any;
	onChangeValue?: (value: string) => void;
}
interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface AutoSuggestBoxState {}

export default class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
	static defaultProps: AutoSuggestBoxProps = {
		...defaultProps,
		rightNode: (<Icon style={{ fontSize: 14 }}>&#xE721;</Icon>),
		onChangeValue: () => {}
	};
	state: AutoSuggestBoxState = {};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	handleOnchange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
		let event: React.SyntheticEvent<HTMLInputElement>;
		event = e;
		this.props.onChangeValue(event.currentTarget.value);
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { leftNode, rightNode, onChangeValue, ...attributes } = this.props;
		const { theme: { baseMediumHigh, altMediumHigh } } = this.context;

		return (
			<ElementState
				{...attributes}
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					color: baseMediumHigh,
					background: altMediumHigh,
					padding: "6px 10px",
					fontSize: 14,
					...attributes.style,
				}}
			>
				<Input
					leftNode={leftNode}
					rightNode={rightNode}
					placeholder="AutoSuggestBox"
					onChange={this.handleOnchange}
				/>
			</ElementState>
		);
	}
}
