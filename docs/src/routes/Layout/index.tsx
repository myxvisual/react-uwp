import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import * as README from "!raw!./README.md";

export interface DataProps {}

export interface LayoutProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface LayoutState {}

export default class Layout extends React.Component<LayoutProps, LayoutState> {
  static defaultProps: LayoutProps = {};

  state: LayoutState = {};

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
        <MarkdownRender text={README as any} />
      </div>
    );
  }
}

function getStyles(layout: Layout): {
  root?: React.CSSProperties;
 } {
  const {
    context:  { theme },
    props: { style }
  } = layout;
  const { prepareStyles } = theme;

  return {
    root:  prepareStyles({
      padding: 20,
      ...style
    })
  };
}

