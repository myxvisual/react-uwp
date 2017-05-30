import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";
import vendors from "../common/browser/vendors";

vendors.pop();
vendors.map(vendor => vendor[0].toUpperCase() + vendor.slice(1));

export interface Item {
  itemNode?: React.ReactNode;
  disabled?: boolean;
  focus?: boolean;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}
export interface DataProps {
  items?: Item[];
  itemStyle?: React.CSSProperties;
  onChooseItem?: (itemIndex?: number) => void;
}

export interface ListViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ListViewState {
  currItems?: Item[];
}

const emptyFunc = () => {};
export default class ListView extends React.Component<ListViewProps, ListViewState> {
  static defaultProps: ListViewProps = {
    onChooseItem: emptyFunc
  };

  state: ListViewState = {
    currItems: this.props.items
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  componentWillReceiveProps(nextProps: ListViewProps) {
    this.updateProps2State(nextProps);
  }

  updateProps2State = (props: ListViewProps) => {
    const currItems = props.items;
    this.setState({ currItems });
  }

  render() {
    const {
      items, // tslint:disable-line:no-unused-variable
      itemStyle, // tslint:disable-line:no-unused-variable
      onChooseItem,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { currItems } = this.state;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
      >
        {currItems && currItems.map((item, index) => {
          const { itemNode, disabled, focus, style, onClick } = item;
          const { isDarkTheme } = theme;
          const defaultBG = focus ? theme.listAccentLow : theme.chromeLow;
          const focusBG = focus ? theme.listAccentMedium : theme.chromeMedium;
          const clickBG = focus ? theme.accent : theme.chromeHigh;
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
                item.focus = true;
                this.setState({ currItems });
                for (const vendor of vendors) {
                  e.currentTarget.style[`${vendor}Transform` as any] = "scale(0.99)";
                }
                onChooseItem(index);
                e.currentTarget.style.transform = "scale(0.99)";
                e.currentTarget.style.background = clickBG;
              }}
              onMouseUp={disabled ? void(0) : (e) => {
                item.focus = false;
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
        })}
      </div>
    );
  }
}

function getStyles(listView: ListView): {
  root?: React.CSSProperties;
  item?: React.CSSProperties;
} {
  const { context, props: { itemStyle } } = listView;
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    root: {
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
      ...itemStyle
    }
  };
}
