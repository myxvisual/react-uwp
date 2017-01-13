import * as React from "react";

import ElementState from "../../components/ElementState";
import Icon from "../Icon";
import { ThemeType } from "../../style/ThemeType";

let theme: ThemeType;
const defaultProps: CheckBoxProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	isChecked?: true | false | null;
	isDisable?: boolean;
	onChangeCb?: Function;
}
interface CheckBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface CheckBoxState {
	checked?: boolean;
}

export default class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
	static defaultProps: CheckBoxProps = {
		...defaultProps,
		isChecked: null,
		size: 24,
	};
	state: CheckBoxState = {
		checked: this.props.isChecked
	};
	static contextTypes = { theme: React.PropTypes.object };
	refs: { container: HTMLDivElement };

	componentWillReceiveProps(nextProps: CheckBoxProps) {
		this.setState({
			checked: this.props.isChecked
		});
		this.props.onChangeCb(this);
	}

	getStyles = (): React.CSSProperties => {
		const { isChecked, size, style } = this.props;
		const { checked } = this.state;
		const baseStyle = {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: theme.baseMediumLow,
			border: `2px solid ${theme.baseMediumLow}`,
			width: size,
			height: size,
			background: theme.altMediumHigh,
			transition: "all .25s 0s ease-in-out",
			...this.props.style,
		};
		const hoverStyle = { border: `2px solid ${theme.baseHigh}` };
		switch (checked) {
			case true: {
				return {
					style: { ...baseStyle, border: `2px solid ${theme.accent}` },
					hoverStyle
				};
			}
			case false: {
				return {
					style: baseStyle,
					hoverStyle
				};
			}
			case null: {
				return {
					style: baseStyle,
					hoverStyle: {}
				};
			}
			default: {
				break;
			}
		}
	}

	toggleChecked = (e?: React.SyntheticEvent<HTMLDivElement>) => {
		this.setState((prevStae, prevProps) => ({ checked: !prevStae.checked }));
		this.props.onChangeCb(this);
	}

	render() {
		const { isChecked, onChangeCb, isDisable, style, ...attributes } = this.props;
		const { checked } = this.state;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				{...this.getStyles()}
				onClick={isDisable ? void(0) : this.toggleChecked}
			>
				<div ref="container">
					{checked !== false
						?
						<Icon
							style={{
								padding: 0,
								margin: 0,
								fontSize: 20,
								background: checked === true ? theme.accent : void(0),
							}}
							hoverStyle={{}}
						>
							&#xE73E;
						</Icon>
						: null}
				</div>
			</ElementState>
		);
	}
}
