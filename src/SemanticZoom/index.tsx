import * as React from "react";
import * as PropTypes from "prop-types";

import SlideInOut from "../Animate/SlideInOut";

export interface DataProps {}

export interface SemanticZoomProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SemanticZoomState {
  showController?: boolean;
}

export default class SemanticZoom extends React.Component<SemanticZoomProps, SemanticZoomState> {
  state: SemanticZoomState = {
    showController: false
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  toggleShowController = (showController?: boolean) => {
    if (typeof showController === "boolean" && showController !== this.state.showController) {
      this.setState({ showController });
    } else {
      this.setState((prevState, prevProps) => ({
        showController: prevState.showController
      }));
    }
  }

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { showController } = this.state;
    const styles = getStyles(this);

    return (
      <SlideInOut
        {...attributes as any}
        style={styles.root}
      >
        {showController ? (
          <div key={`${showController}`}>
            SemanticZoomController
          </div>) : (
          <div key={`${showController}`}>
            SemanticZoomView
          </div>
        )}
      </SlideInOut>
    );
  }
}

function getStyles(semanticZoom: SemanticZoom): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = semanticZoom;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}
