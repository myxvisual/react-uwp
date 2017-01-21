import * as React from "react";

import { ThemeType } from "../../style/ThemeType";

const defaultProps: FloatNavProps = __DEV__ ? require("./devDefaultProps").default : { items: [], };

interface Item {
	image?: any;
	title?: string;
	href?: string;
	color?: string;
}
export interface DataProps {
	focusItem?: number;
	onFocusIndex?: (index: number) => void;
	topNode?: React.ReactNode;
	bottomNode?: React.ReactNode;
	isFloatRight?: boolean;
	items?: Item[];
	floatNavWidth?: number;
}
interface FloatNavProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface FloatNavState {
	focusItem?: number;
	hoverItem?: number;
	hoverIndexs?: boolean[];
}
export default class FloatNav extends React.Component<FloatNavProps, FloatNavState> {
	static defaultProps: FloatNavProps = {
		...defaultProps,
		onFocusIndex: () => {},
		width: 40,
		isFloatRight: false,
		floatNavWidth: 240,
	};
	state: FloatNavState = {
		focusItem: this.props.focusItem,
		hoverItem: null,
		hoverIndexs: [],
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	componentWillReceiveProps(nextProps: FloatNavProps) {
		this.setState({
			focusItem: nextProps.focusItem
		});
	}

	shouldComponentUpdate(nextProps: FloatNavProps, nextState: FloatNavState) {
		return nextProps !== this.props || nextState !== this.state;
	}

	focusIndex(focusItem: number) {
		this.setState({ focusItem });
	}

	getFocusIndex = () => this.state.focusItem

	getItems = () => this.props.items

	render() {
		const { items, onFocusIndex, topNode, bottomNode, isFloatRight, floatNavWidth, width, ...attributes } = this.props;
		const { theme } = this.context;
		const { focusItem, hoverItem, hoverIndexs } = this.state;
		const itemStyle = theme.prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			background: "#fff",
			transition: "all .25s 0s cubic-bezier(.04, .89, .44, 1.07)",
			fontSize: 12,
		});

		return (
			<div
				{...attributes}
				style={{ position: "relative", width }}
			>
				<div
					{...attributes}
					style={theme.prepareStyles({
						position: "aboslute",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: isFloatRight ? "flex-end" : "flex-start",
					})}
				>
					{React.Children.map(topNode, (child, index) => (
						<div
							key={`${index}`}
							// className={styles.icon}
							style={theme.prepareStyles({
								...itemStyle,
								width,
								height: width,
							})}
						>
							{child}
						</div>
					))}
					{items.map((item, index) => {
						const { image, color, title } = item;
						const isFirst = focusItem === index;
						const isHovered = hoverItem === index;
						const padding = Number.parseInt(width.toString()) / 2;
						return (
							<a
								onMouseEnter={(e) => {
									hoverIndexs[index] = true;
									this.setState({ hoverItem: index, hoverIndexs, });
								}}
								onMouseLeave={() => {
									hoverIndexs[index] = false;
									this.setState({ hoverItem: void(0), hoverIndexs, });
								}}
								onClick={() => { onFocusIndex(index); }}
								style={theme.prepareStyles({
									overflow: "hidden",
									display: "flex",
									flexDirection: `row${isFloatRight ? "" : "-reverse"}`,
									alignItems: "center",
									justifyContent: isHovered ? "space-between" : "center",
									boxSizing: "border-box",
									transition: "all .25s 0s ease-in-out",
									color: "inherit",
									textDecoration: "none",
									background: (isFirst || isHovered) ? color : "#fff",
									width: hoverIndexs[index] ? floatNavWidth : width,
									height: width,
								})}
								key={`${index}`}
							>
								{isHovered && <span style={{ color: "#fff", margin: `0 ${padding}px` }}>{title}</span>}
								<div
									style={theme.prepareStyles({
										transition: [
											"width cubic-bezier(.04, .89, .44, 1.07),",
											"opacity cubic-bezier(.04, .89, .44, 1.07),",
											"visibility cubic-bezier(.04, .89, .44, 1.07)"
										].join(""),
										width,
										height: padding,
										background: `url(${image}) no-repeat center center / contain`,
										filter: isHovered ? "brightness(100)" : void(0),
									})}
								/>
							</a>
						);
					})}
					{React.Children.map(bottomNode, (child, index) => (
						<div
							key={`${index}`}
							// className={styles.icon}
							style={theme.prepareStyles({
								...itemStyle,
								width,
								height: width,
							})}
						>
							{child}
						</div>
					))}
				</div>
			</div>
		);
	}
}
