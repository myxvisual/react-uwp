import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  direction?: "row" | "column";
}

export interface SeparatorProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class Separator extends React.Component<SeparatorProps, void> {
  static defaultProps: SeparatorProps = {
    direction: "row"
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      direction,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <span
        {...attributes}
        style={styles.root}
      />
    );
  }
}

function getStyles(separator: Separator): {
  root?: React.CSSProperties;
} {
  const { context, props: { direction, style } } = separator;
  const { theme } = context;
  const { prepareStyles } = theme;
  const isColumn = direction === "column";

  return {
    root: prepareStyles({
      display: "inline-block",
      flex: "0 0 auto",
      width: isColumn ? 1 : "100%",
      height: isColumn ? "100%" : 1,
      background: theme.baseLow,
      margin: "0 auto",
      ...style
    })
  };
}

export default Separator;
