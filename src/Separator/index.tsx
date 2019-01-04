import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  direction?: "row" | "column";
  disabled?: boolean;
}

export interface SeparatorProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class Separator extends React.Component<SeparatorProps> {
  static defaultProps: SeparatorProps = {
    direction: "row"
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      direction,
      style,
      className,
      ...attributes
    } = this.props;
    const isColumn = direction === "column";
    const { theme } = this.context;

    const styleClasses = theme.prepareStyle({
      style: theme.prefixStyle({
        display: isColumn ? "inline-block" : "block",
        flex: "0 0 auto",
        width: isColumn ? 1 : "100%",
        height: isColumn ? "100%" : 1,
        background: theme.baseLow,
        margin: "0 auto",
        ...style
      }),
      className: "separator",
      extendsClassName: className
    });

    return (
      <span
        {...attributes}
        {...styleClasses}
      />
    );
  }
}

export default Separator;
