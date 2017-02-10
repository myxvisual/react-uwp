import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
import IconButton from "../IconButton";
import SplitViewCommand from "../SplitViewCommand";

const defaultProps: SplitViewProps = __DEV__ ? require("./devDefaultProps").default : {};

interface TNode {
	default?: any;
	opened?: any;
}
export interface DataProps {
	openedWidth?: number;
	initWidth?: number;
	defaultOpened?: boolean;
	topIcon?: any;
	topNodes?: Array<TNode>;
	bottomNodes?: Array<TNode>;
	overLay?: boolean;
}

interface SplitViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SplitViewState {
	opened?: boolean;
	focusNodeIndex?: number;
}

export default class SplitView extends React.Component<SplitViewProps, SplitViewState> {
	static defaultProps: SplitViewProps = {
		...defaultProps,
		openedWidth: 250,
		initWidth: 48,
		topIcon: <IconButton style={{ width: 48, height: 48 }}>{"\uE700"}</IconButton>,
		topNodes: [
			<SplitViewCommand label="Print" icon={"\uE2F6"} />
		],
		bottomNodes: [
			<SplitViewCommand label="Settings" icon={"\uE713"} /> ,
			<SplitViewCommand label="CalendarDay" icon={"\uE161"} />,
		],
		children: "Inside Component",
	};

	state: SplitViewState = {
		focusNodeIndex: void(0)
	};

	splitViewCommands: SplitViewCommand[] = [];

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
		const { topIcon, initWidth, topNodes, bottomNodes, openedWidth, overLay, children, ...attributes } = this.props;
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
				<div style={styles.pane} onClick={() => this.toggleOpened() }>
					<div style={styles.paneTop}>
						{topIcon}
						{topNodes.map((node, index) => {
							let currNode = node as any;
							if (node.default) currNode = node.default;
							if ("opened" in node && opened) currNode = node.opened;
							++nodeIndex;
							return React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex));
						})}
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
				<div>{children}</div>
			</div>
		);
	}
}

function getStyles(SplitView: SplitView): {
	root?: React.CSSProperties;
	pane?: React.CSSProperties;
	paneTop?: React.CSSProperties;
	paneBottom?: React.CSSProperties;
	view?: React.CSSProperties;
} {
	const {
		context,
		props: { initWidth, openedWidth, overLay },
		state: { opened }
	} = SplitView;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			display: "flex",
			flex: "0 0 auto",
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "flex-start",
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.chromeMedium,
			position: "relative",
			height: 400,
		}),
		pane: prepareStyles({
			flex: "0 0 auto",
			overflow: "hidden",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			justifyContent: "space-between",
			background: theme.altHigh,
			width: opened ? openedWidth : initWidth,
			height: "100%",
			transition: "all .25s 0s ease-in-out",
			...(overLay ? {
				position: "absolute",
				left: 0,
				top: 0,
			} : {}),
		}),
		paneTop: prepareStyles({
			width: "100%",
			flex: "0 0 auto",
		}),
		paneBottom: prepareStyles({
			width: "100%",
			flex: "0 0 auto",
		}),
	};
}
