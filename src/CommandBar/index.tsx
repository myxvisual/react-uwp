import * as React from "react";
import * as PropTypes from "prop-types";

import AppBarButton from "../AppBarButton";
import AppBarSeparator from "../AppBarSeparator";
import ThemeType from "../styles/ThemeType";

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
   * `primaryCommands` layout.
   */
  flowDirection?: "row-reverse" | "row";
  isMinimal?: boolean;
}

export interface CommandBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CommandBarState {
  currExpanded?: boolean;
}

export class CommandBar extends React.Component<CommandBarProps, CommandBarState> {
  static defaultProps: CommandBarProps = {
    labelPosition: "bottom"
  };

  state: CommandBarState = {
    currExpanded: this.props.expanded
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  componentWillReceiveProps(nextProps: CommandBarProps) {
    const { expanded } = nextProps;
    if (this.state.currExpanded !== expanded) {
      this.setState({ currExpanded: expanded });
    }
  }

  toggleOpened = (currExpanded?: any) => {
    if (typeof currExpanded === "boolean") {
      if (currExpanded !== this.state.currExpanded) this.setState({ currExpanded });
    } else {
      this.setState((prevState, prevProps) => ({ currExpanded: !prevState.currExpanded }));
    }
  }

  render() {
    const {
      content,
      contentStyle, // tslint:disable-line:no-unused-variable
      contentNode,
      labelPosition,
      primaryCommands,
      secondaryCommands,
      flowDirection, // tslint:disable-line:no-unused-variable
      expanded,
      isMinimal,
      ...attributes
    } = this.props;
    const { currExpanded } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const defaultHeight = isMinimal ? 24 : 48;
    const expandedHeight = 72;

    return (
      <div style={styles.wrapper}>
        <div {...attributes} style={styles.root}>
          {(content !== void 0 || contentNode !== void 0) && (
            <div style={styles.content}>{content || contentNode}</div>
          )}
          <div style={styles.commands}>
            {(isMinimal && !currExpanded) || React.Children.toArray(primaryCommands).filter((child: any) => (
              child.type === AppBarButton || child.type === AppBarSeparator
            )).map((child: any, index: number) => (
              React.cloneElement(child, { labelPosition, key: index })
            ))}
            <AppBarButton
              labelPosition="bottom"
              style={styles.moreLegacy}
              iconStyle={{ maxWidth: defaultHeight, height: defaultHeight }}
              icon="MoreLegacy"
              onClick={this.toggleOpened}
            />
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
      isMinimal
    },
    state: { currExpanded }
  } = commandBar;
  const { prepareStyles } = theme;
  const notChangeHeight = labelPosition !== "bottom";
  const haveContent = content || contentNode;
  const defaultHeight = isMinimal ? 24 : 48;
  const expandedHeight = 72;
  const changedHeight = (currExpanded && !notChangeHeight && primaryCommands) ? expandedHeight : defaultHeight;

  return {
    wrapper: theme.prepareStyles({
      height: defaultHeight,
      display: "block",
      zIndex: currExpanded ? theme.zIndex.commandBar : void 0,
      ...style
    }),
    root: prepareStyles({
      display: "flex",
      flexDirection: flowDirection || (haveContent ? "row" : "row-reverse"),
      alignItems: "flex-start",
      justifyContent: haveContent ? "space-between" : "flex-start",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altHigh,
      height: changedHeight,
      overflow: "hidden",
      transition: "all .125s ease-in-out"
    }),
    content: prepareStyles({
      height: defaultHeight,
      lineHeight: `${defaultHeight}px`,
      paddingLeft: 10,
      ...contentStyle
    }),
    commands: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      height: "100%"
    }),
    moreLegacy: {
      height: expandedHeight
    }
  };
}

export default CommandBar;
