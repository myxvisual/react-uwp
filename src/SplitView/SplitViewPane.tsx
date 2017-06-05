import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface SplitViewPaneProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class SplitViewPane extends React.Component<SplitViewPaneProps, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { children, style, ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div
        {...attributes}
        style={theme.prepareStyles(style)}
      >
        {children}
      </div>
    );
  }
}

export default SplitViewPane;
