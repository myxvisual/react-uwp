import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './Menu.MenuItem';
export { MenuItem };

export interface DataProps {
  children?: React.ReactNode[] | any;
  menuItemWidth?: number;
  menuItemHeight?: number;
  menuItemHoverStyle?: React.CSSProperties;
  expandedMethod?: "active" | "hover";
}
export interface MenuItemProps {
  icon?: string;
  label?: string;
  children?: MenuItem | MenuItem[];
  defaultExpanded?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  hoverStyle?: React.CSSProperties;
  expandedMethod?: "active" | "hover";
}
export interface AnyAttributes {
  [key: string]: any;
}
export interface MenuProps extends DataProps, AnyAttributes {}

const Menu: React.FC<MenuProps> = ({
  menuItemHeight = 44,
  menuItemWidth = 240,
  menuItemHoverStyle,
  children,
  className,
  expandedMethod,
  style,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const { theme } = context;
  const styles = getStyles(theme, { style });
  const classes = theme.prepareStyle({
    className: "menu",
    style: styles.root,
    extendsClassName: className
  });

  return (
    <div
      style={classes.style}
      className={classes.className}
      {...attributes}
    >
      {React.Children.map(children, (child: any, index) => {
        return child.type === MenuItem ? React.cloneElement(child, {
          itemWidth: menuItemWidth,
          itemHeight: menuItemHeight,
          hoverStyle: menuItemHoverStyle,
          expandedMethod: expandedMethod
        }) : child;
      })}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
}) => {
  const { style } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...theme.acrylicTexture60.style,
      width: 240,
      color: theme.baseHigh,
      border: `1px solid ${theme.listLow}`,
      ...style
    })
  };
};

Menu.contextTypes = {
  theme: PropTypes.object
};

export default Menu;
