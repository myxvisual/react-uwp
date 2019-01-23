import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import shallowEqual from "../common/shallowEqual";
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
  /**
   * callback run end close dialog.
   */
  onCloseDialog?: () => void;
  /**
   * Set custom background.
   */
  background?: string;
  /**
   * Set ContentDialog inside padding.
   */
  padding?: number;
}

export interface ContentDialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface ContentDialogState {
  showDialog?: boolean;
}

const emptyFunc = () => {};
const iconButtonHoverStyle = { background: "#d00f2a", color: "#fff" };

export class ContentDialog extends React.Component<ContentDialogProps, ContentDialogState> {
  static defaultProps: ContentDialogProps = {
    primaryButtonText: "Delete",
    secondaryButtonText: "Cancel",
    closeButtonAction: emptyFunc,
    primaryButtonAction: emptyFunc,
    secondaryButtonAction: emptyFunc,
    onCloseDialog: emptyFunc,
    padding: 16
  };

  state: ContentDialogState = {
    showDialog: this.props.defaultShow
  };
  addBlurEvent = new AddBlurEvent();

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  renderToBody: RenderToBody;
  rootElm: HTMLDivElement;

  shouldComponentUpdate(nextProps: ContentDialogProps, nextState: ContentDialogState) {
    const shouldUpdate = !shallowEqual(nextProps, this.props);
    if (shouldUpdate) {
      this.state.showDialog = nextProps.defaultShow;
    }
    return shouldUpdate;
  }

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.showDialog,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        this.setState({
          showDialog: false
        });
        this.props.onCloseDialog();
      },
      blurKeyCodes: [codes.esc]
    });
  }

  componentDidMount() {
    this.addBlurEventMethod();
  }

  componentDidUpdate() {
    this.addBlurEventMethod();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  containerMouseEnterHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = `1px solid ${this.context.theme.accent}`;
  }

  containerMouseLeaveHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = `1px solid ${this.context.theme.baseLow}`;
  }

  closeDialog = () => {
    this.setState({ showDialog: false });
    this.props.onCloseDialog();
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
      onCloseDialog,
      background,
      padding,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "content-dialog",
      styles: inlineStyles
    });

    return (
      <RenderToBody ref={renderToBody => this.renderToBody = renderToBody}>
        <div
          {...attributes}
          style={styles.mask.style}
          className={theme.classNames(styles.mask.className, className)}
        >
          <div
            ref={rootElm => this.rootElm = rootElm}
            {...styles.container}
            onMouseEnter={this.containerMouseEnterHandle}
            onMouseLeave={this.containerMouseLeaveHandle}
          >
            {statusBarTitle && <div {...styles.statusBar}>
              <p {...styles.statusBarTitle}>
                {statusBarTitle}
              </p>
              {showCloseButton
                ?
                <IconButton
                  onClick={closeButtonAction}
                  size={24}
                  style={inlineStyles.iconButton}
                  hoverStyle={iconButtonHoverStyle}
                  activeStyle={iconButtonHoverStyle}
                >
                  {"\uE894"}
                </IconButton>
                : null
              }
            </div>}
            <div {...styles.titleWrapper}>
              {title ? <h5 {...styles.title}>{title}</h5> : null}
              {content && <p>{content}</p>}
            </div>
            {contentNode}
            <div {...styles.content}>
              {(primaryButtonText || secondaryButtonText) && <div {...styles.buttonGroup}>
                {primaryButtonText && <Button
                  onClick={e => { primaryButtonAction(e), this.closeDialog(); }}
                  style={inlineStyles.button}
                >
                  {primaryButtonText}
                </Button>}
                {secondaryButtonText && <Button
                  onClick={e => { secondaryButtonAction(e), this.closeDialog(); }}
                  style={inlineStyles.button}
                >
                  {secondaryButtonText}
                </Button>}
              </div>}
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
  statusBar?: React.CSSProperties;
  statusBarTitle?: React.CSSProperties;
  iconButton?: React.CSSProperties;
  titleWrapper?: React.CSSProperties;
  title?: React.CSSProperties;
  content?: React.CSSProperties;
  buttonGroup?: React.CSSProperties;
  button?: React.CSSProperties;
} {
  const { context, props: {
    style,
    background,
    padding,
    primaryButtonText,
    secondaryButtonText
  }, state: { showDialog } } = contentDialog;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    mask: prefixStyle({
      lineHeight: 1.6,
      margin: 0,
      padding: 0,
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
    container: prefixStyle({
      background: background || (theme.useFluentDesign ? theme.acrylicTexture80.background : theme.altHigh),
      border: `1px solid ${theme.baseLow}`,
      flex: "0 0 auto",
      width: "80%",
      maxWidth: 720,
      cursor: "default",
      transform: `scale(${showDialog ? 1 : 0})`,
      opacity: showDialog ? 1 : 0,
      transition: `all .25s ${showDialog ? 0.25 : 0}s ease-in-out`
    }),
    statusBar: prefixStyle({
      color: "#fff",
      background: theme.accent,
      height: 28,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 18
    }),
    statusBarTitle: {
      fontSize: 12,
      lineHeight: "28x"
    },
    iconButton: prefixStyle({
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
    content: prefixStyle({
      boxSizing: "border-box",
      width: "100%",
      padding,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    titleWrapper: {
      padding,
      minHeight: 160
    },
    title: {
      fontWeight: 500,
      fontSize: 18,
      margin: 0
    },
    buttonGroup: prefixStyle({
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    button: {
      width: (primaryButtonText && secondaryButtonText) ? "calc(50% - 2px)" : "100%"
    }
  };
}

export default ContentDialog;
