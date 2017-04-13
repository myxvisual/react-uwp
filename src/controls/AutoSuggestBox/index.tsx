import * as React from "react";

import Input from "../Input";
import Icon from "../Icon";
import ListView from "../ListView";
import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	/**
	 * `AutoSuggestBox` onChange callback.
	 */
	onChangeValue?: (value: string) => void;
	/**
	 * Array of strings or nodes used to populate the list.
	 */
	listSource?: React.ReactNode[];
}

export interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AutoSuggestBoxState {
	currentRightNode?: any;
}

const iconStyle: React.CSSProperties = { color: "#a9a9a9" };

export class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
	static defaultProps: AutoSuggestBoxProps = {
		onChangeValue: () => {}
	};

	state: AutoSuggestBoxState = {
		currentRightNode: <Icon style={iconStyle}>&#xE721;</Icon>
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	refs: { input: Input };

	handleChange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
		let event: React.SyntheticEvent<HTMLInputElement>;
		event = e;
		const { currentTarget: { value } } = event;
		this.props.onChangeValue(value);
		if (value === "") {
			this.handleBlur();
		} else {
			this.handleFocus();
		}
	}

	handleFocus = () => {
		this.setState({
			currentRightNode: (<Icon style={iconStyle}>{"\uE10A"}</Icon>)
		});
	}

	handleBlur = () => {
		this.setState({
			currentRightNode: (
				<Icon style={iconStyle} onClick={() => this.setValue("")}>
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
			listSource,
			...attributes
		} = this.props;
		const { currentRightNode } = this.state;
		const styles = getStyles(this);

		return (
			<Input
				{...attributes}
				ref="input"
				style={styles.root}
				rightNode={currentRightNode}
				onChange={this.handleChange}
			>
				{listSource && (
					<ListView items={listSource.map(itemNode => ({ itemNode }))} />
				)}
			</Input>
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
			flex: "0 0 auto",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "6px 10px",
			...style,
			position: "relative"
		})
	};
}

export default AutoSuggestBox;
