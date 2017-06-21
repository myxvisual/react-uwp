import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import Icon from "../Icon";
import ElementState from "../ElementState";

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
    itemHeight: 44
  };

  state: MenuItemState = {
    expanded: this.props.defaultExpanded
  };

  addBlurEvent = new AddBlurEvent();
  elementState: ElementState;

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
      clickExcludeElm: this.elementState.rootElm,
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
      hoverStyle,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { expanded } = this.state;
    const styles = getStyles(this);

    const iconProps = {
      size: itemHeight,
      style: { fontSize: itemHeight / 3 }
    };

    return (
      <ElementState
        {...attributes}
        style={styles.root}
        hoverStyle={hoverStyle || {
          background: theme.listLow
        }}
        ref={(elementState) => this.elementState = elementState}
      >
      <div>
        <Icon {...iconProps}>
          {icon}
        </Icon>
        <span style={styles.label}>{label}</span>
        {children && (
          <Icon
            {...iconProps}
            style={{
              fontSize: itemHeight / 3,
              cursor: "pointer",
              pointerEvents: "all"
            }}
            onClick={this.toggleExpanded}
          >
            ScrollChevronRightLegacy
          </Icon>
        )}
        {children && (
          <div style={styles.child}>
            {children}
          </div>
        )}
      </div>
      </ElementState>
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
      children,
      style,
      itemWidth,
      itemHeight
    },
    state: { expanded }
  } = menuItem;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "default",
      height: itemHeight,
      fontSize: itemHeight / 3,
      lineHeight: `${itemHeight}px`,
      width: "100%",
      position: children ? "relative" : void 0,
      ...style
    }),
    label: {
      width: itemWidth - itemHeight - (children ? itemHeight : 0),
      height: itemHeight,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    },
    child: prepareStyles({
      transform: `translate3d(${expanded ? 0 : `-${itemHeight}px`}, 0, 0)`,
      opacity: expanded ? 1 : 0,
      pointerEvents: expanded ? "all" : "none",
      transition: "all .25s",
      position: "absolute",
      top: 0,
      left: "98%",
      width: "100%",
      background: theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeLow,
      border: `1px solid ${theme.listLow}`
    })
  };
}

export default MenuItem;
