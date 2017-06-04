import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "../Button";
import IconButton from "../IconButton";
import RenderToBody from "../RenderToBody";

export interface DataProps {
  /**
   * If set `statusBarTitle` to string, will render `StatusBar`.
   */
  statusBarTitle?: string;
  /**
   * default is `false`, is set close button show.
   */
  showCloseButton?: boolean;
  /**
   * ContentDialog `title`.
   */
  title?: string;
  /**
   * ContentDialog `content`.
   */
  content?: string;
  /**
   * ContentDialog `content Node`.
   */
  contentNode?: React.ReactNode;
  /**
   * primaryButton `text`.
   */
  primaryButtonText?: string;
  /**
   * secondaryButton `text`.
   */
  secondaryButtonText?: string;
  /**
   * controlled `ContentDialog` show.
   */
  defaultShow?: boolean;
  /**
   * closeButton `click callback`.
   */
  closeButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * primaryButton `click callback`.
   */
  primaryButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * secondaryButton `click callback`.
   */
  secondaryButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ContentDialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const emptyFunc = () => {};

export class ContentDialog extends React.Component<ContentDialogProps, void> {
  static defaultProps: ContentDialogProps = {
    primaryButtonText: "Delete",
    secondaryButtonText: "Cancel",
    closeButtonAction: emptyFunc,
    primaryButtonAction: emptyFunc,
    secondaryButtonAction: emptyFunc
  };
  refs: { renderToBody: RenderToBody };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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
      defaultShow,
      showCloseButton,
      content,
      contentNode,
      primaryButtonAction,
      secondaryButtonAction,
      closeButtonAction,
      ...attributes
    } = this.props;
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
            {statusBarTitle && <div style={styles.statusBarTitle}>
              <p style={{ fontSize: 12, lineHeight: "28x" }}>
                {statusBarTitle}
              </p>
              {showCloseButton
                ?
                <IconButton
                  onClick={closeButtonAction}
                  style={styles.iconButton}
                  hoverStyle={{ background: "#d00f2a", color: "#fff" }}
                  activeStyle={{ background: "#d00f2a", color: "#fff" }}
                >
                  {"\uE894"}
                </IconButton>
                : null
              }
            </div>}
            <div style={{ padding: 16, minHeight: 160 }}>
              {title ? <h5 style={styles.title}>{title}</h5> : null}
              {content && <p style={{ margin: 0 }}>{content}</p>}
            </div>
            {contentNode}
            <div style={styles.content}>
              <div style={styles.buttonGroup}>
                <Button onClick={primaryButtonAction} style={styles.button}>
                  {primaryButtonText}
                </Button>
                <Button onClick={secondaryButtonAction} style={styles.button}>
                  {secondaryButtonText}
                </Button>
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
  statusBarTitle?: React.CSSProperties;
  iconButton?: React.CSSProperties;
  title?: React.CSSProperties;
  content?: React.CSSProperties;
  buttonGroup?: React.CSSProperties;
  button?: React.CSSProperties;
} {
  const { context, props: { style, defaultShow } } = contentDialog;
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    mask: prepareStyles({
      lineHeight: 1.6,
      margin: 0,
      padding: 0,
      zIndex: 2000,
      opacity: defaultShow ? 1 : 0,
      pointerEvents: defaultShow ? "all" : "none",
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
      transition: `all .25s ${defaultShow ? 0 : 0.25}s ease-in-out`,
      ...style
    }),
    container: prepareStyles({
      background: theme.altHigh,
      border: `1px solid ${theme.baseLow}`,
      flex: "0 0 auto",
      width: "80%",
      maxWidth: 720,
      cursor: "default",
      transform: `scale(${defaultShow ? 1 : 0})`,
      opacity: defaultShow ? 1 : 0,
      transition: `all .25s ${defaultShow ? 0.25 : 0}s ease-in-out`
    }),
    statusBarTitle: prepareStyles({
      color: "#fff",
      background: theme.accent,
      height: 28,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 18
    }),
    iconButton: prepareStyles({
      color: "#fff",
      display: "flex",
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      width: 40,
      lineHeight: "28px",
      height: 28
    }),
    content: prepareStyles({
      boxSizing: "border-box",
      width: "100%",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    title: {
      fontWeight: 500,
      fontSize: 18,
      margin: 0
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

export default ContentDialog;
