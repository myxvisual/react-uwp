import * as React from "react";
import * as PropTypes from "prop-types";

import PseudoClasses from "../PseudoClasses";
import RevealEffect, { RevealEffectProps } from "../RevealEffect";
import Separator from "../Separator";
import AppBarSeparator from "../AppBarSeparator";

export interface ListItem {
  /**
   * set react node to item.
   */
  itemNode?: React.ReactNode;
  /**
   * set to disabled.
   */
  disabled?: boolean;
  /**
   * set to focused.
   */
  focus?: boolean;
  /**
   * set to style to item node.
   */
  style?: React.CSSProperties;
  /**
   * add onClick event callback.
   */
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

export interface DataProps {
  /**
   * ListSource Data.
   */
  listSource?: ListItem[] | React.ReactNode[];
  /**
   * `listItemStyle` will applied to all listItem.
   */
  listItemStyle?: React.CSSProperties;
  /**
   * onChoose ListItem `callback`.
   */
  onChooseItem?: (itemIndex?: number) => void;
  /**
   * default focus List Item by `Index`.
   */
  defaultFocusListIndex?: number;
  /**
   * Set Custom Background.
   */
  background?: string;
  /**
   * Set RevealEffect, check the styles/reveal-effect.
   */
  revealConfig?: RevealEffectProps;
  /**
   * Set reveal-effect enable resize event.
   */
  enableResizeObserver?: boolean;
}

export interface ListViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ListViewState {
  focusIndex?: number;
}

const emptyFunc = () => {};
export class ListView extends React.Component<ListViewProps, ListViewState> {
  static defaultProps: ListViewProps = {
    onChooseItem: emptyFunc,
    revealConfig: { effectRange: "self" }
  };

  state: ListViewState = {
    focusIndex: this.props.defaultFocusListIndex
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  rootElm: HTMLDivElement;
  styles: {
    [key: string]: React.CSSProperties;
  } = null;

  componentWillReceiveProps(nextProps: ListViewProps) {
    if (nextProps.defaultFocusListIndex !== this.state.focusIndex) {
      this.setState({ focusIndex: nextProps.defaultFocusListIndex });
    }
  }

  getItemNode = (itemNode: any, index: number, disabled?: boolean, focus?: boolean, style?: React.CSSProperties, onClick?: () => void) => {
    const { revealConfig, enableResizeObserver } = this.props;
    const { styles } = this;
    const { theme } = this.context;
    const { onChooseItem, background } = this.props;
    const { focusIndex } = this.state;
    const isFocus = focus || focusIndex === index;
    const defaultBG = isFocus ? theme.listAccentLow : "none";

    const classes = theme.prepareStyle({
      className: "list-view-item",
      style: theme.prefixStyle({
        ...styles.item,
        flex: "0 0 auto",
        position: "relative",
        background: defaultBG,
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
        color: disabled ? theme.baseLow : theme.baseHigh,
        ...(isFocus ? theme.acrylicTexture40.style : theme.acrylicTexture60.style),
        "&:hover": {
          ...(isFocus ? theme.acrylicTexture20.style : theme.acrylicTexture60.style),
        },
        "&:active": {
          transform: "scale(0.99)"
        },
        ...style
      })
    });
    const isSeparator = itemNode && typeof itemNode === "object" && (
      itemNode.type === Separator || itemNode.type === AppBarSeparator
    );

    return (
      <PseudoClasses {...classes} key={`${index}`}>
        <div
          onClick={onClick}
          onMouseDown={disabled ? void 0 : e => {
            onChooseItem(index);
          }}
        >
          {itemNode}
        {!isSeparator && <RevealEffect {...revealConfig} />}
        </div>
      </PseudoClasses>
    );
  }

  render() {
    const {
      listSource,
      listItemStyle,
      onChooseItem,
      background,
      defaultFocusListIndex,
      revealConfig,
      enableResizeObserver,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      className: "list-view",
      styles
    });
    this.styles = styles;

    const listSourceAny: any = listSource;

    return (
      <div
        ref={rootElm => this.rootElm = rootElm}
        {...attributes}
        {...classes.root}
      >
        {listSourceAny && listSourceAny.map((listItem: any, index: number) => {
          if (React.isValidElement(listItem)) {
            const props: any = listItem.props;
            const { disabled, focus, style, onClick } = props;
            return this.getItemNode(listItem, index, disabled, focus, style, onClick);
          } else if (typeof listItem === "string" || typeof listItem === "number") {
            return this.getItemNode(listItem, index);
          } else if (typeof listItem === "object" && listItem.itemNode) {
            const { itemNode, disabled, focus, style, onClick } = listItem;
            return this.getItemNode(itemNode, index, disabled, focus, style, onClick);
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

function getStyles(listView: ListView) {
  const { context, props: { listItemStyle, background, style } } = listView;
  const { theme } = context;

  return {
    root: theme.prefixStyle({
      width: 320,
      display: "inline-block",
      verticalAlign: "middle",
      fontSize: 14,
      padding: "8px 0",
      color: theme.baseMediumHigh,
      border: `1px solid ${theme.useFluentDesign ? theme.listLow : theme.altHigh}`,
      transition: "all .25s",
      ...style
    }),
    item: theme.prefixStyle({
      cursor: "default",
      padding: 8,
      width: "100%",
      transition: "all 0.25s",
      ...listItemStyle
    })
  };
}

export default ListView;
