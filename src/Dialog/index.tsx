import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  show?: boolean;
  contentAttributes?: React.HTMLAttributes<HTMLDivElement>;
}
export interface DialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface DialogState {
  showDialog?: boolean;
}

export default class Dialog extends React.Component<DialogProps, DialogState> {
  state: DialogState = {
    showDialog: this.props.show
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: DialogProps) {
    const { show } = nextProps;
    this.setState({ showDialog: show });
  }

  shouldComponentUpdate(nextProps: DialogProps, nextState: DialogState) {
    return nextProps !== this.props || nextState !== this.state;
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

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { contentAttributes, show, children, ...attributes } = this.props;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={styles.root}>
        <div {...contentAttributes} style={contentAttributes.style}>
          {children}
        </div>
      </div>
    );
  }
}

function getStyles(dialog: Dialog): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
} {
  const { context, state: { showDialog }, props: { style, contentAttributes } } = dialog;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      pointerEvents: "all",
      ...style,
      visibility: showDialog ? "visible" : "hidden",
      opacity: showDialog ? 1 : 0
    }),
    content: prefixStyle({
      transition: "all .25s 0s ease-in-out",
      transform: `scale(${showDialog ? 1 : 0})`,
      ...contentAttributes.style
    })
  };
}

