import { useTheme } from './hooks/useTheme';
import * as React from "react";

export interface DataProps {
  /**
   * Direction of the separator.
   * row: horizontal line, column: vertical line.
   * @default "row"
   */
  direction?: "row" | "column";
  /**
   * If true, separator is disabled (lighter color).
   */
  disabled?: boolean;
}

export interface SeparatorProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class Separator extends React.Component<SeparatorProps> {
  static defaultProps: SeparatorProps = {
    direction: "row"
  };

  render() {
    const {
      direction,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    // Get all style classes in one call
    const cls = getCls(theme, this.props);

    return (
      <span
        {...attributes}
        className={cls.root}
      />
    );
  }
}

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: SeparatorProps) => {
  const { direction, style, className, disabled } = props;
  const isColumn = direction === "column";

  const rootStyle = {
    display: isColumn ? "inline-block" : "block",
    flex: "0 0 auto",
    width: isColumn ? 1 : "100%",
    height: isColumn ? "100%" : 1,
    background: disabled ? theme.baseMediumLow : theme.baseLow,
    margin: "0 auto",
    ...theme.prefixStyle(style)
  };

  const root = theme.prepareStyle(rootStyle, "separator");
  return {
    root: theme.classNames(root, className)
  };
};

export default Separator;
