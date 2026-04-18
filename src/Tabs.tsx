import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tab, { DataProps as TabProps } from './Tabs.Tab';
import CustomAnimate from './Animate.CustomAnimate';

export { Tab, TabProps };

export interface DataProps {
  defaultFocusTabIndex?: number;
  tabTitleStyle?: React.CSSProperties;
  tabTitleFocusStyle?: React.CSSProperties;
  tabStyle?: React.CSSProperties;
  renderTitle?: (title?: string) => React.ReactNode;
  useAnimate?: boolean;
  animateMode?: "in" | "out" | "in-out";
  animateSpeed?: number;
  animateEnterStyle?: React.CSSProperties;
  animateLeaveStyle?: React.CSSProperties;
}
export interface TabsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const Tabs: React.FC<TabsProps> = ({
  renderTitle = (title: string) => title,
  useAnimate = true,
  animateMode = "in",
  animateSpeed = 500,
  animateEnterStyle = { transform: "translateX(0)", opacity: 1 },
  animateLeaveStyle = { transform: "translateX(100%)", opacity: 0 },
  defaultFocusTabIndex,
  tabTitleStyle,
  tabTitleFocusStyle,
  children,
  tabStyle,
  className,
  style,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const [tabFocusIndex, setTabFocusIndex] = useState(defaultFocusTabIndex || 0);
  const { theme } = context;

  // 同步defaultFocusTabIndex到state
  useEffect(() => {
    if (defaultFocusTabIndex !== undefined && defaultFocusTabIndex !== tabFocusIndex) {
      setTabFocusIndex(defaultFocusTabIndex);
    }
  }, [defaultFocusTabIndex, tabFocusIndex]);

  const childrenArray = React.Children.toArray(children);
  const tabs = childrenArray.filter((child: any) => child.type && (child.type === Tab || child.type.displayName === "Tab")) as Tab[];
  const currTab = tabs[tabFocusIndex];

  const inlineStyles = getStyles(theme, {
    tabTitleStyle,
    tabTitleFocusStyle,
    tabStyle,
    style
  });
  const styles = theme.prepareStyles({
    className: "tabs",
    styles: inlineStyles
  });

  const normalRender = (
    <div key={tabFocusIndex} style={styles.tabStyle.style} className={styles.tabStyle.className}>
      {currTab}
    </div>
  );

  return (
    <div
      {...attributes}
      style={styles.root.style}
      className={theme.classNames(styles.root.className, className)}
    >
      <div style={styles.titles.style} className={styles.titles.className}>
        {tabs.map((tab, index) => {
          const tabTitle = tab.props.title || `Tabs Items ${index + 1}`;
          return (
            <span
              style={index === tabFocusIndex ? styles.titleFocus.style : styles.title.style}
              className={index === tabFocusIndex ? styles.titleFocus.className : styles.title.className}
              key={index}
              onClick={() => setTabFocusIndex(index)}
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
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  tabTitleStyle?: React.CSSProperties;
  tabTitleFocusStyle?: React.CSSProperties;
  tabStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}) => {
  const { tabTitleStyle, tabTitleFocusStyle, tabStyle, style } = props;
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
};

Tabs.contextTypes = {
  theme: PropTypes.object
};

export default Tabs;
