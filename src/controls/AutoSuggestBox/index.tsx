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
	currListSource?: React.ReactNode[];
	typing?: boolean;
}

const iconStyle: React.CSSProperties = { color: "#a9a9a9" };

export class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
	static defaultProps: AutoSuggestBoxProps = {
		onChangeValue: () => {}
	};

	state: AutoSuggestBoxState = {
		currListSource: this.props.listSource
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	/**
	 * `Input` component.
	 */
	input: Input;

	componentWillReceiveProps(nextProps: AutoSuggestBoxProps) {
		this.setState({ currListSource: nextProps.listSource });
	}

	handleChange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
		let event: React.SyntheticEvent<HTMLInputElement>;
		event = e;
		const { currentTarget: { value } } = event;
		this.props.onChangeValue(value);
		if (value) {
			this.setState({ typing: true });
		} else {
			this.setState({ typing: false });
		}
	}

	/**
	 * `Get` input value method.
	 */
	getValue = () => this.input.getValue();

	/**
	 * `Set` input value method.
	 */
	setValue = (value: string) => this.input.setValue(value);

	/**
	 * `Reset` input value method.
	 */
	resetValue = (e: React.MouseEvent<HTMLInputElement>) => {
		this.setValue("");
		this.setState({
			currListSource: [],
			typing: false
		});
		this.input.input.focus();
	}

	handleChooseItem = (index: number) => {
		const item: any = this.props.listSource[index];
		this.setValue(typeof item === "object" ? item.props.value : item);
	}

	render() {
		const {
			onChangeValue, // tslint:disable-line:no-unused-variable
			listSource, // tslint:disable-line:no-unused-variable
			...attributes
		} = this.props;
		const { typing, currListSource } = this.state;
		const styles = getStyles(this);

		return (
			<Input
				{...attributes}
				ref={input => this.input = input}
				style={styles.root}
				inputStyle={{ zIndex: 1 }}
				rightNode={typing ? (
					<Icon style={iconStyle} onClick={this.resetValue}>
						{"\uE10A"}
					</Icon>
				) : (
					<Icon style={iconStyle} onClick={this.resetValue}>
						&#xE721;
					</Icon>
				)}
				onChange={this.handleChange}
			>
				{currListSource && currListSource.length > 0 && (
					<ListView
						style={styles.listView}
						items={currListSource.map(itemNode => ({ itemNode }))}
						itemStyle={{
							fontSize: 12
						}}
						onChooseItem={this.handleChooseItem}
					/>
				)}
			</Input>
		);
	}
}

function getStyles(autoSuggestBox: AutoSuggestBox): {
	root?: React.CSSProperties;
	listView?: React.CSSProperties;
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
		}),
		listView: theme.prepareStyles({
			position: "absolute",
			width: "100%",
			top: "100%",
			left: 0,
			zIndex: 2,
			border: `1px solid ${theme.baseLow}`
		})
	};
}

export default AutoSuggestBox;
