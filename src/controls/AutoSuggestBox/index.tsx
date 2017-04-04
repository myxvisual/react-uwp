import * as React from "react";

import Input from "../Input";
import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	/**
	 * `AutoSuggestBox` onChange callback.
	 */
	onChangeValue?: (value: string) => void;
}

export interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}


export interface AutoSuggestBoxState {
	currentRightNode?: any;
}

export class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
	static defaultProps: AutoSuggestBoxProps = {
		onChangeValue: () => {}
	};

	state: AutoSuggestBoxState = {
		currentRightNode: <Icon>&#xE721;</Icon>
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	refs: { input: Input };

	handleChange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
		let event: React.SyntheticEvent<HTMLInputElement>;
		event = e;
		this.props.onChangeValue(event.currentTarget.value);
	}

	handleFocus = () => {
		this.setState({
			currentRightNode: (<Icon>{"\uE10A"}</Icon>)
		});
	}

	handleBlur = () => {
		this.setState({
			currentRightNode: (
				<Icon onClick={() => this.setValue("")}>
					&#xE721;
				</Icon>
			)
		});
	}

	getValue = () => this.refs.input.getValue();

	setValue = (value: string) => this.refs.input.setValue(value);

	render() {
		const {
			onChangeValue, // tslint:disable-line:no-unused-variable
			...attributes
		} = this.props;
		const { currentRightNode } = this.state;
		const styles = getStyles(this);

		return (
			<Input
				{...attributes}
				ref="input"
				style={styles.root}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				rightNode={currentRightNode}
				onChange={this.handleChange}
			/>
		);
	}
}

function getStyles(autoSuggestBox: AutoSuggestBox): {
	root?: React.CSSProperties;
} {
	const { context, props: { style } } = autoSuggestBox;
	const { theme } = context;

	return {
		root: theme.prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
			padding: "6px 10px",
			...style,
		}),
	};
}

export default AutoSuggestBox;
