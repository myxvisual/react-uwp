import * as React from "react";

import ElementState from "../../components/ElementState";
import CheckBox, { CheckBoxProps, CheckBoxState } from "../CheckBox";
import { ThemeType } from "../../style/ThemeType";

let theme: ThemeType;
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

	render() {
		const { size, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<CheckBox
				isRadioBtn
				style={{
					borderRadius: size,
					width: size,
					height: size
				}}
			/>
		);
	}
}
