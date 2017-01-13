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
	isRadioBtn?: boolean;
}
export interface CheckBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface CheckBoxState {
	checked?: boolean;
}

export default class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
	static defaultProps: CheckBoxProps = {
		...defaultProps,
		isChecked: null,
		size: 24,
		onChangeCb: () => {},
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
			transition: "all .25s ease-in-out",
			overflow: "hidden",
			...this.props.style,
		} as React.CSSProperties;
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
		const { isChecked, onChangeCb, isDisable, isRadioBtn, style, ...attributes } = this.props;
		const { checked } = this.state;
		const size = style ? style.width / 2.5 : 8;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				{...this.getStyles()}
				onClick={isDisable ? void(0) : this.toggleChecked}
			>
				<div ref="container">
					{isRadioBtn
						?
						<Icon
							style={{
								transition: "all .25s 0s ease-in-out",
								padding: 0,
								margin: 0,
								fontSize: 20,
								transform: checked === null || checked ? "scale(1)" : "scale(0)",
								background: theme.accent,
								...style,
							}}
							hoverStyle={{}}
						>
							&#xE73E;
							{checked === null
								?
								<p
									style={{
										background: theme.accent,
										position: "absolute",
										top: 0,
										left: 0,
										height: "100%",
										width: "100%",
										border: `4px solid ${theme.altHigh}`
									}}
								/>
								: null
							}
						</Icon>
						:
						<p
							style={{
								background: theme.accent,
								borderRadius: size,
								width: checked ? (size || 8) : 0,
								height: checked ? (size || 8) : 0,
							}}
						/>
					}
				</div>
			</ElementState>
		);
	}
}
