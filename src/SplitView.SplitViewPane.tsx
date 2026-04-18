import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface SplitViewPaneProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class SplitViewPane extends React.Component<SplitViewPaneProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  rootElm: HTMLDivElement;

  render() {
    const { children, style, ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div
        {...attributes}
        style={theme.prefixStyle(style)}
        ref={rootElm => this.rootElm = rootElm}
      >
        {children}
      </div>
    );
  }
}

export default SplitViewPane;
