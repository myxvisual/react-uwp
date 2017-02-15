import * as React from "react";

import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: TreeViewProps = __DEV__ ? require("./devDefaultProps").default : {
	listItems: []
};

interface List {
	titleNode?: string | React.ReactNode;
	expanded?: boolean;
	disable?: boolean;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	focus?: boolean;
	visited?: boolean;
	children?: List[];
}
export interface DataProps {
	listItems?: List[];
	iconDirection?: "left" | "right";
	listItemHeight?: number;
	titleNodeStyle?: React.CSSProperties;
	onChangeList?: (listItems: List[]) => void;
	rootStyle?: React.CSSProperties;
}
interface TreeViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface TreeViewState {
	currListItems?: List[];
	visitedList?: List;
}

export default class TreeView extends React.Component<TreeViewProps, TreeViewState> {
	static defaultProps: TreeViewProps = {
		...defaultProps,
		listItemHeight: 46,
		iconDirection: "left",
		onChangeList: () => {},
		rootStyle: { width: 400 }
	};

	state: TreeViewState = {
		currListItems: this.props.listItems,
		visitedList: null
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	clickHandel = (e: React.MouseEvent<HTMLDivElement>, list: List) => {
		list.expanded = !list.expanded;
		if (this.state.visitedList && !list.children) {
			this.state.visitedList.visited = false;
		}
		list.visited = true;
		this.setState({
			currListItems: this.state.currListItems,
			visitedList: list.children ? this.state.visitedList : list
		});
		this.props.onChangeList(this.state.currListItems);
		// const { style } = e.currentTarget;
		// if (style.height !== "auto") {
		// 	style.height = "auto";
		// 	style.padding = "0 0";
		// } else {
		// 	style.height = "0";
		// 	style.padding = "2px 0";
		// }
	}

	renderTree = (): React.ReactNode => {
		const { currListItems } = this.state;
		const { theme } = this.context;
		const { prepareStyles } = theme;
		const { iconDirection } = this.props;
		const isRight = iconDirection === "right";
		const styles = getStyles(this);
		const paddingValue = 40;
		const renderList = ((list: List, index: number, isChild?: boolean): React.ReactNode => {
			const { titleNode, expanded, disable, visited, children } = list;
			const haveChild = Array.isArray(children) && children.length !== 0;
			const fadeAccent = theme[theme.themeName === "Dark" ? "accentDarker1" : "accentLighter1"];
			return (
				<div
					style={{
						paddingLeft: isChild ? (isRight ? 10 : paddingValue) : void(0),
					}}
					key={`${index}`}
				>
					<div
						style={{
							cursor: disable ? "not-allowed" : "default",
							color: disable ? theme.baseLow : void(0),
							...styles.title,
						}}
						onMouseEnter={e => {
							const bgNode = e.currentTarget.querySelector(".react-uwp-treeview-bg") as HTMLDivElement;
							bgNode.style.background = (visited && !haveChild) ? theme.accent : theme.baseLow;
						}}
						onMouseLeave={e => {
							const bgNode = e.currentTarget.querySelector(".react-uwp-treeview-bg") as HTMLDivElement;
							bgNode.style.background = (visited && !haveChild) ? fadeAccent : "none";
						}}
						onClick={disable ? void(0) : (e) => {
							this.clickHandel(e, list);
						}}
					>
						<div style={{ paddingLeft: !haveChild ? 0 : 10, ...styles.titleNode }}>
							{titleNode}
						</div>
						<p>{haveChild && (
							<Icon
								style={prepareStyles({
									cursor: disable ? "not-allowed" : "pointer",
									color: disable ? theme.baseLow : void(0),
									width: isRight ? void(0) : 20,
									fontSize: 14,
									transform: `rotateZ(${expanded ? "-180deg" : (isRight ? "0deg" : "-90deg")})`,
								})}
							>
								{"\uE011"}
							</Icon>
						)}</p>
						<div
							style={prepareStyles({
								transition: "all 0.25s",
								zIndex: 0,
								background: (visited && !haveChild) ? fadeAccent : void(0),
								...styles.bg
							})}
							className="react-uwp-treeview-bg"
						/>
					</div>
					{haveChild && (
						<div
							style={{
								height: expanded ? "auto" : 0,
								overflow: expanded ? void(0) : "hidden",
								padding: expanded ? "1px 0" : 0,
								...styles.parent
							}}
						>
							{expanded && children.map((list: List[], index) => renderList(list, index, true))}
						</div>
					)}
				</div>
			);
		});

		return currListItems.map((list, index) => renderList(list, index));
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { listItems, iconDirection, listItemHeight, onChangeList, rootStyle, titleNodeStyle, ...attributes } = this.props;
		const { currListItems } = this.state;
		const styles = getStyles(this);

		return (
			<div {...attributes} style={styles.root}>
				{currListItems ? this.renderTree() : null}
			</div>
		);
	}
}

function getStyles(treeView: TreeView): {
	root?: React.CSSProperties;
	title?: React.CSSProperties;
	titleNode?: React.CSSProperties;
	parent?: React.CSSProperties;
	icon?: React.CSSProperties;
	bg?: React.CSSProperties;
} {
	const { context, props: { iconDirection, listItemHeight, style, titleNodeStyle } } = treeView;
	const isRight = iconDirection === "right";
	const { theme } = context;
	const { prepareStyles } = theme;
	return {
		root: prepareStyles({
			fontSize: 14,
			overflowX: "hidden",
			overflowY: "auto",
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
			padding: 20,
			...prepareStyles(style),
		}),
		title: prepareStyles({
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			width: "100%",
			position: "relative",
			fontSize: 14,
			display: "flex",
			height: listItemHeight,
			flexDirection: `row${isRight ? "" : "-reverse"}`,
			alignItems: "center",
			justifyContent: isRight ? "space-between" : "flex-end",
			transition: "all .25s 0s ease-in-out",
		}),
		titleNode: prepareStyles({
			zIndex: 1,
			width: "100%",
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			...titleNodeStyle,
		}),
		parent: prepareStyles({
			transition: "all .25s 0s ease-in-out",
		}),
		bg: {
			position: "absolute",
			top: 0,
			left: "-100%",
			width: "400%",
			height: "100%",
		}
	};
}
