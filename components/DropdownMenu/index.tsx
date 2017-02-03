import * as React from "react";

import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: DropdownMenuProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	itemWidth?: number;
	itemHeight?: number;
	padding?: number;
	values?: string[];
	containerAttributes?: React.HTMLAttributes<HTMLDivElement>;
	itemAttributes?: React.HTMLAttributes<HTMLDivElement>;
	onChangeValue?: (value: string) => void;
}

interface DropdownMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface DropdownMenuState {
	showList?: boolean;
	currentValue?: string | string[];
	currentValues?: string[];
}

const emptyFunc = () => {};

export default class DropdownMenu extends React.Component<DropdownMenuProps, DropdownMenuState> {
	static defaultProps: DropdownMenuProps = {
		...defaultProps,
		itemWidth: 400,
		padding: 4,
		itemHeight: 50,
		onChangeValue: emptyFunc,
		containerAttributes: {
			onMouseEnter: emptyFunc,
			onMouseLeave: emptyFunc
		},
		itemAttributes: {
			onMouseEnter: emptyFunc,
			onMouseLeave: emptyFunc
		},
	};

	state: DropdownMenuState = {
		currentValue: this.props.defaultValue || this.props.values[0],
		currentValues: [...this.props.values]
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	toggleShowList = (e: React.SyntheticEvent<HTMLDivElement>) => {
		const { currentValues, showList } = this.state;
		const valueNode = e.currentTarget.children[0] as any;
		const currentValue = valueNode.innerText;
		if (showList) {
			currentValues.unshift(...currentValues.splice(currentValues.indexOf(currentValue), 1));
		}
		if (currentValue !== this.state.currentValue) {
			this.props.onChangeValue(currentValue);
		}
		this.setState({
			currentValue,
			showList: !showList,
			currentValues: showList ? currentValues : [...this.props.values]
		});
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { values, itemWidth, itemHeight, defaultValue, containerAttributes, itemAttributes, onChangeValue, padding, ...attributes } = this.props;
		const { showList, currentValue, currentValues } = this.state;
		const { theme } = this.context;

		return (
			<div {...attributes} style={theme.prepareStyles({ position: "relative", zIndex: 20, width: itemWidth, height: itemHeight, ...attributes.style })}>
				<div
					ref="container"
					style={theme.prepareStyles({
						position: "aboslute",
						top: 0,
						left: 0,
						color: theme.baseMediumHigh,
						background: theme.chromeLow,
						width: itemWidth,
						height: showList ? values.length * itemHeight + 40 : itemHeight + padding,
						overflow: "hidden",
						padding: showList ? "20px 0" : 0,
						transition: "all .25s 0s ease-in-out",
						border: `${showList ? "1px" : "2px"} solid ${theme.baseLow}`,
					})}
					onMouseEnter={!showList ? (e) => {
						e.currentTarget.style.border = `2px solid ${theme.baseHigh}`;
						containerAttributes.onMouseEnter(e);
					} : containerAttributes.onMouseEnter}
					onMouseLeave={!showList ? (e) => {
						e.currentTarget.style.border = `2px solid ${theme.baseLow}`;
						containerAttributes.onMouseLeave(e);
					} : containerAttributes.onMouseLeave}
				>
					{currentValues.map((value, index) => {
						const isCurrent = currentValue === value;
						return (
							<div
								style={theme.prepareStyles({
									width: itemWidth,
									height: itemHeight,
									background: isCurrent && showList ? theme.accentDarker2 : theme.chromeLow,
									display: "flex",
									padding: "0 8px",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								})}
								onClick={this.toggleShowList}
								onMouseEnter={!showList ? itemAttributes.onMouseEnter : (e) => {
									e.currentTarget.style.background = isCurrent ? theme.accentDarker1 : theme.chromeMediumLow;
									itemAttributes.onMouseEnter(e);
								}}
								onMouseLeave={!showList ? itemAttributes.onMouseLeave : (e) => {
									e.currentTarget.style.background = isCurrent ? theme.accentDarker2 : theme.chromeLow;
									itemAttributes.onMouseLeave(e);
								}}
								key={`${index}`}
							>
								<p>{value}</p>
								{!showList && isCurrent ? <Icon style={{ fontSize: itemHeight / 2 }}>&#xE011;</Icon> : null}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
