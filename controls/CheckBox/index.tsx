import * as React from "react";

import ElementState from "../ElementState";
import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

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
		onClick: () => {},
		onChangeCb: () => {},
	};

	state: CheckBoxState = {
		checked: this.props.isChecked
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	refs: { container: HTMLDivElement };

	componentWillReceiveProps(nextProps: CheckBoxProps) {
		this.setState({
			checked: this.props.isChecked
		});
		this.props.onChangeCb(this);
	}

	getStyles = (): React.CSSProperties => {
		const { size, style, isRadioBtn } = this.props;
		const { theme } = this.context;
		const { checked } = this.state;
		const baseStyle = {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: theme.altHigh,
			border: `2px solid ${theme.baseMediumHigh}`,
			width: size,
			height: size,
			background: theme.altMediumHigh,
			transition: "all .25s ease-in-out",
			overflow: "hidden",
			...style,
		} as React.CSSProperties;
		const hoverStyle = { border: `2px solid ${theme.baseHigh}` };
		switch (checked) {
			case true: {
				return {
					style: { ...baseStyle, border: `2px solid ${theme.accent}` },
					hoverStyle: isRadioBtn ? void(0) : hoverStyle,
					activeStyle: isRadioBtn ? { border: `2px solid ${theme.baseHigh}` } : void(0)
				};
			}
			case false: {
				return {
					style: baseStyle,
					hoverStyle: isRadioBtn ? void(0) : hoverStyle,
					activeStyle: isRadioBtn ? { border: `2px solid ${theme.baseHigh}` } : void(0)
				};
			}
			case null: {
				return {
					style: baseStyle,
					hoverStyle: isRadioBtn ? void(0) : hoverStyle,
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
		// tslint:disable-next-line:no-unused-variable
		const { isChecked, onChangeCb, isDisable, isRadioBtn, style, ...attributes } = this.props;
		const { checked } = this.state;
		const size = style ? style.width / 2.5 : 8;
		const { theme } = this.context;

		return (
			<ElementState
				{...attributes}
				{...this.getStyles()}
				onClick={isDisable ? attributes.onClick : (e: React.MouseEvent<HTMLDivElement>) => {
					this.toggleChecked(e);
					attributes.onClick(e);
				}}
			>
				<div ref="container">
					{isRadioBtn
						?
						<ElementState
							style={{
								background: theme.baseHigh,
								borderRadius: size,
								width: checked ? (size || 8) : 0,
								height: checked ? (size || 8) : 0,
							}}
							activeStyle={{
								background: theme.baseMediumHigh
							}}
						>
							<p />
						</ElementState>
						:
						<Icon
							style={{
								transition: "all .25s 0s ease-in-out",
								color: theme.altHigh,
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
								<div
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
					}
				</div>
			</ElementState>
		);
	}
}
