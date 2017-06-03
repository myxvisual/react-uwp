import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  valueRatio?: number;
  isIndeterminate?: boolean;
}

export interface ProgressBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ProgressBarState {}

export class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {
  static defaultProps: ProgressBarProps = {};

  state: ProgressBarState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        ProgressBar
      </div>
    );
  }
}

function getStyles(progressBar: ProgressBar): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = progressBar;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}

export default ProgressBar;
