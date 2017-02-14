import * as React from "react";

import Icon from "../Icon";
import CommandBarButton from "../CommandBarButton";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: CommandBarProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	defaultLabelPosition?: "Right" | "Left" | "Bottom" | "Top";
	contentNode?: any;
	mode?: "Compact" | "Minimal" | "Hidden";
}

interface CommandBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface CommandBarState {}

export default class CommandBar extends React.Component<CommandBarProps, CommandBarState> {
	static defaultProps: CommandBarProps = {
		...defaultProps,
		contentNode: <p>Now playing...</p>
	};

	state: CommandBarState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { contentNode, defaultLabelPosition, mode, ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.root,
					...theme.prepareStyles(attributes.style),
				}}
			>
				<div>{contentNode}</div>
				<div>
					<CommandBarButton icon="Back" label="Back" />
					<Icon>More</Icon>
				</div>
			</div>
		);
	}
}

function getStyles(commandBar: CommandBar): {
	root?: React.CSSProperties;
} {
	const { context, props: { style } } = commandBar;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
			padding: "0 8px",
			height: 50,
			...style,
		}),
	};
}
