import * as React from "react";
import * as PropTypes from "prop-types";

import Tab, { DataProps as TabProps } from "./Tab";

export interface DataProps {
  tabTitleStyle?: React.CSSProperties;
  tabTitleFocusStyle?: React.CSSProperties;
}

export interface TabsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TabsState {
  tabFocusIndex?: number;
}

export class Tabs extends React.Component<TabsProps, TabsState> {
  static defaultProps: TabsProps = {};

  state: TabsState = {};

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
        Tabs
      </div>
    );
  }
}

function getStyles(Tabs: Tabs): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = Tabs;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      display: "inline-block",
      verticalAlign: "middle",
      overflow: "hidden",
      ...style
    })
  };
}

export default Tabs;
