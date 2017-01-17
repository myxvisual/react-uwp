import * as React from "react";

import { ThemeType } from "../../style/ThemeType";
const defaultProps: TooltipProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}
interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface TooltipState {}

export default class Tooltip extends React.Component<TooltipProps, TooltipState> {
	static defaultProps: TooltipProps = {
		...defaultProps,
		className: ""
	};
	state: TooltipState = {};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<div
				{...attributes}
				style={{
					color: theme.baseMediumHigh,
					background: theme.altMediumHigh,
					fontSize: 14,
					...attributes.style,
				}}
			>
				Tooltip
			</div>
		);
	}
}
