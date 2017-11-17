import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import RenderToBody from "../RenderToBody";

export interface DataProps {
  /**
   * Set Dialog show status.
   */
  defaultShow?: boolean;
  /**
   * If set true, click the mask background will not close dialog.
   */
  isControlled?: boolean;
  /**
   * Set custom content style.
   */
  contentStyle?: React.CSSProperties;
  /**
   * Set custom content enter style.
   */
  contentEnterStyle?: React.CSSProperties;
  /**
   * Set custom content leave style.
   */
  contentLeaveStyle?: React.CSSProperties;
  /**
   * Set onCloseDialog callback.
   */
  onCloseDialog?: () => void;
}
export interface DialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface DialogState {
  showDialog?: boolean;
}

export class Dialog extends React.Component<DialogProps, DialogState> {
  static defaultProps: DialogProps = {
    contentEnterStyle: { transform: "scale(1)" },
    contentLeaveStyle: { transform: "scale(0)" }
  };
  state: DialogState = {
    showDialog: this.props.defaultShow
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  renderToBody: RenderToBody;
  rootElm: HTMLDivElement;
  addBlurEvent = new AddBlurEvent();

  componentWillReceiveProps(nextProps: DialogProps) {
    const { defaultShow } = nextProps;
    if (this.state.showDialog !== defaultShow) {
      this.setState({ showDialog: defaultShow });
    }
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

  toggleShow = (showDialog?: boolean) => {
    if (typeof showDialog === "undefined") {
      this.setState((prevState, prevProps) => ({
        showDialog: prevState.showDialog
      }));
    } else {
      if (showDialog !== this.state.showDialog) this.setState({ showDialog });
    }
  }

  addBlurEventMethod = () => {
    const { onCloseDialog, isControlled } = this.props;
    this.addBlurEvent.setConfig({
      addListener: this.state.showDialog,
      clickIncludeElm: this.renderToBody.rootElm,
      blurCallback: () => {
        if (isControlled) return;
        this.setState({
          showDialog: false
        });
        if (onCloseDialog) onCloseDialog();
      },
      blurKeyCodes: [codes.esc]
    });
  }

  render() {
    const {
      contentStyle,
      contentEnterStyle,
      contentLeaveStyle,
      defaultShow,
      children,
      onCloseDialog,
      isControlled,
      style,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "dialog",
      styles: inlineStyles
    });

    return (
      <RenderToBody
        {...attributes}
        style={styles.root.style}
        ref={renderToBody => this.renderToBody = renderToBody}
        className={theme.classNames(styles.root.className, className)}
      >
        <div ref={rootElm => this.rootElm = rootElm} {...styles.content}>
          {children}
        </div>
      </RenderToBody>
    );
  }
}

function getStyles(dialog: Dialog) {
  const {
    context,
    state: { showDialog },
    props: {
      style,
      contentStyle,
      contentEnterStyle,
      contentLeaveStyle
    }
  } = dialog;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .25s",
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: theme.zIndex.contentDialog,
      ...style,
      pointerEvents: showDialog ? "all" : "none",
      opacity: showDialog ? 1 : 0
    }),
    content: prefixStyle({
      display: "inline-block",
      transition: "all .25s",
      ...contentStyle,
      ...(showDialog ? contentEnterStyle : contentLeaveStyle)
    })
  };
}

export default Dialog;
