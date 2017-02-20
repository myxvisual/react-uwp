import * as React from "react";

import Input from "../Input";
import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: AutoSuggestBoxProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	leftNode?: any;
	rightNode?: any;
	onChangeValue?: (value: string) => void;
}

interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface AutoSuggestBoxState {
	currentRightNode?: any;
}

export default class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
	static defaultProps: AutoSuggestBoxProps = {
		...defaultProps,
		rightNode: (<Icon>&#xE721;</Icon>),
		onChangeValue: () => {}
	};

	state: AutoSuggestBoxState = {
		currentRightNode: this.props.rightNode
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	refs: { input: Input };

	componentWillReceiveProps(nextProps: AutoSuggestBoxProps) {
		this.setState({
			currentRightNode: nextProps.rightNode
		});
	}

	handleOnchange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
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
		// tslint:disable-next-line:no-unused-variable
		const { leftNode, rightNode, onChangeValue, ...attributes } = this.props;
		const { currentRightNode } = this.state;
		const styles = getStyles(this);

		return (
			<Input
				{...attributes}
				ref="input"
				style={styles.root}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				leftNode={leftNode}
				rightNode={currentRightNode}
				onChange={this.handleOnchange}
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
