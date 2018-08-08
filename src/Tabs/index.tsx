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
  /**
   * If true, will add animate to tabs in out.
   */
  useAnimate?: boolean;
  /**
   * Set tabs animate mode.
   */
  animateMode?: "in" | "out" | "in-out";
  /**
   * Set tabs animate speed.
   */
  animateSpeed?: number;
  /**
   * Set tab animate enter style.
   */
  animateEnterStyle?: React.CSSProperties;
  /**
   * Set tab animate leave style.
   */
  animateLeaveStyle?: React.CSSProperties;
}

export interface TabsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TabsState {
  tabFocusIndex?: number;
}

export class Tabs extends React.Component<TabsProps, TabsState> {
  static defaultProps: TabsProps = {
    renderTitle: (title: string) => title,
    useAnimate: true,
    animateMode: "in",
    animateSpeed: 500,
    animateEnterStyle: {
      transform: "translateX(0)",
      opacity: 1
    },
    animateLeaveStyle: {
      transform: "translateX(100%)",
      opacity: 0
    }
  };

  state: TabsState = {
    tabFocusIndex: this.props.defaultFocusTabIndex || 0
  };

  componentWillReceiveProps(nextProps: TabsProps) {
    const { defaultFocusTabIndex } = nextProps;
    const { tabFocusIndex } = this.state;
    if (defaultFocusTabIndex !== void 0 && defaultFocusTabIndex !== tabFocusIndex) {
      this.setState({
        tabFocusIndex: defaultFocusTabIndex
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
      useAnimate,
      animateMode,
      animateSpeed,
      animateEnterStyle,
      animateLeaveStyle,
      className,
      style,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { tabFocusIndex } = this.state;

    const childrenArray = React.Children.toArray(children);
    const isAvailableArray = childrenArray && childrenArray.length > 0;
    const tabs: Tab[] | false  = isAvailableArray && childrenArray.filter((child: any) => child.type && (child.type === Tab || child.type.displayName === "Tab")) as any;
    const currTab: Tab | false = tabs && tabs[tabFocusIndex];
    const tabTitle: string | false = currTab && currTab.props.title;

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "tabs",
      styles: inlineStyles
    });

    const normalRender = (
      <div key={`${tabFocusIndex}`} {...styles.tabStyle}>
        {currTab}
      </div>
    );

    return (
      <div
        {...attributes}
        style={styles.root.style}
        className={styles.root.className}
      >
        <div {...styles.titles}>
          {tabs && tabs.map((tab, index) => {
            const tabTitle = tab.props.title || `Tabs Items ${index + 1}`;
            return (
              <span
                {...(index === tabFocusIndex ? styles.titleFocus : styles.title)}
                key={`${index}`}
                onClick={() => this.setState({ tabFocusIndex: index })}
              >
                {renderTitle(tabTitle)}
              </span>
            );
          })}
        </div>
        {useAnimate ? (
          <CustomAnimate
            mode={animateMode}
            speed={animateSpeed}
            enterStyle={animateEnterStyle}
            leaveStyle={animateLeaveStyle}
            wrapperStyle={{ width: "100%", height: "100%", ...tabStyle }}
            appearAnimate={false}
          >
            {normalRender}
          </CustomAnimate>
        ) : normalRender}
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
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      color: theme.baseMediumHigh,
      display: "inline-block",
      verticalAlign: "middle",
      overflow: "hidden",
      ...style
    }),
    titles: prefixStyle({
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      width: "100%",
      overflow: "auto"
    }),
    title: prefixStyle({
      color: theme.baseHigh,
      borderBottom: `1px solid transparent`,
      fontWeight: "lighter",
      cursor: "pointer",
      fontSize: 18,
      padding: "4px 12px",
      transition: "all .25s",
      ...tabTitleStyle
    }),
    titleFocus: prefixStyle({
      color: theme.baseHigh,
      fontWeight: "lighter",
      cursor: "pointer",
      fontSize: 18,
      padding: "4px 12px",
      transition: "all .25s",
      ...tabTitleStyle,
      borderBottom: `2px solid ${theme.accent}`,
      ...tabTitleFocusStyle
    }),
    tabStyle: prefixStyle({
      width: "100%",
      height: "100%",
      ...tabStyle
    })
  };
}

export default Tabs;
