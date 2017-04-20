import * as React from "react";
import { ThemeType } from "react-uwp/src/styles/ThemeType";
import Icon from "react-uwp/src/controls/Icon";
import Tooltip from "react-uwp/src/controls/Tooltip";
import MarkdownRender from "./MarkdownRender";

import DoubleThemeRender from "./DoubleThemeRender";

export interface DataProps {
	code?: string;
	description?: string;
	doubleThemeStyle?: React.CSSProperties;
}

export interface CodeExampleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CodeExampleState {
	showCode?: boolean;
}

export default class CodeExample extends React.Component<CodeExampleProps, CodeExampleState> {
	state: CodeExampleState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	toggleShowCode = (showCode?: any) => {
		if (typeof showCode === "boolean") {
			if (showCode !== this.state.showCode) {
				this.setState({ showCode });
			}
		} else {
			this.setState((prevState, prevProps) => ({
				showCode: !prevState.showCode
			}));
		}
	}


	render() {
		const { title, code, description, children, doubleThemeStyle, ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);
		const { showCode } = this.state;
		const codeText = `\`\`\`js
${code}
\`\`\``;

		return (
			<div
				{...attributes}
				style={styles.root}
			>
				<div onClick={this.toggleShowCode} style={styles.title}>
					<h5>{title}</h5>
					<Tooltip
						style={{ width: 150 }}
						content={showCode ? "Hide Source Code" : "Show Source Code"}
						verticalPosition="bottom"
						horizontalPosition="left"
					>
						<Icon style={styles.icon}>
							{"\uE011"}
						</Icon>
					</Tooltip>
				</div>
				{codeText && <MarkdownRender style={styles.code} text={codeText} />}
				{description && <MarkdownRender style={styles.desc} text={description} />}
				<DoubleThemeRender themeStyle={doubleThemeStyle}>
					{children}
				</DoubleThemeRender>
			</div>
		);
	}
}

function getStyles(codeExample: CodeExample): {
	root?: React.CSSProperties;
	title?: React.CSSProperties;
	code?: React.CSSProperties;
	desc?: React.CSSProperties;
	icon?: React.CSSProperties;
} {
	const {
		context: { theme },
		props: { style },
		state: { showCode }
	} = codeExample;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			fontSize: 14,
			color: theme.baseMediumHigh,
			margin: "32px 0",
			borderLeft: `1px solid ${theme.accent}`,
			borderRight: `1px solid ${theme.accent}`,
			borderBottom: `1px solid ${theme.accent}`,
			...style
		}),
		title: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			width: "100%",
			fontSize: 18,
			color: theme.baseHigh,
			background: theme.accent,
			cursor: "pointer",
			padding: "12px 8px",
			...style
		}),
		code: prepareStyles({
			background: theme.altHigh,
			maxHeight: showCode ? 1400 : 0,
			overflow: "hidden",
			transition: "max-height .25s 0s",
			padding: "0px 4px",
			...style
		}),
		desc: prepareStyles({
			boxSizing: "border-box",
			padding: 8,
			...style
		}),
		icon: prepareStyles({
			transform: `rotateZ(${showCode ? "-180deg" : "0deg"})`,
			cursor: "pointer",
			transition: "all .25s 0s"
		})
	};
}
