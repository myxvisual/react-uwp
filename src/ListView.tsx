import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import PseudoClasses from './PseudoClasses';
import RevealEffect, { RevealEffectProps } from './RevealEffect';
import Separator from './Separator';
import AppBarSeparator from './AppBarSeparator';

export interface ListItem {
  itemNode?: React.ReactNode;
  disabled?: boolean;
  focus?: boolean;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}
export interface DataProps {
  listSource?: ListItem[] | React.ReactNode[];
  listItemStyle?: React.CSSProperties;
  onChooseItem?: (itemIndex?: number) => void;
  defaultFocusListIndex?: number;
  background?: string;
  revealConfig?: RevealEffectProps;
  enableResizeObserver?: boolean;
}
export interface ListViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const ListView: React.FC<ListViewProps> = ({
  onChooseItem,
  revealConfig = { effectRange: "self" },
  listSource,
  listItemStyle,
  background,
  defaultFocusListIndex,
  enableResizeObserver,
  className,
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const [focusIndex, setFocusIndex] = useState<number | undefined>(defaultFocusListIndex);
  const rootElm = useRef<HTMLDivElement>(null);

  // 受控处理defaultFocusListIndex
  useEffect(() => {
    if (defaultFocusListIndex !== focusIndex) {
      setFocusIndex(defaultFocusListIndex);
    }
  }, [defaultFocusListIndex]);

  const getItemNode = (itemNode: any, index: number, disabled?: boolean, focus?: boolean, itemStyle?: React.CSSProperties, onClick?: () => void) => {
    const isFocus = focus || focusIndex === index;
    const defaultBG = isFocus ? theme.listAccentLow : "none";

    const itemBaseStyle = theme.prefixStyle({
      cursor: "default",
      padding: 8,
      width: "100%",
      transition: "all 0.25s",
      ...listItemStyle,
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
      ...itemStyle
    });

    const classes = theme.prepareStyle({
      className: "list-view-item",
      style: itemBaseStyle
    });
    const isSeparator = itemNode && typeof itemNode === "object" && (
      itemNode.type === Separator || itemNode.type === AppBarSeparator
    );

    return (
      <PseudoClasses {...classes} key={index}>
        <div
          onClick={onClick}
          onMouseDown={!disabled ? e => { onChooseItem?.(index); } : undefined}
        >
          {itemNode}
          {!isSeparator && <RevealEffect {...revealConfig} />}
        </div>
      </PseudoClasses>
    );
  };

  const styles = getStyles(theme, { listItemStyle, background, style });
  const classes = theme.prepareStyles({ className: "list-view", styles });

  return (
    <div
      ref={rootElm}
      style={classes.root.style}
      className={theme.classNames(classes.root.className, className)}
      {...attributes}
    >
      {listSource?.map((listItem: any, index: number) => {
        if (React.isValidElement(listItem)) {
          const props: any = listItem.props;
          const { disabled, focus, style: itemStyle, onClick } = props;
          return getItemNode(listItem, index, disabled, focus, itemStyle, onClick);
        } else if (typeof listItem === "string" || typeof listItem === "number") {
          return getItemNode(listItem, index);
        } else if (typeof listItem === "object" && listItem.itemNode) {
          const { itemNode, disabled, focus, style: itemStyle, onClick } = listItem;
          return getItemNode(itemNode, index, disabled, focus, itemStyle, onClick);
        } else {
          return null;
        }
      })}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  listItemStyle?: React.CSSProperties;
  background?: string;
  style?: React.CSSProperties;
}) => {
  const { listItemStyle, background, style } = props;

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
};


export default ListView;
