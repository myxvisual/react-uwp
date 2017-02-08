import * as React from "react";

import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: TreeViewProps = __DEV__ ? require("./devDefaultProps").default : {
	listItems: []
};

interface List {
	titleNode?: string | React.ReactNode;
	expanded?: boolean;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	children?: List[];
}
export interface DataProps {
	listItems?: List[];
	iconDirection?: "left" | "right";
	listItemHeight?: number;
	onChangeList?: (listItems: List[]) => void;
	rootStyle?: React.CSSProperties;
}
interface TreeViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface TreeViewState {
	currListItems?: List[];
}
export default class TreeView extends React.Component<TreeViewProps, TreeViewState> {
	static defaultProps: TreeViewProps = {
		...defaultProps,
		listItemHeight: 28,
		iconDirection: "left",
		onChangeList: () => {},
		rootStyle: { width: 400 }
	};

	state: TreeViewState = {
		currListItems: this.props.listItems
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	clickHandel = (e: React.MouseEvent<HTMLDivElement>, list: List) => {
		list.expanded = !list.expanded;
		this.setState({
			currListItems: this.state.currListItems
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
		const { theme: { prepareStyles } } = this.context;
		const { iconDirection, listItemHeight } = this.props;
		const isRight = iconDirection === "right";
		const styles = getStyles(this);
		const renderList = ((list: List, index: number, isChild?: boolean): React.ReactNode => {
			const { titleNode, expanded, disabled, children } = list;
			const havedChild = Array.isArray(children) && children.length !== 0;
			return (
				<div
					style={{
						paddingLeft: isChild ? (isRight ? 20 : 40) : void(0),
					}}
					key={`${index}`}
				>
					<div
						style={styles.title}
						onClick={(e) => {
							this.clickHandel(e, list);
						}}
					>
						<div>{titleNode}</div>
						<p>{havedChild && (
							<Icon
								style={prepareStyles({
									cursor: "pointer",
									fontSize: 14,
									transform: `rotateZ(${expanded ? "-180deg" : (isRight ? "0deg" : "-90deg")})`,
									marginRight: isRight ? void(0) : 12
								})}
							>
								{"\uE011"}
							</Icon>
						)}</p>
					</div>
					{havedChild && (
						<div
							style={{
								height: expanded ? listItemHeight : 0,
								overflow: expanded ? void(0) : "hidden",
								padding: expanded ? "2px 0" : 0,
							...styles.parent
							}}
						>
							{children.map((list: List[], index) => renderList(list, index, true))}
						</div>
					)}
				</div>
			);
		});

		return currListItems.map((list, index) => renderList(list, index));
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { listItems, iconDirection, listItemHeight, onChangeList, rootStyle, ...attributes } = this.props;
		const { currListItems } = this.state;
		const styles = getStyles(this);

		return (
			<div {...attributes} style={{ ...styles.root, ...attributes.style }}>
				{currListItems ? this.renderTree() : null}
			</div>
		);
	}
}

function getStyles(treeView: TreeView): {
	root?: React.CSSProperties;
	title?: React.CSSProperties;
	parent?: React.CSSProperties;
	icon?: React.CSSProperties;
} {
	const { context, props: { iconDirection, listItemHeight, rootStyle } } = treeView;
	const isRight = iconDirection === "right";
	const { theme } = context;
	const { prepareStyles } = theme;
	return {
		root: {
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
			padding: 12,
			...prepareStyles(rootStyle),
		},
		title: prepareStyles({
			height: listItemHeight,
			fontSize: 14,
			cursor: "pointer",
			display: "flex",
			flexDirection: `row${isRight ? "" : "-reverse"}`,
			alignItems: "center",
			justifyContent: isRight ? "space-between" : "flex-end",
		}),
		parent: prepareStyles({
			transition: "all .25s 0s ease-in-out",
		})
	};
}
