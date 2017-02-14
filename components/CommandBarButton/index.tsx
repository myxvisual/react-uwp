import * as React from "react";

import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: CommandBarButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	icon?: string;
}

export interface CommandBarButtonProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface CommandBarButtonState {}

export default class CommandBarButton extends React.Component<CommandBarButtonProps, CommandBarButtonState> {
	static defaultProps: CommandBarButtonProps = {
		...defaultProps
	};

	state: CommandBarButtonState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { icon, label, ...attributes } = this.props;
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
				<Icon>{icon}</Icon>
				<p>{label}</p>
			</div>
		);
	}
}

function getStyles(commandBarButton: CommandBarButton): {
	root?: React.CSSProperties;
} {
	const { context } = commandBarButton;
	const { theme } = context;
	// tslint:disable-next-line:no-unused-variable
	const { prepareStyles } = theme;

	return {
		root: {
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
		},
	};
}
