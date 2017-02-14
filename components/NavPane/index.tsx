import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
import IconButton from "../IconButton";
import SplitViewCommand from "../SplitViewCommand";

const defaultProps: NavPaneProps = __DEV__ ? require("./devDefaultProps").default : {};

interface TNode {
	default?: any;
	opened?: any;
}
export interface DataProps {
	expandedWidth?: number;
	initWidth?: number;
	defaultOpened?: boolean;
	topIcon?: any;
	topNodes?: Array<TNode>;
	bottomNodes?: Array<TNode>;
	mode?: "Overlay" | "Compact" | "Inline";
	pageTitle?: string;
	position?: "left" | "right";
	paneStyle?: React.CSSProperties;
	paneViewStyle?: React.CSSProperties;
	background?: string;
	isTenFt?: boolean;
}

interface NavPaneProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface NavPaneState {
	opened?: boolean;
	focusNodeIndex?: number;
}

export default class NavPane extends React.Component<NavPaneProps, NavPaneState> {
	static defaultProps: NavPaneProps = {
		...defaultProps,
		expandedWidth: 320,
		initWidth: 48,
		topNodes: [
			<SplitViewCommand icon={"\uE716"} />,
			<SplitViewCommand label="Print" icon={"\uE2F6"} />,
		],
		bottomNodes: [
			<SplitViewCommand label="Settings" icon={"\uE713"} /> ,
			<SplitViewCommand label="CalendarDay" icon={"\uE161"} />,
		],
		pageTitle: "PageTitle",
		// background: "none",
		mode: "Compact",
		children: "Inside Component",
	};

	state: NavPaneState = {
		focusNodeIndex: void(0)
	};

	SplitViewCommands: SplitViewCommand[] = [];

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	toggleOpened = (opened?: boolean) => {
		if (typeof opened === "boolean" && opened !== this.state.opened) {
			this.setState({ opened });
		} else {
			this.setState((prevState, prevProps) => ({  opened: !prevState.opened }));
		}
	}

	getNewNodeProps = (currNode: any, index: number) => {
		const { onClick } = currNode.props;
		const { focusNodeIndex } = this.state;
		return {
			key: `${index}`,
			visited: focusNodeIndex === void(0) ? void(0) : focusNodeIndex === index,
			onClick: (e: any) => {
				this.setState({
					focusNodeIndex: index
				});
				if (onClick) onClick(e);
			},
		};
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { topIcon, initWidth, topNodes, bottomNodes, expandedWidth, children, position, paneStyle, paneViewStyle, mode, pageTitle, background, isTenFt, ...attributes } = this.props;
		const { theme } = this.context;
		const { opened, focusNodeIndex } = this.state;
		const styles = getStyles(this);
		let nodeIndex: number = -1;

		return (
			<div
				{...attributes}
				style={{
					...styles.root,
					...theme.prepareStyles(attributes.style),
				}}
			>
				<div style={styles.paneParent}>
					<div style={styles.pane}>
						<div style={styles.paneTop}>
							<div style={styles.topIcon}>
								{React.cloneElement(topIcon || (
									<IconButton
										style={{ fontSize: 16, width: 48, height: 48 }}
										hoverStyle={{ background: theme.baseLow }}
										activeStyle={{ background: theme.baseMediumLow }}
									>
										{"\uE700"}
									</IconButton>
								), {
									onClick: (e) => {
										this.toggleOpened();
										if (topIcon.onClick) topIcon.onclick(e);
									}
								})}
								<p style={theme.prepareStyles({ transition: "all 0.25s", opacity: (opened || mode === "Compact") ? 1 : 0 })}>
									{pageTitle}
								</p>
							</div>
							<div style={styles.paneTopItems}>
								{topNodes.map((node, index) => {
									let currNode = node as any;
									if (node.default) currNode = node.default;
									if ("opened" in node && opened) currNode = node.opened;
									++nodeIndex;
									return React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex));
								})}
							</div>
						</div>
						<div style={styles.paneBottom}>
							{bottomNodes.map((node, index) => {
								let currNode = node as any;
								if (node.default) currNode = node.default;
								if ("opened" in node && opened) currNode = node.opened;
								++nodeIndex;
								return React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex));
							})}
						</div>
					</div>
				</div>
				<div style={styles.paneView}>{children}</div>
			</div>
		);
	}
}

function getStyles(navPane: NavPane): {
	root?: React.CSSProperties;
	paneParent?: React.CSSProperties;
	paneView?: React.CSSProperties;
	topIcon?: React.CSSProperties;
	pane?: React.CSSProperties;
	paneTop?: React.CSSProperties;
	paneTopItems?: React.CSSProperties;
	paneBottom?: React.CSSProperties;
	view?: React.CSSProperties;
} {
	const {
		context,
		props: { initWidth, expandedWidth, mode, paneStyle, paneViewStyle, background },
		state: { opened }
	} = navPane;
	const isOverLay = mode === "Overlay";
	const isCompact = mode === "Compact";
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			display: "flex",
			flex: "0 0 auto",
			flexDirection: isCompact ? "column" : "row",
			alignItems: "flex-start",
			justifyContent: "flex-start",
			fontSize: 16,
			color: theme.baseMediumHigh,
			background: background || theme.chromeMedium,
			position: "relative",
		}),
		paneParent: prepareStyles({
			display: "flex",
			flex: "0 0 auto",
			width: opened ? expandedWidth : initWidth,
			transition: "all .25s 0s ease-in-out",
			height: isCompact ? initWidth : "100%",
			...(isOverLay ? {
				position: "absolute",
				left: 0,
				top: 0,
			} : {}),
		}),
		pane: prepareStyles({
			flex: "0 0 auto",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			justifyContent: "space-between",
			background: opened ? theme.altHigh : background || theme.altHigh,
			width: opened ? expandedWidth : (isCompact ? 0 : initWidth),
			height: "100%",
			transition: "width .25s 0s ease-in-out",
			...(isOverLay ? {
				position: "absolute",
				left: 0,
				top: 0,
			} : {}),
			...prepareStyles(paneStyle),
		}),
		topIcon: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "flex-start",
			background: (opened && !isCompact) ? theme.altHigh : background || theme.altHigh,
			width: isCompact ? "100vw" : (opened ? "100%" : 48),
		}),
		paneTop: prepareStyles({
			display: "flex",
			flexDirection: "column",
			width: "100%",
			flex: "0 0 auto",
		}),
		paneTopItems: prepareStyles({
			display: "flex",
			flexDirection: "column",
			flex: "0 0 auto",
			overflow: "hidden",
			width: opened ? "100%" : (isCompact ? 0 : initWidth),
		}),
		paneBottom: prepareStyles({
			display: "flex",
			flexDirection: "column",
			flex: "0 0 auto",
			overflow: "hidden",
			width: opened ? "100%" : (isCompact ? 0 : initWidth),
		}),
		paneView: prepareStyles({
			width: (isCompact || isOverLay) ? "100%" : `calc(100% - ${(opened && !isOverLay) ? expandedWidth : initWidth}px)`,
			position: isOverLay ? "absolute" : void(0),
			left: isOverLay ? 0 : void(0),
			...paneViewStyle,
		}),
	};
}
