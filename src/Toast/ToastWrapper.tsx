import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface ToastWrapperProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ToastWrapperState {
  toasts?: React.ReactElement<any>[];
}

export class ToastWrapper extends React.Component<ToastWrapperProps, ToastWrapperState> {
  state: ToastWrapperState = {
    toasts: []
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  addToast = (toast: React.ReactElement<any>) => {
    const { theme } = this.context;
    const { toasts } = this.state;
    const key = theme.toasts.length;
    theme.toasts.push(React.cloneElement(toast, { key }));
    this.setState({ toasts: theme.toasts });
  }

  updateToast = (toastId: number, toast: React.ReactElement<any>) => {
    const { theme } = this.context;
    theme.toasts[toastId] = React.cloneElement(toast, { key: toastId });
    this.setState({ toasts: theme.toasts });
  }

  render() {
    const { style, className, ...attributes } = this.props;
    const { toasts } = this.state;
    const { theme } = this.context;

    const rootStyleClasses = theme.prepareStyle({
      className: "toast-wrapper",
      style: theme.prefixStyle({
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
      }),
      extendsClassName: className
    });

    return (
      toasts && toasts.length > 0 && (
        <div {...attributes} {...rootStyleClasses}>
          {toasts}
        </div>
      )
    );
  }
}

export default ToastWrapper;
