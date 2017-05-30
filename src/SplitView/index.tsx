import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface SplitViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SplitViewState {}

export default class SplitView extends React.Component<SplitViewProps, SplitViewState> {
  state: SplitViewState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={{
          ...styles.container,
          ...theme.prepareStyles(attributes.style)
        }}
      >
        SplitView
      </div>
    );
  }
}

function getStyles(splitView: SplitView): {
  container?: React.CSSProperties;
} {
  const { context } = splitView;
  const { theme } = context;
  // tslint:disable-next-line:no-unused-variable
  const { prepareStyles } = theme;

  return {
    container: {
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh
    }
  };
}
