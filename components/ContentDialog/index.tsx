import * as React from "react";

import Button from "../Button";
import RenderToBody from "../RenderToBody";
import IconButton from "../IconButton";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: ContentDialogProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	statuBarTitle?: string;
	title?: string;
	primaryButtonText?: string;
	secondaryButtonText?: string;
	showCloseButton?: boolean;
	show?: boolean;
	contentNode?: any;
}

interface ContentDialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface ContentDialogState {
	showDialog?: boolean;
}

export default class ContentDialog extends React.Component<ContentDialogProps, ContentDialogState> {
	static defaultProps: ContentDialogProps = {
		...defaultProps,
		statuBarTitle: "ContentDialog",
		title: "Delete file permanently?",
		content: "If you delete this file, you won't be able to recover it. Do you want to delete it?",
		primaryButtonText: "Delete",
		showCloseButton: true,
		secondaryButtonText: "Cancel"
	};

	state: ContentDialogState = { showDialog: this.props.show };
	refs: { renderToBody: RenderToBody };

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	getShowStatus = () => this.state.showDialog

	toggleShow = (showDialog?: boolean) => {
		if (typeof showDialog === "boolean") {
			if (showDialog !== this.state.showDialog) this.setState({ showDialog });
		} else {
			this.setState({
				showDialog: !this.state.showDialog
			});
		}
	}

	containerMouseEnterHandle = (e: React.MouseEvent<HTMLDivElement>) => {
		e.currentTarget.style.border = `1px solid ${this.context.theme.accent}`;
	}

	containerMouseLeaveHandle = (e: React.MouseEvent<HTMLDivElement>) => {
		e.currentTarget.style.border = `1px solid ${this.context.theme.baseLow}`;
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { statuBarTitle, title, primaryButtonText, secondaryButtonText, show, showCloseButton, content, contentNode, ...attributes } = this.props;
		const { showDialog } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<RenderToBody ref="renderToBody">
				<div
					{...attributes}
					style={{
						...styles.mask,
						...theme.prepareStyles(attributes.style),
					}}
				>
					<div
						style={styles.container}
						onMouseEnter={this.containerMouseEnterHandle}
						onMouseLeave={this.containerMouseLeaveHandle}
					>
						<div style={styles.statuBarTitle}>
							<p style={{ fontSize: 12, marginLeft: 8 }}>{statuBarTitle}</p>
							{showCloseButton
								?
								<IconButton
									onClick={() => { this.toggleShow(false); }}
									style={styles.iconButton}
									hoverStyle={{ background: "#d00f2a" }}
								>
									{"\uE894"}
								</IconButton>
								: null
							}
						</div>
						<div style={styles.content}>
							<div style={{ width: "100%" }}>
								<h5 style={styles.title}>{title}</h5>
								<p>{content}</p>
								{contentNode}
							</div>
							<div style={styles.buttonGroup}>
								<Button style={styles.button}>{primaryButtonText}</Button>
								<Button style={styles.button}>{secondaryButtonText}</Button>
							</div>
						</div>
					</div>
				</div>
			</RenderToBody>
		);
	}
}

function getStyles(contentDialog: ContentDialog): {
	mask?: React.CSSProperties;
	container?: React.CSSProperties;
	content?: React.CSSProperties;
	statuBarTitle?: React.CSSProperties;
	iconButton?: React.CSSProperties;
	title?: React.CSSProperties;
	buttonGroup?: React.CSSProperties;
	button?: React.CSSProperties;
} {
	const { context } = contentDialog;
	const { showDialog } = contentDialog.state;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		mask: prepareStyles({
			zIndex: 2000,
			opacity: showDialog ? 1 : 0,
			pointerEvents: showDialog ? "all" : "none",
			position: "fixed",
			top: 0,
			left: 0,
			width: "100vw",
			height: "100vh",
			fontSize: 14,
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			color: theme.baseHigh,
			background: theme.altMediumHigh,
			transition: `all .25s ${showDialog ? 0 : 0.25}s ease-in-out`,
		}),
		iconButton: {
			fontSize: 10,
			width: 40,
			height: 26,
		},
		container: prepareStyles({
			background: theme.altHigh,
			border: `1px solid ${theme.baseLow}`,
			flex: "0 0 auto",
			width: "80%",
			maxWidth: 720,
			cursor: "default",
			height: 240,
			transform: `scale(${showDialog ? 1 : 0})`,
			opacity: showDialog ? 1 : 0,
			transition: `all .5s ${showDialog ? 0.25 : 0}s ease-in-out`,
		}),
		content: prepareStyles({
			width: "100%",
			height: "calc(100% - 26px)",
			padding: 16,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "space-between",
		}),
		statuBarTitle: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		}),
		title: {
			fontSize: 18,
			lineHeight: 1,
			marginBottom: 16,
		},
		buttonGroup: prepareStyles({
			width: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		}),
		button: {
			width: "calc(50% - 2px)",
		},
	};
}
