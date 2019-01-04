import * as React from "react";
import * as PropTypes from "prop-types";

import MenuItem from "./MenuItem";
export { MenuItem };

export interface DataProps {
  /**
   * Set ReactNode to Menu item.
   */
  children?: React.ReactNode[] | any;
  /**
   * Set Menu Item width.
   */
  menuItemWidth?: number;
  /**
   * Set Menu Item height.
   */
  menuItemHeight?: number;
  /**
   * Set Menu Item hovered style.
   */
  menuItemHoverStyle?: React.CSSProperties;
  /**
   * Set Menu Item expanded method.
   */
  expandedMethod?: "active" | "hover";
}

export interface MenuItemProps {
  /**
   * Set icon to Menu Item.
   */
  icon?: string;
  /**
   * Set label text to Menu Item.
   */
  label?: string;
  /**
   * Set Menu Item nested children.
   */
  children?: MenuItem | MenuItem[];
  /**
   * Set default expanded children.
   */
  defaultExpanded?: boolean;
  /**
   * Set Menu Item width.
   */
  itemWidth?: number;
  /**
   * Set Menu Item height.
   */
  itemHeight?: number;
  /**
   * Set Menu Item hovered style.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Set Menu Item expanded method.
   */
  expandedMethod?: "active" | "hover";
}

export interface AnyAttributes {
  [key: string]: any;
}

export interface MenuProps extends DataProps, AnyAttributes {}

export interface MenuState {}

export class Menu extends React.Component<MenuProps, MenuState> {
  static defaultProps: MenuProps = {
    menuItemHeight: 44,
    menuItemWidth: 240
  };

  state: MenuState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      menuItemWidth,
      menuItemHeight,
      menuItemHoverStyle,
      children,
      className,
      expandedMethod,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const styleClasses = theme.prepareStyle({
      className: "menu",
      style: styles.root,
      extendsClassName: className
    });

    return (
      <div
        {...attributes}
        {...styleClasses}
      >
        {children && React.Children.map(children, (child: any, index) => {
          return child.type === MenuItem ? React.cloneElement(child, {
            itemWidth: menuItemWidth,
            itemHeight: menuItemHeight,
            hoverStyle: menuItemHoverStyle,
            expandedMethod: expandedMethod
          }) : child;
        })}
      </div>
    );
  }
}

function getStyles(menu: Menu): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = menu;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      width: 240,
      color: theme.baseHigh,
      background: theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeLow,
      border: `1px solid ${theme.listLow}`,
      ...style
    })
  };
}

export default Menu;
