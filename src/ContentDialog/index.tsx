import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "../Button";
import IconButton from "../IconButton";
import RenderToBody from "../RenderToBody";

export interface DataProps {
  statusBarTitle?: string;
  title?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  secondaryButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showCloseButton?: boolean;
  show?: boolean;
  contentNode?: any;
  autoClose?: boolean;
}

export interface ContentDialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ContentDialogState {
  showDialog?: boolean;
}

export default class ContentDialog extends React.Component<ContentDialogProps, ContentDialogState> {
  static defaultProps: ContentDialogProps = {
    statusBarTitle: "ContentDialog",
    title: "Delete file permanently?",
    content: "If you delete this file, you won't be able to recover it. Do you want to delete it?",
    primaryButtonText: "Delete",
    secondaryButtonText: "Cancel",
    primaryButtonAction: () => {},
    secondaryButtonAction: () => {},
    showCloseButton: true
  };

  state: ContentDialogState = { showDialog: this.props.show };
  refs: { renderToBody: RenderToBody };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  getShowStatus = () => this.state.showDialog;

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
    const {
      statusBarTitle,
      title,
      primaryButtonText,
      secondaryButtonText,
      show,
      showCloseButton,
      content,
      contentNode,
      primaryButtonAction,
      secondaryButtonAction,
      autoClose,
      ...attributes
    } = this.props;
    const { showDialog } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <RenderToBody ref="renderToBody">
        <div
          {...attributes}
          style={styles.mask}
        >
          <div
            style={styles.container}
            onMouseEnter={this.containerMouseEnterHandle}
            onMouseLeave={this.containerMouseLeaveHandle}
          >
            <div style={styles.statusBarTitle}>
              <p style={{ fontSize: 12, marginLeft: 8 }}>{statusBarTitle}</p>
              {showCloseButton
                ?
                <IconButton
                  onClick={() => { this.toggleShow(false); }}
                  style={styles.iconButton}
                  hoverStyle={{ background: "#d00f2a", color: "#fff" }}
                >
                  {"\uE894"}
                </IconButton>
                : null
              }
            </div>
            <div style={styles.content}>
              <div style={{ width: "100%" }}>
                {title ? <h5 style={styles.title}>{title}</h5> : null}
                <p>{content}</p>
                {contentNode}
              </div>
              <div style={styles.buttonGroup}>
                <Button onClick={autoClose ? e => { this.toggleShow(false); primaryButtonAction(e); } : primaryButtonAction} style={styles.button}>{primaryButtonText}</Button>
                <Button onClick={autoClose ? e => { this.toggleShow(false); secondaryButtonAction(e); } : secondaryButtonAction} style={styles.button}>{secondaryButtonText}</Button>
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
  statusBarTitle?: React.CSSProperties;
  iconButton?: React.CSSProperties;
  title?: React.CSSProperties;
  buttonGroup?: React.CSSProperties;
  button?: React.CSSProperties;
} {
  const { context, props: { style } } = contentDialog;
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
      ...style
    }),
    iconButton: {
      fontSize: 10,
      width: 40,
      height: 26
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
      transition: `all .25s ${showDialog ? 0.25 : 0}s ease-in-out`
    }),
    content: prepareStyles({
      width: "100%",
      height: "calc(100% - 26px)",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    statusBarTitle: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    title: {
      fontSize: 18,
      lineHeight: 1,
      marginBottom: 16
    },
    buttonGroup: prepareStyles({
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    button: {
      width: "calc(50% - 2px)"
    }
  };
}
