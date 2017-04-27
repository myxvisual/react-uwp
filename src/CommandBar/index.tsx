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
   * CommandBar title node, if just string, can use `content`.
   */
  contentNode?: React.ReactNode;
  /**
   * `Commands`, if item `type` is not `AppBarButton` or `AppBarButton`, will not render that item.
   */
  primaryCommands?: React.ReactElement<any>[];
  secondaryCommands?: React.ReactElement<any>[];
  /**
   * control `AppBarButton` label position.
   */
  labelPosition?: "right" | "bottom" | "collapsed";
  /**
   * if using `labelPosition` "bottom", this will control default open status.
   */
  opened?: boolean;
  flowDirection?: "row-reverse" | "row";
}

export interface CommandBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CommandBarState {
  opened?: boolean;
}

export class CommandBar extends React.Component<CommandBarProps, CommandBarState> {
  static defaultProps: CommandBarProps = {
    content: void 0,
    flowDirection: "row",
    labelPosition: "bottom"
  };

  state: CommandBarState = {
    opened: this.props.opened
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  componentWillReceiveProps(nextProps: CommandBarProps) {
    const { opened } = nextProps;
    if (this.state.opened !== opened) {
      this.setState({ opened });
    }
  }

  toggleOpened = (opened?: any) => {
    if (typeof opened === "boolean") {
      if (opened !== this.state.opened) this.setState({ opened });
    } else {
      this.setState((prevState, prevProps) => ({ opened: !prevState.opened }));
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
      ...attributes
    } = this.props;
    const { opened } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        {(content !== void 0 || contentNode !== void 0) && (
          <div style={styles.content}>{content || contentNode}</div>
        )}
        <div style={styles.commands}>
          {React.Children.toArray(primaryCommands).filter((child: any) => (
            child.type === AppBarButton || child.type === AppBarSeparator
          )).map((child: any, index: number) => (
            React.cloneElement(child, { opened, labelPosition, key: index })
          ))}
          {labelPosition === "bottom" && (
            <AppBarButton
              labelPosition={labelPosition}
              icon="MoreLegacy"
              onClick={this.toggleOpened}
            />
          )}
        </div>
      </div>
    );
  }
}

function getStyles(commandBar: CommandBar): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
  commands?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      style,
      flowDirection,
      labelPosition,
      content,
      contentNode,
      contentStyle
    },
    state: { opened }
  } = commandBar;
  const { prepareStyles } = theme;
  const notChangeHeight = labelPosition !== "bottom";

  return {
    root: prepareStyles({
      display: "flex",
      flexDirection: flowDirection as any,
      alignItems: "flex-start",
      justifyContent: (content || contentNode) ? "space-between" : "flex-end",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altHigh,
      height: (opened && !notChangeHeight) ? 72 : 48,
      overflow: "hidden",
      transition: "all .125s ease-in-out",
      ...style
    }),
    content: prepareStyles({
      height: 48,
      lineHeight: "48px",
      paddingLeft: 10,
      ...contentStyle
    }),
    commands: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      height: "100%"
    })
  };
}

export default CommandBar;
