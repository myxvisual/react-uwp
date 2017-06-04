import * as React from "react";
import * as PropTypes from "prop-types";

import vendors from "../common/browser/vendors";

vendors.pop();
vendors.map(vendor => vendor[0].toUpperCase() + vendor.slice(1));

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

  getItemNode = (itemNode: any, index: number, disabled?: boolean, focus?: boolean, style?: React.CSSProperties, onClick?: () => void) => {
    const styles = getStyles(this);
    const { theme } = this.context;
    const { onChooseItem } = this.props;
    const { focusIndex } = this.state;
    const { isDarkTheme } = theme;
    const isFocus = focus || focusIndex === index;
    const defaultBG = isFocus ? theme.listAccentLow : theme.chromeLow;
    const focusBG = isFocus ? theme.listAccentHigh : theme.chromeMedium;
    const clickBG = isFocus ? theme.accent : theme.chromeHigh;
    return (
      <div
        style={theme.prepareStyles({
          background: defaultBG,
          color: disabled ? theme.baseLow : theme.baseHigh,
          ...styles.item,
          ...style
        })}
        key={`${index}`}
        onClick={onClick}
        onMouseEnter={disabled ? void(0) : (e) => {
          e.currentTarget.style.background = focusBG;
        }}
        onMouseLeave={disabled ? void(0) : (e) => {
          e.currentTarget.style.background = defaultBG;
        }}
        onMouseDown={disabled ? void(0) : (e) => {
          this.setState({ focusIndex: index });
          for (const vendor of vendors) {
            e.currentTarget.style[`${vendor}Transform` as any] = "scale(0.99)";
          }
          onChooseItem(index);
          e.currentTarget.style.transform = "scale(0.99)";
          e.currentTarget.style.background = clickBG;
        }}
        onMouseUp={disabled ? void(0) : (e) => {
          for (const vendor of vendors) {
            e.currentTarget.style[`${vendor}Transform` as any] = "scale(1)";
          }
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = defaultBG;
        }}
      >
        {itemNode}
      </div>
    );
  }

  render() {
    const {
      listSource, // tslint:disable-line:no-unused-variable
      listItemStyle, // tslint:disable-line:no-unused-variable
      onChooseItem,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    let listSourceAny: any = listSource;

    return (
      <div
        {...attributes}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
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
  const { context, props: { listItemStyle } } = listView;
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    root: {
      width: 320,
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      padding: "8px 0",
      color: theme.baseMediumHigh,
      border: `1px solid ${theme.altHigh}`,
      background: theme.chromeLow,
      transition: "all .25s"
    },
    item: {
      cursor: "default",
      padding: 8,
      width: "100%",
      transition: "all 0.25s",
      ...listItemStyle
    }
  };
}

export default ListView;
