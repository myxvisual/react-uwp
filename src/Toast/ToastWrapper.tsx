import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface ToastWrapperProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ToastWrapperState {
  toasts?: React.ReactNode[];
}

export class ToastWrapper extends React.Component<ToastWrapperProps, ToastWrapperState> {
  state: ToastWrapperState = {
    toasts: []
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  addToast = (toast: React.ReactNode) => {
    const { theme } = this.context;
    const { toasts } = this.state;
    theme.toasts.push(toast);
    this.setState({ toasts: theme.toasts });
  }

  updateToast = (toastID: number, toast: React.ReactNode) => {
    const { theme } = this.context;
    theme.toasts[toastID] = toast;
    this.setState({ toasts: theme.toasts });
  }

  render() {
    const { style, ...attributes } = this.props;
    const { toasts } = this.state;
    const { theme } = this.context;

    return (
      toasts && toasts.length > 0 ? (
        <div
          {...attributes}
          style={theme.prepareStyles({
            top: 0,
            right: 0,
            height: "100%",
            width: 360,
            padding: "10px 4px",
            position: "fixed",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            pointerEvents: "none",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: theme.zIndex.toast,
            ...style
          })}
        >
          {[toasts]}
        </div>
      ) : null
    );
  }
}
export default ToastWrapper;
