import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface AnimateProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AnimateState {}

export default class Animate extends React.Component<AnimateProps, AnimateState> {
  static defaultProps: AnimateProps = {};

  state: AnimateState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        Animate
      </div>
    );
  }
}

function getStyles(animate: Animate): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = animate;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      ...style
    })
  };
}
