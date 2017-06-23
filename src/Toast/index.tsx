import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import Icon from "../Icon";
import CustomAnimate, { slideRightInProps } from "../Animate/CustomAnimate";

export interface DataProps {
  /**
   * Set default show Toast.
   */
  defaultShow?: boolean;
  /**
   * Set custom `logo` with `ReactNode`.
   */
  logoNode?: React.ReactNode;
  /**
   * Set Toast title.
   */
  title?: string;
  /**
   * Set Toast description.
   */
  description?: string | string[];
  /**
   * Set Toast close after showed timeout.
   */
  closeDelay?: number;
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
  hiddenTimer: any;
  closeTimer: any;
  customAnimate: CustomAnimate;
  customAnimateElm: HTMLDivElement;

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
    this.customAnimateElm = findDOMNode(this.customAnimate) as HTMLDivElement;
    this.addCloseDelay();
  }

  addCloseDelay = () => {
    clearTimeout(this.closeTimer);
    const { closeDelay, onToggleShowToast } = this.props;
    if (closeDelay === void 0) {
      return;
    } else {
      this.closeTimer = setTimeout(() => {
        this.setState({ showToast: false });
        onToggleShowToast(false);
      }, closeDelay);
    }
  }

  componentDidUpdate() {
    this.context.theme.updateToast(this.toastID, this.trueRender());

    if (!this.customAnimateElm) {
      this.customAnimateElm = findDOMNode(this.customAnimate) as HTMLDivElement;
    }
    const { style } = this.customAnimateElm || {} as any;
    if (this.state.showToast && this.customAnimateElm && style) {
      Object.assign(style, {
        height: "auto",
        margin: "10px 0"
      });
      clearTimeout(this.hiddenTimer);
    } else if ((!this.state.showToast) && this.customAnimateElm && style) {
      this.hiddenTimer = setTimeout(() => {
      Object.assign(style, {
        height: "0px",
        margin: "0px"
      });
        clearTimeout(this.hiddenTimer);
      }, 250);
    }

    this.addCloseDelay();
  }

  componentWillUnmount() {
    const { deleteToast } = this.context.theme;
    deleteToast(this.toastID);

    clearTimeout(this.hiddenTimer);
    clearTimeout(this.closeTimer);
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
      logoNode,
      title,
      description,
      onToggleShowToast,
      closeDelay,
      showCloseIcon,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <CustomAnimate
        {...slideRightInProps}
        leaveStyle={slideRightInProps}
        appearAnimate={false}
        wrapperStyle={styles.wrapper}
        ref={customAnimate => this.customAnimate = customAnimate}
      >
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.card}>
          {logoNode}
          <span style={styles.descContent}>
            <p style={styles.title}>{title}</p>
            {typeof description === "string" ? (
              <p style={styles.description}>{description}</p>
            ) : (description && description.map((desc, index) => (
              <p style={styles.description} key={`${index}`}>
                {desc}
              </p>
            )))}
          </span>
        </div>
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
  wrapper?: React.CSSProperties;
  root?: React.CSSProperties;
  closeIcon?: React.CSSProperties;
  card?: React.CSSProperties;
  descContent?: React.CSSProperties;
  title?: React.CSSProperties;
  description?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style },
    state: { showToast }
  } = Toast;
  const { prepareStyles } = theme;

  return {
    wrapper: {
      display: "inherit",
      overflow: "hidden",
      transition: "transform .25s, opacity .25s",
      margin: "10px 0",
      opacity: showToast ? 1 : 0,
      transform: `translate3d(${showToast ? 0 : "100%"}, 0, 0)`
    },
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
      height: "auto",
      ...style
    }),
    closeIcon: {
      fontSize: 12,
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer"
    },
    card: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontSize: 18,
      lineHeight: 1.6
    }),
    descContent: {
      marginLeft: 10,
      width: "100%"
    },
    title: {
      fontSize: 14,
      color: theme.baseHigh,
      lineHeight: 1.6
    },
    description: {
      fontSize: 12,
      color: theme.baseMedium,
      lineHeight: 1.4
    }
  };
}

export default Toast;
