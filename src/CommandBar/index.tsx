import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import AppBarButton from "../AppBarButton";
import AppBarSeparator from "../AppBarSeparator";
import ListView from "../ListView";

export interface DataProps {
  /**
   * Root Container Style.
   */
  contentStyle?: React.CSSProperties;
  /**
   * CommandBar title.
   */
  content?: string;
  /**
   * CommandBar title node, if just string, can use `content`.
   */
  contentNode?: React.ReactNode;
  /**
   * `PrimaryCommands`, if item `type` is not `AppBarButton` or `AppBarButton`, will not render.
   */
  primaryCommands?: React.ReactElement<any>[];
  /**
   * `SecondaryCommands`, if item `type` is not `AppBarButton` or `AppBarButton`, will not render.
   */
  secondaryCommands?: React.ReactElement<any>[];
  /**
   * control `AppBarButton` label position.
   */
  labelPosition?: "right" | "bottom" | "collapsed";
  /**
   * if using `labelPosition` "bottom", this will control default open status.
   */
  expanded?: boolean;
  /**
   * `CommandBar` layout.
   */
  flowDirection?: "row-reverse" | "row";
  /**
   * set CommandBar to `minimal` size.
   */
  isMinimal?: boolean;
  /**
   * default is `top`, set `bottom` if your `CommandBar` in your app's bottom.
   */
  verticalPosition?: "top" | "bottom";
  /**
   * Set custom background.
   */
  background?: string;
}

export interface CommandBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CommandBarState {
  currExpanded?: boolean;
}

export class CommandBar extends React.Component<CommandBarProps, CommandBarState> {
  static defaultProps: CommandBarProps = {
    labelPosition: "bottom",
    verticalPosition: "top"
  };

  state: CommandBarState = {
    currExpanded: this.props.expanded
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  rootElm: HTMLDivElement;
  addBlurEvent = new AddBlurEvent();

  componentWillReceiveProps(nextProps: CommandBarProps) {
    const { expanded } = nextProps;
    if (this.state.currExpanded !== expanded) {
      this.setState({ currExpanded: expanded });
    }
  }

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.currExpanded,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        this.setState({
          currExpanded: false
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

  toggleExpanded = (currExpanded?: any) => {
    if (typeof currExpanded === "boolean") {
      if (currExpanded !== this.state.currExpanded) this.setState({ currExpanded });
    } else {
      this.setState((prevState, prevProps) => ({ currExpanded: !prevState.currExpanded }));
    }
  }

  render() {
    const {
      content,
      contentStyle,
      contentNode,
      labelPosition,
      primaryCommands,
      secondaryCommands,
      flowDirection,
      expanded,
      isMinimal,
      verticalPosition,
      background,
      ...attributes
    } = this.props;
    const { currExpanded } = this.state;
    const { theme } = this.context;
    const defaultHeight = isMinimal ? 24 : 48;
    const expandedHeight = 72;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "command-bar",
      styles: inlineStyles
    });

    return (
      <div {...styles.wrapper} ref={rootElm => this.rootElm = rootElm}>
        <div {...attributes} {...styles.root}>
          {(content !== void 0 || contentNode !== void 0) && (
            <div {...styles.content}>{content || contentNode}</div>
          )}
          <div {...styles.commands}>
            {(isMinimal && !currExpanded) || React.Children.toArray(primaryCommands).filter((child: any) => (
              child.type === AppBarButton || child.type === AppBarSeparator
            )).map((child: any, index: number) => (
              React.cloneElement(child, {
                labelPosition,
                key: index,
                style: child.type === AppBarSeparator ? {
                  height: 24
                } : void 0
              })
            ))}
            <AppBarButton
              labelPosition="bottom"
              style={inlineStyles.moreLegacy}
              iconStyle={{
                maxWidth: defaultHeight,
                height: defaultHeight,
                lineHeight: isMinimal ? (
                  expanded ? "48px" : "24px"
                ) : "48px" }}
              icon="MoreLegacy"
              onClick={this.toggleExpanded}
            />
            {secondaryCommands && (
              <ListView
                style={inlineStyles.secondaryCommands}
                listSource={secondaryCommands.map(itemNode => {
                  if (itemNode.type === AppBarSeparator) {
                    itemNode = React.cloneElement(itemNode, { direction: "row" });
                    return { itemNode, disabled: true, style: { padding: "0 8px" } };
                  }
                  return { itemNode, onClick: this.toggleExpanded };
                })}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function getStyles(commandBar: CommandBar): {
  wrapper?: React.CSSProperties;
  root?: React.CSSProperties;
  content?: React.CSSProperties;
  commands?: React.CSSProperties;
  moreLegacy?: React.CSSProperties;
  secondaryCommands?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      style,
      flowDirection,
      labelPosition,
      content,
      contentNode,
      contentStyle,
      primaryCommands,
      isMinimal,
      verticalPosition,
      background
    },
    state: { currExpanded }
  } = commandBar;
  const { prefixStyle } = theme;
  const inBottom = verticalPosition !== "top";
  const notChangeHeight = labelPosition !== "bottom";
  const haveContent = content || contentNode;
  const transition = "all .125s ease-in-out";
  const isReverse = flowDirection === "row-reverse";
  const defaultHeight = isMinimal ? 24 : 48;
  const expandedHeight = 72;
  let changedHeight: number;
  if (isMinimal) {
    changedHeight = currExpanded ? (notChangeHeight ? 48 : 72) : defaultHeight;
  } else {
    changedHeight = (currExpanded && !notChangeHeight && primaryCommands) ? expandedHeight : defaultHeight;
  }
  return {
    wrapper: theme.prefixStyle({
      height: inBottom ? "auto" : defaultHeight,
      display: "block",
      zIndex: currExpanded ? theme.zIndex.commandBar : void 0,
      ...style
    }),
    root: prefixStyle({
      position: "relative",
      display: "flex",
      flexDirection: flowDirection || (haveContent ? "row" : "row-reverse"),
      alignItems: "flex-start",
      justifyContent: haveContent ? "space-between" : "flex-start",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: background || (theme.useFluentDesign ? theme.listLow :  theme.altHigh),
      height: changedHeight,
      transition
    }),
    content: prefixStyle({
      height: defaultHeight,
      lineHeight: `${defaultHeight}px`,
      paddingLeft: 10,
      paddingRight: 10,
      ...contentStyle
    }),
    commands: prefixStyle({
      display: "flex",
      flexDirection: flowDirection,
      alignItems: "flex-start",
      height: "100%"
    }),
    moreLegacy: theme.prefixStyle({
      height: changedHeight,
      transition
    }),
    secondaryCommands: {
      width: "auto",
      maxWidth: 240,
      zIndex: theme.zIndex.commandBar,
      position: "absolute",
      right: isReverse ? void 0 : 0,
      left: isReverse ? 0 : void 0,
      top: inBottom ? void 0 : changedHeight,
      bottom: inBottom ? changedHeight : void 0,
      transform: `translate3d(0, ${currExpanded ? 0 : -8}px, 0)`,
      opacity: currExpanded ? 1 : 0,
      pointerEvents: currExpanded ? "all" : "none"
    }
  };
}

export default CommandBar;
