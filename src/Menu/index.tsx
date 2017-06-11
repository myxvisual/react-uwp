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
  defaultShowChild?: boolean;
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
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        {children && React.Children.map(children, (child: any, index) => (
          child.type === Menu ? React.cloneElement(child, {
            itemWidth: menuItemWidth,
            itemHeight: menuItemHeight,
            hoverStyle: menuItemHoverStyle
          }) : child
        ))}
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
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      width: 240,
      color: theme.baseHigh,
      background: theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeLow,
      border: `1px solid ${theme.listLow}`,
      ...style
    })
  };
}

export default Menu;
