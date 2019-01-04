import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import Icon from "../Icon";
import PseudoClasses from "../PseudoClasses";

export interface DataProps {
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
  children?: MenuItem | MenuItem[] | React.ReactElement<any> | React.ReactElement<any> [];
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

export interface MenuItemProps extends DataProps, AnyAttributes {}

export interface MenuItemState {
  expanded?: boolean;
}

export class MenuItem extends React.Component<MenuItemProps, MenuItemState> {
  static defaultProps: MenuItemProps = {
    itemWidth: 240,
    itemHeight: 44,
    expandedMethod: "hover"
  };

  state: MenuItemState = {
    expanded: this.props.defaultExpanded
  };

  addBlurEvent = new AddBlurEvent();
  rootElm: HTMLDivElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: MenuItemProps) {
    const { defaultExpanded } = nextProps;
    const { expanded } = this.state;
    if (defaultExpanded !== void 0 && defaultExpanded !== expanded) {
      this.setState({ expanded: defaultExpanded });
    }
  }

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.expanded,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        this.setState({
          expanded: false
        });
      },
      blurKeyCodes: [codes.esc]
    });
  }

  componentDidMount() {
    this.addBlurEventMethod();
  }

  componentDidUpdate() {
    this.addBlurEventMethod();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  toggleExpanded = (expanded?: any) => {
    if (typeof expanded === "boolean") {
      if (expanded !== this.state.expanded) {
        this.setState({ expanded });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        expanded: !prevState.expanded
      }));
    }
  }

  render() {
    const {
      icon,
      label,
      itemWidth,
      itemHeight,
      children,
      defaultExpanded,
      className,
      hoverStyle,
      expandedMethod,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { expanded } = this.state;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "menu",
      styles: inlineStyles
    });
    const isHoverToggled = expandedMethod === "hover";

    const iconProps = {
      size: itemHeight,
      style: { fontSize: itemHeight / 3 }
    };

    return (
      <PseudoClasses
        {...attributes}
        className={theme.classNames(styles.root.className, className)}
        style={styles.root.style}
        onMouseEnter={isHoverToggled ? () => this.toggleExpanded(true) : void 0}
        onMouseLeave={isHoverToggled ? () => this.toggleExpanded(false) : void 0}
      >
      <div ref={rootElm => this.rootElm = rootElm}>
        <Icon {...iconProps}>
          {icon}
        </Icon>
        <span {...styles.label}>{label}</span>
        {children && (
          <Icon
            {...iconProps}
            style={{
              fontSize: itemHeight / 3,
              cursor: "pointer",
              pointerEvents: "all"
            }}
            onClick={isHoverToggled ? void 0 : this.toggleExpanded}
          >
            ScrollChevronRightLegacy
          </Icon>
        )}
        {children && (
          <div {...styles.child}>
            {children && React.Children.map(children, (child: any, index) => {
              return child.type === MenuItem ? React.cloneElement(child, {
                itemWidth,
                itemHeight,
                hoverStyle,
                expandedMethod
              }) : child;
            })}
          </div>
        )}
      </div>
      </PseudoClasses>
    );
  }
}

function getStyles(menuItem: MenuItem): {
  root?: React.CSSProperties;
  label?: React.CSSProperties;
  child?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      hoverStyle,
      children,
      style,
      itemWidth,
      itemHeight
    },
    state: { expanded }
  } = menuItem;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "default",
      height: itemHeight,
      fontSize: itemHeight / 3,
      lineHeight: `${itemHeight}px`,
      width: "100%",
      position: children ? "relative" : void 0,
      "&:hover": hoverStyle || {
        background: theme.listLow
      },
      ...style
    }),
    label: {
      width: itemWidth - itemHeight - (children ? itemHeight : 0),
      height: itemHeight,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    },
    child: prefixStyle({
      transform: `translate3d(${expanded ? 0 : `-${itemHeight}px`}, 0, 0)`,
      opacity: expanded ? 1 : 0,
      pointerEvents: expanded ? "all" : "none",
      transition: "all .25s",
      position: "absolute",
      top: -1,
      left: "100%",
      width: "100%",
      background: theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeLow,
      border: `1px solid ${theme.listLow}`
    })
  };
}

export default MenuItem;
