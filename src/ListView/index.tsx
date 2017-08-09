import * as React from "react";
import * as PropTypes from "prop-types";

import PseudoClasses from "../PseudoClasses";
import vendors from "../common/browser/vendors";

export interface ListItem {
  itemNode?: React.ReactNode;
  disabled?: boolean;
  focus?: boolean;
  style?: React.CSSProperties;
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
}

export interface ListViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ListViewState {
  focusIndex?: number;
}

const emptyFunc = () => {};
export class ListView extends React.Component<ListViewProps, ListViewState> {
  static defaultProps: ListViewProps = {
    onChooseItem: emptyFunc
  };

  state: ListViewState = {
    focusIndex: this.props.defaultFocusListIndex
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  rootElm: HTMLDivElement;
  inlineStyles: {
    [key: string]: React.CSSProperties;
  } = null;

  componentWillReceiveProps(nextProps: ListViewProps) {
    if (nextProps.defaultFocusListIndex !== this.state.focusIndex) {
      this.setState({ focusIndex: nextProps.defaultFocusListIndex });
    }
  }

  getItemNode = (itemNode: any, index: number, disabled?: boolean, focus?: boolean, style?: React.CSSProperties, onClick?: () => void) => {
    const { inlineStyles } = this;
    const { theme } = this.context;
    const { onChooseItem, background } = this.props;
    const { focusIndex } = this.state;
    const { isDarkTheme } = theme;
    const isFocus = focus || focusIndex === index;
    const defaultBG = isFocus ? theme.listAccentLow : "none";
    const focusBG = isFocus ? theme.listAccentHigh : (theme.useFluentDesign ? theme.acrylicTexture40.background : theme.listLow);
    const clickBG = isFocus ? theme.accent : theme.chromeHigh;

    const itemStyles = theme.prepareStyle({
      className: "list-view-item",
      style: theme.prefixStyle({
        background: defaultBG,
        color: disabled ? theme.baseLow : theme.baseHigh,
        "&:hover": {
          background: focusBG
        },
        "&:active": {
          transform: "scale(0.99)"
        },
        ...inlineStyles.item,
        ...style
      })
    });

    return (
      <PseudoClasses {...itemStyles} key={`${index}`}>
        <div
          onClick={onClick}
          onMouseDown={disabled ? void 0 : e => {
            onChooseItem(index);
          }}
        >
          {itemNode}
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
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "list-view",
      styles: inlineStyles
    });
    this.inlineStyles = inlineStyles;

    const listSourceAny: any = listSource;

    return (
      <div
        ref={rootElm => this.rootElm = rootElm}
        {...attributes}
        {...styles.root}
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

function getStyles(listView: ListView): {
  root?: React.CSSProperties;
  item?: React.CSSProperties;
} {
  const { context, props: { listItemStyle, background, style } } = listView;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    root: theme.prefixStyle({
      width: 320,
      display: "inline-block",
      verticalAlign: "middle",
      fontSize: 14,
      padding: "8px 0",
      color: theme.baseMediumHigh,
      border: `1px solid ${theme.useFluentDesign ? theme.listLow : theme.altHigh}`,
      background: background || (theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeLow),
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
