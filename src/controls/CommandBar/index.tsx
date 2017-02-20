import * as React from "react";

import AppBarButton from "../AppBarButton";
import AppBarSeparator from "../AppBarSeparator";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: CommandBarProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	contentNode?: any;
	primaryCommands?: any[] | any;
	secondaryCommands?: any[] | any;
	defaultLabelPosition?: "Right" | "Left" | "Bottom" | "Top" | "Collapsed";
	mode?: "Compact" | "Minimal" | "Hidden";
	flowDirection?: "RightToLeft" | "LeftToRight";
}

interface CommandBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface CommandBarState {
	opened?: boolean;
}

export default class CommandBar extends React.Component<CommandBarProps, CommandBarState> {
	static defaultProps: CommandBarProps = {
		...defaultProps,
		contentNode: <p>Now playing...</p>,
		primaryCommands: [
			<AppBarButton icon="Shuffle" label="Shuffle" />,
			<AppBarButton icon="RepeatAll" label="Repeat" />,
			<AppBarSeparator />,
			<AppBarButton icon="Back" label="Back" />,
			<AppBarButton icon="Stop" label="Stop" />,
			<AppBarButton icon="Play" label="Play" />,
			<AppBarButton icon="Forward" label="Forward" />,
		],
		flowDirection: "LeftToRight",
		defaultLabelPosition: "Right",
	};

	state: CommandBarState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	toggleOpened = (opened?: boolean) => {
		if (typeof opened === "boolean") {
			if (opened !== this.state.opened) this.setState({ opened });
		} else {
			this.setState({
				opened: !this.state.opened
			});
		}
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { contentNode, defaultLabelPosition, primaryCommands, secondaryCommands, flowDirection, mode, ...attributes } = this.props;
		const { opened } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={styles.root}
			>
				{contentNode !== void 0 && (
					<div style={styles.content}>{contentNode}</div>
				)}
				<div style={styles.commands}>
					{React.Children.map(primaryCommands, (child: any, index) => (
						React.cloneElement(child, { opened, defaultLabelPosition })
					))}
					<AppBarButton
						opened={opened}
						defaultLabelPosition={defaultLabelPosition}
						icon="MoreLegacy"
						onClick={() => this.toggleOpened()}
					/>
				</div>
			</div>
		);
	}
}

function getStyles(commandBar: CommandBar): {
	root?: React.CSSProperties;
	content?: React.CSSProperties;
	commands?: React.CSSProperties;
} {
	const {
		context: { theme },
		props: { style, flowDirection, defaultLabelPosition },
		state: { opened }
	} = commandBar;
	const { prepareStyles } = theme;
	const LeftToRight = flowDirection === "LeftToRight";
	const isRight = defaultLabelPosition === "Right";

	return {
		root: prepareStyles({
			display: "flex",
			flexDirection: `row${LeftToRight ? "" : "-reverse"}`,
			alignItems: "flex-start",
			justifyContent: "space-between",
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altHigh,
			height: (opened && !isRight) ? 72 : 48,
			overflow: "hidden",
			transition: "all .125s 0s ease-in-out",
			...style,
		}),
		content: {
			height: 48,
			lineHeight: "48px",
		},
		commands: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "flex-start",
			height: "100%",
		}),
	};
}
