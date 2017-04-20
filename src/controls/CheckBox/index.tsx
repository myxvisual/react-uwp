import * as React from "react";

import ElementState from "../ElementState";
import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	/**
	 * Checkbox is checked if `true`.
	 */
	isChecked?: true | false | null;
	/**
	 * `Callback` function that is fired when the checkbox is checked.
	 */
	onCheck?: (checked?: boolean) => void;
}

export interface CheckBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CheckBoxState {
	checked?: boolean;
}

const emptyFunc = () => {};

export class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
	static defaultProps: CheckBoxProps = {
		isChecked: null,
		onCheck: emptyFunc,
		onClick: emptyFunc,
		size: 20
	};

	state: CheckBoxState = {
		checked: this.props.isChecked
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	/**
	 * Root `HTMLDivElement`
	 */
	rootElm: HTMLDivElement;

	componentWillReceiveProps(nextProps: CheckBoxProps) {
		this.setState({
			checked: this.props.isChecked
		});
	}

	/**
	 * `Public` Toggle Checked Method.
	 */
	toggleChecked = (e?: React.SyntheticEvent<HTMLDivElement>) => {
		this.setState((prevState, prevProps) => {
			this.props.onCheck(!prevState.checked);
			return { checked: !prevState.checked };
		});
	}

	render() {
		const {
			isChecked, // tslint:disable-line:no-unused-variable
			onCheck, // tslint:disable-line:no-unused-variable
			disabled,
			...attributes
		} = this.props;
		const { checked } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<ElementState
				{...attributes}
				{...styles.root}
				onClick={disabled ? attributes.onClick : (e: React.MouseEvent<HTMLDivElement>) => {
					this.toggleChecked(e);
					attributes.onClick(e);
				}}
			>
				<div ref={rootElm => this.rootElm = rootElm}>
					<Icon
						style={styles.icon}
					>
						CheckMarkZeroWidthLegacy
					</Icon>
				</div>
			</ElementState>
		);
	}
}

function getStyles(checkBox: CheckBox): {
	root?: React.CSSProperties;
	icon?: React.CSSProperties;
} {
	const {
		context,
		props: { size, style, disabled },
		state: { checked }
	} = checkBox;
	const { theme } = context;
	const checkedIsNull = checked === null;

	const rootBaseStyle = theme.prepareStyles({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: theme.altHigh,
		border: `2px solid ${theme.baseMediumHigh}`,
		width: `${size}px`,
		height: `${size}px`,
		background: theme.altMediumHigh,
		cursor: "default",
		transition: "all .25s ease-in-out",
		overflow: "hidden",
		...style
	}) as React.CSSProperties;
	const rootHoverStyle = { border: `2px solid ${theme.baseHigh}` };
	let root: React.CSSProperties;

	switch (checked) {
		case true: {
			root =  {
				style: {
					...rootBaseStyle,
					border: `2px solid ${disabled ? theme.baseLow : theme.accent}`
				},
				hoverStyle: disabled ? void 0 : rootHoverStyle
			};
		}
		case false: {
			root =  {
				style: {
					...rootBaseStyle,
					border: `2px solid ${disabled ? theme.baseLow : theme.baseMediumHigh}`
				},
				hoverStyle: disabled ? void 0 : rootHoverStyle
			};
		}
		case null: {
			root =  {
				style: {
					...rootBaseStyle,
					border: `2px solid ${disabled ? theme.baseLow : theme.baseMediumHigh}`
				},
				hoverStyle: disabled ? void 0 : rootHoverStyle
			};
		}
		default: {
			break;
		}
	}

	return {
		root,
		icon: theme.prepareStyles({
			transition: "all .25s 0s ease-in-out",
			color: disabled ? (
				checkedIsNull ? "transparent" : theme.baseLow
			) : (
				checkedIsNull ? theme.accent : theme.altHigh
			),
			padding: 0,
			margin: 0,
			fontSize: 20,
			transform: checked ? "scale(1)" : (
				checkedIsNull ? "scale(0.6125)" : "scale(0)"
			),
			background: disabled ? (checkedIsNull ? theme.baseLow : void 0) : theme.accent
		})
	};
}

export default CheckBox;
