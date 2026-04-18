import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import { codes } from 'keycode';
import Icon from './Icon';
import TextBox from './TextBox';
import ListView from './ListView';
import PseudoClasses from './PseudoClasses';

export interface DataProps {
  listSource?: React.ReactNode[];
  onChangeValue?: (value: string) => void;
  searchAction?: (value?: string) => void;
  iconSize?: number;
  background?: string;
  placeholder?: string;
}
export interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const AutoSuggestBox: React.FC<AutoSuggestBoxProps> = ({
  background = "none",
  iconSize = 32,
  onChangeValue,
  searchAction,
  listSource,
  style,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [typing, setTyping] = useState(false);
  const [showListSource, setShowListSource] = useState(false);
  const [focusListSourceIndex, setFocusListSourceIndex] = useState<number | undefined>(undefined);
  const textBox = useRef<TextBox>(null);
  const listView = useRef<ListView>(null);
  const inputTimer = useRef<NodeJS.Timeout | null>(null);

  // 事件监听
  useEffect(() => {
    const checkLayerClick = (e: Event) => {
      if (textBox.current?.rootElm && !textBox.current.rootElm.contains(e.target as Node)) {
        setShowListSource(false);
      }
    };

    const checkLayerKeydown = (e: KeyboardEvent) => {
      if (textBox.current?.inputElm?.matches(":focus") && e.keyCode === 27) {
        setShowListSource(false);
      }
    };

    document.documentElement.addEventListener("click", checkLayerClick);
    document.documentElement.addEventListener("keydown", checkLayerKeydown);

    return () => {
      document.documentElement.removeEventListener("click", checkLayerClick);
      document.documentElement.removeEventListener("keydown", checkLayerKeydown);
      if (inputTimer.current) clearTimeout(inputTimer.current);
    };
  }, []);

  const showListSourceHandler = () => setShowListSource(true);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    onChangeValue?.(value);

    if (inputTimer.current) clearTimeout(inputTimer.current);
    inputTimer.current = setTimeout(() => {
      if (value) {
        setTyping(true);
        setShowListSource(true);
      } else {
        setTyping(false);
        setShowListSource(false);
      }
    }, 150);
  };

  // 暴露实例方法
  const getValue = () => textBox.current?.getValue();
  const setValue = (value: string) => textBox.current?.setValue(value);
  AutoSuggestBox.getValue = getValue;
  AutoSuggestBox.setValue = setValue;

  const handleButtonAction = () => {
    if (typing) {
      setValue("");
      onChangeValue?.("");
      setTyping(false);
      setShowListSource(false);
      textBox.current?.inputElm?.focus();
    } else {
      const value = getValue();
      searchAction?.(value);
      onChangeValue?.(value);
    }
  };

  const handleChooseItem = (index: number) => {
    setTimeout(() => setShowListSource(false), 250);
    const item: any = listSource?.[index];
    setValue(typeof item === "object" ? item.props.value : item);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { keyCode } = e;
    const listSourceSize = listSource?.length || 0;

    if (listSourceSize && showListSource) {
      switch (keyCode) {
        case 38:
          if (focusListSourceIndex === undefined) {
            setFocusListSourceIndex(listSourceSize - 1);
          } else {
            const newIndex = (focusListSourceIndex - 1 + listSourceSize) % listSourceSize;
            setFocusListSourceIndex(newIndex);
          }
          break;
        case 40:
          if (focusListSourceIndex === undefined) {
            setFocusListSourceIndex(0);
          } else {
            const newIndex = (focusListSourceIndex + 1) % listSourceSize;
            setFocusListSourceIndex(newIndex);
          }
          break;
        case 13:
          if (focusListSourceIndex === undefined) {
            searchAction?.(getValue());
            setShowListSource(false);
          } else {
            handleChooseItem(focusListSourceIndex);
            setFocusListSourceIndex(undefined);
          }
          break;
      }
    } else if (keyCode === 13) {
      searchAction?.(getValue());
    }
  };

  const styles = getStyles(theme, { style, iconSize, showListSource });

  return (
    <TextBox
      {...attributes}
      style={styles.root}
      ref={textBox}
      onClick={showListSourceHandler}
      onKeyDown={handleInputKeyDown}
      rightNode={
        <PseudoClasses style={styles.icon} onClick={handleButtonAction}>
          <Icon>
            {typing ? "CancelLegacy" : "Search"}
          </Icon>
        </PseudoClasses>
      }
      background={background}
      onChange={handleChange}
    >
      {listSource && listSource.length > 0 && (
        <ListView
          ref={listView}
          style={styles.listView}
          listSource={listSource.map((itemNode, index) => ({
            itemNode,
            focus: index === focusListSourceIndex
          }))}
          listItemStyle={{ fontSize: 12 }}
          onChooseItem={handleChooseItem}
        />
      )}
    </TextBox>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  iconSize: number;
  showListSource: boolean;
}) => {
  const { style, iconSize, showListSource } = props;
  return {
    root: theme.prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      ...style,
      position: "relative"
    }),
    listView: theme.prefixStyle({
      position: "absolute",
      width: "100%",
      top: "100%",
      left: 0,
      zIndex: 2,
      border: `1px solid ${theme.baseLow}`,
      transform: `translate3d(0, ${showListSource ? 0 : "-10px"}, 0)`,
      opacity: showListSource ? 1 : 0,
      pointerEvents: showListSource ? undefined : "none",
      transition: "all .25s"
    }),
    icon: theme.prefixStyle({
      position: "absolute",
      top: 0,
      right: 0,
      cursor: "pointer !important",
      height: iconSize,
      width: iconSize,
      color: "#a9a9a9",
      "&:hover": {
        color: theme.accent
      }
    })
  };
};


export default AutoSuggestBox;
