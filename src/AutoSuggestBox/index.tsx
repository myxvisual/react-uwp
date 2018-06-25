import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import Icon from "../Icon";
import TextBox from "../TextBox";
import ListView from "../ListView";
import PseudoClasses from "../PseudoClasses";

export interface DataProps {
  /**
   * Array of strings or nodes used to populate the list.
   */
  listSource?: React.ReactNode[];
  /**
   * `AutoSuggestBox` onChange callback.
   */
  onChangeValue?: (value: string) => void;
  /**
   * Array of strings or nodes used to populate the list.
   */
  searchAction?: (value?: string) => void;
  /**
   * Inside Icon Size, use `number`.
   */
  iconSize?: number;
  /**
   * Control component `background` style.
   */
  background?: string;
  placeholder?: string;
}

export interface AutoSuggestBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AutoSuggestBoxState {
  typing?: boolean;
  showListSource?: boolean;
  focusListSourceIndex?: number;
}

const emptyFunc = () => {};
export class AutoSuggestBox extends React.Component<AutoSuggestBoxProps, AutoSuggestBoxState> {
  static defaultProps: AutoSuggestBoxProps = {
    background: "none",
    onChangeValue: emptyFunc,
    searchAction: emptyFunc,
    iconSize: 32
  };

  state: AutoSuggestBoxState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  /**
   * `Input` component.
   */
  textBox: TextBox;
  listView: ListView;
  inputTimer: any = null;

  componentDidMount() {
    document.documentElement.addEventListener("click", this.checkLayerClick);
    document.documentElement.addEventListener("keydown", this.checkLayerKeydown);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener("click", this.checkLayerClick);
    document.documentElement.removeEventListener("keydown", this.checkLayerKeydown);
  }

  checkLayerClick = (e: Event) => {
    const { typing } = this.state;
    if (!this.textBox.rootElm.contains(e.target as Node)) {
      this.setState({ showListSource: false });
    }
  }

  checkLayerKeydown = (e: KeyboardEvent) => {
    const { keyCode } = e;
    const { typing } = this.state;
    if (this.textBox.inputElm.matches(":focus") && keyCode === 27) {
      this.setState({ showListSource: false });
    }
  }

  toggleShowListSource = (showListSource?: any) => {
    if (typeof showListSource === "boolean") {
      if (showListSource !== this.state.showListSource) {
        this.setState({ showListSource });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showListSource: !prevState.showListSource
      }));
    }
  }

  showListSource = () => this.setState({ showListSource: true });

  handleChange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
    let event: React.SyntheticEvent<HTMLInputElement>;
    event = e;
    const { currentTarget: { value } } = event;
    this.props.onChangeValue(value);

    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      if (value) {
        this.setState({ typing: true, showListSource: true });
      } else {
        this.setState({ typing: false, showListSource: false });
      }
    }, 150);
  }

  /**
   * `Get` input value method.
   */
  getValue = () => this.textBox.getValue();

  /**
   * `Set` input value method.
   */
  setValue = (value: string) => this.textBox.setValue(value);

  /**
   * `Reset` input value method.
   */
  handleButtonAction = (e: React.MouseEvent<HTMLInputElement>) => {
    if (this.state.typing) {
      this.setValue("");
      this.props.onChangeValue("");
      this.setState({
        typing: false,
        showListSource: false
      });
      this.textBox.inputElm.focus();
    } else {
      const value = this.getValue();
      this.props.searchAction(value);
      this.props.onChangeValue(value);
    }
  }

  handleChooseItem = (index: number) => {
    const chooseTimer = setTimeout(() => {
      this.toggleShowListSource(false);
      clearTimeout(chooseTimer);
    }, 250);
    const item: any = this.props.listSource[index];
    this.setValue(typeof item === "object" ? item.props.value : item);
  }

  handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { keyCode } = e;
    let { focusListSourceIndex, showListSource } = this.state;
    const { searchAction } = this.props;
    let listSourceSize: number;
    if (listSourceSize && showListSource) {
      switch (keyCode) {
        case 38: {
          if (focusListSourceIndex === void 0) {
            this.setState({ focusListSourceIndex: listSourceSize - 1 });
          } else {
            focusListSourceIndex = focusListSourceIndex - 1;
            if (focusListSourceIndex < 0) focusListSourceIndex = focusListSourceIndex + listSourceSize;
            this.setState({ focusListSourceIndex: focusListSourceIndex % listSourceSize });
          }
          break;
        }
        case 40: {
          if (focusListSourceIndex === void 0) {
            this.setState({ focusListSourceIndex: 0 });
          } else {
            focusListSourceIndex = focusListSourceIndex + 1;
            if (focusListSourceIndex > listSourceSize) focusListSourceIndex = focusListSourceIndex - listSourceSize;
            this.setState({ focusListSourceIndex: focusListSourceIndex % listSourceSize });
          }
          break;
        }
        case 13: {
          if (focusListSourceIndex === void 0) {
            searchAction(this.getValue());
            this.setState({ showListSource: false });
          } else {
            this.handleChooseItem(focusListSourceIndex);
            this.setState({ focusListSourceIndex: void 0 });
          }
          break;
        }
        default: {
          break;
        }
      }
    } else {
      if (keyCode === 13) {
        searchAction(this.getValue());
      }
    }
  }

  render() {
    const {
      onChangeValue,
      searchAction,
      listSource,
      iconSize,
      children,
      className,
      background,
      ...attributes
    } = this.props;
    const {
      typing,
      focusListSourceIndex
    } = this.state;
    const { theme } = this.context;

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      styles: inlineStyles,
      className: "autosuggest-box"
    });

    return (
      <TextBox
        {...attributes}
        style={inlineStyles.root}
        className={theme.classNames(className, styles.root.className)}
        ref={textBox => this.textBox = textBox}
        onClick={this.showListSource}
        onKeyDown={this.handleInputKeyDown}
        rightNode={
          <PseudoClasses style={inlineStyles.icon} onClick={this.handleButtonAction}>
            <Icon>
              {typing ? "CancelLegacy" : "Search"}
            </Icon>
          </PseudoClasses>
        }
        background={background}
        onChange={this.handleChange}
      >
        {listSource && listSource.length > 0 && (
          <ListView
            ref={listView => this.listView = listView}
            style={inlineStyles.listView}
            listSource={listSource.map((itemNode, index) => ({
              itemNode,
              focus: index === focusListSourceIndex
            }))}
            listItemStyle={{
              fontSize: 12
            }}
            onChooseItem={this.handleChooseItem}
          />
        )}
      </TextBox>
    );
  }
}

function getStyles(autoSuggestBox: AutoSuggestBox): {
  root?: React.CSSProperties;
  listView?: React.CSSProperties;
  icon?: ReactUWP.CustomCSSProperties;
} {
  const { context, props: {
    style,
    iconSize
  }, state: { showListSource } } = autoSuggestBox;
  const { theme } = context;

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
      pointerEvents: showListSource ? void 0 : "none",
      transition: "all .25s"
    }),
    icon: {
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
    }
  };
}

export default AutoSuggestBox;
