import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  toastEls?: React.ReactElement<any>[];
}

export interface ToastWrapperProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ToastWrapperState {
  toastEls?: React.ReactElement<any>[];
}

export class ToastWrapper extends React.Component<ToastWrapperProps, ToastWrapperState> {
  state: ToastWrapperState = {
    toastEls: this.props.toastEls || []
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { style, className, toastEls, ...attributes } = this.props;
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
      this.state.toastEls && this.state.toastEls.length > 0 && (
        <div {...attributes} {...rootStyleClasses}>
          {toastEls.map((toastEl, key) => React.cloneElement(toastEl, { key }))}
        </div>
      )
    );
  }
}

export default ToastWrapper;
