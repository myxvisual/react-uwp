import * as React from "react";
import * as PropTypes from "prop-types";

import Tab, { DataProps as TabProps } from "./Tab";
import CustomAnimate, { slideRightInProps } from "../Animate/CustomAnimate";

export { Tab, TabProps };

export interface DataProps {
  /**
   * Set custom focus tab by index.
   */
  defaultFocusTabIndex?: number;
  /**
   * Set custom tab title style.
   */
  tabTitleStyle?: React.CSSProperties;
  /**
   * Set custom focused tab title style.
   */
  tabTitleFocusStyle?: React.CSSProperties;
  /**
   * Set every `Tab` style.
   */
  tabStyle?: React.CSSProperties;
  /**
   * Custom set render `Tab Title` method.
   */
  renderTitle?: (title?: string) => React.ReactNode;
}

export interface TabsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TabsState {
  tabFocusIndex?: number;
}

export class Tabs extends React.Component<TabsProps, TabsState> {
  static defaultProps: TabsProps = {
    renderTitle: (title: string) => title
  };

  state: TabsState = {
    tabFocusIndex: this.props.defaultFocusTabIndex || 0
  };

  componentWillReceiveProps(nextProps: TabsProps) {
    const { defaultFocusTabIndex } = nextProps;
    const { tabFocusIndex } = this.state;
    if (defaultFocusTabIndex !== void 0 && defaultFocusTabIndex !== tabFocusIndex) {
      this.setState({
        tabFocusIndex
      });
    }
  }

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      defaultFocusTabIndex,
      tabTitleStyle,
      tabTitleFocusStyle,
      children,
      tabStyle,
      renderTitle,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { tabFocusIndex } = this.state;
    const styles = getStyles(this);

    const childrenArray = React.Children.toArray(children);
    const isAvailableArray = childrenArray && childrenArray.length > 0;
    const tabs: Tab[] | false  = isAvailableArray && childrenArray.filter((child: any) => child.type === Tab) as any;
    const currTab: Tab | false = tabs && tabs[tabFocusIndex] as any;
    const tabTitle = currTab && currTab.props.title;

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.titles}>
          {tabs && tabs.map((tab, index) => (
            <span
              style={index === tabFocusIndex ? {
                ...styles.title,
                ...styles.titleFocus
              } : styles.title}
              key={`${index}`}
              onClick={() => this.setState({ tabFocusIndex: index })}
            >
              {renderTitle(tab.props.title || `Tabs Items ${index + 1}`)}
            </span>
          ))}
        </div>
        <CustomAnimate
          leaveStyle={{
            transform: "translateX(100%)",
            opacity: 1
          }}
          enterStyle={{
            transform: "translateX(0)",
            opacity: 1
          }}
          wrapperStyle={{ width: "100%", height: "100%" }}
          appearAnimate={false}
        >
        <div key={`${tabFocusIndex}`} style={styles.tabStyle}>
          {currTab}
        </div>
        </CustomAnimate>
      </div>
    );
  }
}

function getStyles(Tabs: Tabs): {
  root?: React.CSSProperties;
  titles?: React.CSSProperties;
  title?: React.CSSProperties;
  titleFocus?: React.CSSProperties;
  tabStyle?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      tabTitleStyle,
      tabTitleFocusStyle,
      tabStyle,
      style
    }
  } = Tabs;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      color: theme.baseMediumHigh,
      display: "inline-block",
      verticalAlign: "middle",
      overflow: "hidden",
      ...style
    }),
    titles: prepareStyles({
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      width: "100%",
      overflow: "auto"
    }),
    title: prepareStyles({
      color: theme.baseHigh,
      borderBottom: `1px solid transparent`,
      fontWeight: "lighter",
      cursor: "pointer",
      fontSize: 18,
      padding: 4,
      marginRight: 4,
      transition: "all .25s",
      ...tabTitleStyle
    }),
    titleFocus: prepareStyles({
      borderBottom: `2px solid ${theme.accent}`,
      ...tabTitleFocusStyle
    }),
    tabStyle: prepareStyles({
      width: "100%",
      height: "100%",
      ...tabStyle
    })
  };
}

export default Tabs;
