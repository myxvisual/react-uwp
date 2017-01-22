import * as React from "react";

import CheckBox, { CheckBoxProps, CheckBoxState } from "../CheckBox";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: RadiusProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	size?: string | number;
}
interface RadiusProps extends CheckBoxProps {}
interface RadiusState extends CheckBoxState {}

export default class Radius extends CheckBox {
	static defaultProps: RadiusProps = { ...defaultProps, size: 20, onChangeCb: () => {} };
	state: RadiusState = {};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { size, ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<CheckBox
				isRadioBtn
				style={{
					borderRadius: size,
					width: size,
					height: size
				}}
				{...attributes}
			/>
		);
	}
}
