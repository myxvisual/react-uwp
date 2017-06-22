import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import CustomAnimate, { slideRightInProps } from "../Animate/CustomAnimate";

export interface DataProps {
  /**
   * Set default show Toast.
   */
  defaultShow?: boolean;
  /**
   * Set onChange show Toast status `callback`.
   */
  onToggleShowToast?: (showToast?: boolean) => void;
  /**
   * Toggle show close `Icon`.
   */
  showCloseIcon?: boolean;
}

export interface ToastProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ToastState {
  showToast?: boolean;
}

const emptyFunc = () => {};
export class Toast extends React.Component<ToastProps, ToastState> {
  static defaultProps: ToastProps = {
    defaultShow: false,
    onToggleShowToast: emptyFunc,
    showCloseIcon: false
  };

  state: ToastState = {
    showToast: this.props.defaultShow
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  toastID: number;

  componentWillReceiveProps(nextProps: ToastProps) {
    const { defaultShow } = nextProps;
    if (defaultShow !== this.state.showToast) {
      this.setState({ showToast: defaultShow });
    }
  }

  componentDidMount() {
    const { theme } = this.context;
    this.toastID = theme.toasts.length;
    theme.addToast(this.trueRender());
  }

  componentDidUpdate() {
    this.context.theme.updateToast(this.toastID, this.trueRender());
  }

  componentWillUnmount() {
    const { deleteToast } = this.context.theme;
    deleteToast(this.toastID);
  }

  toggleShowToast = (showToast?: any) => {
    const { onToggleShowToast } = this.props;
    if (typeof showToast === "boolean") {
      if (showToast !== this.state.showToast) {
        this.setState({ showToast });
        onToggleShowToast(showToast);
      }
    } else {
      this.setState((prevState, prevProps) => {
        showToast = !prevState.showToast;
        onToggleShowToast(showToast);
        return { showToast };
      });
    }
  }

  trueRender = () => {
    const {
      children,
      defaultShow,
      onToggleShowToast,
      showCloseIcon,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <CustomAnimate
        {...slideRightInProps}
        appearAnimate
        wrapperStyle={{ display: "inherit" }}
      >
      <div
        {...attributes}
        style={styles.root}
      >
        {showCloseIcon && (
          <Icon
            style={styles.closeIcon}
            hoverStyle={{ color: theme.baseHigh }}
            onClick={() => this.toggleShowToast(false)}
          >
            ClearLegacy
          </Icon>
        )}
        {children}
      </div>
      </CustomAnimate>
    );
  }

  render() {
    return null as any;
  }
}

function getStyles(Toast: Toast): {
  root?: React.CSSProperties;
  closeIcon?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style },
    state: { showToast }
  } = Toast;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      width: 320,
      padding: 10,
      position: "relative",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.chromeLow,
      border: `1px solid ${theme.listLow}`,
      pointerEvents: "all",
      flex: "0 0 auto",
      overflow: "hidden",

      transition: showToast ? "transform .25s, opacity .25s, height 0s, margin 0s" : "transform .25s, opacity .25s, height 0s .25s, margin 0s .25s",
      opacity: showToast ? 1 : 0,
      margin: showToast ? "10px 0" : 0,
      transform: `translate3d(${showToast ? 0 : "100%"}, 0, 0)`,
      ...style,
      height: showToast ? (style ? (style.height || 120) : 120) : 0
    }),
    closeIcon: {
      fontSize: 12,
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer"
    }
  };
}

export default Toast;
