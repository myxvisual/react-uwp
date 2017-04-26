import * as React from "react";
import { RouterProps } from "react-router";

import scrollToYEasing from "react-uwp/src/common/browser/scrollToYEasing";

import AutoSuggestBox from "react-uwp/src/controls/AutoSuggestBox";
import TreeView from "react-uwp/src/controls/TreeView";
import IconButton from "react-uwp/src/controls/IconButton";
import FloatNav from "react-uwp/src/controls/FloatNav";
import Theme from "react-uwp/src/controls/Theme";
import { ThemeType } from "react-uwp/src/styles/ThemeType";
import getTheme from "react-uwp/src/styles/getTheme";
import setScrollBarStyle from "react-uwp/src/styles/setScrollBarStyle";

import listItemsData from "./categories";

function setListItemsUrl(path = "/") {
  const designChild: any = listItemsData[1];
  const names = location.pathname.replace("/../../design/", "").replace(/\-/gim, " ").split("/");
  const setUrl = (listData: any) => {
    if (typeof listData.titleNode !== "string") return;

    if (names.includes(listData.titleNode.toLowerCase())) {
      listData.expanded = true;
      if (names.slice(-1)[0]) listData.focus = true;
    }

    const parentUrlNow = `${listData.parentUrl}/${listData.titleNode.toLowerCase().replace(/\s/gim, "-")}`;
    if (listData.children) {
      listData.children.forEach((item: any) => {
        item.parentUrl = parentUrlNow;
        setUrl(item);
      });
    } else {
      listData.titleNode = (
        <a style={{ textDecoration: "none", color: "inherit" }} href={parentUrlNow}>
          {listData.titleNode}
        </a>
      );
    }
  };
  designChild.children.forEach((item: any) => {
    item.parentUrl = `${path === "/" ? "/" : `/${path}/`}design`;
    setUrl(item);
  });
}

export interface Item {
  titleNode?: string;
  expanded?: boolean;
  children?: Item[];
}
export interface DataProps {
  path?: string;
  containerStyle?: React.CSSProperties;
}
export interface ReactUWPProps extends DataProps, RouterProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
export interface ReactUWPState {
  listItems?: any[];
  showFocus?: boolean;

  child?: number;
  date?: Date;
}

const theme = getTheme("Dark");

export default class ReactUWP extends React.Component<ReactUWPProps, ReactUWPState> {
  static defaultProps = {
    className: ""
  };

  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  state: ReactUWPState = {
    listItems: listItemsData,
    showFocus: true,
    child: 0,
    date: new Date()
  };

  searchTimeout: any = null;

  componentWillMount() {
    setListItemsUrl(this.props.path);
  }

  componentDidMount() {
    Object.assign(document.body.style, {
      background: theme.chromeLow,
      color: theme.baseHigh
    });
    setScrollBarStyle();
  }

  handleChangeValue = (value: string) => {
    const { listItems } = this.state;
    clearTimeout(this.searchTimeout);

    const checkItems = (items: any[], prevIndexArr: number[]) => {
      items.forEach((item, index) => {
        if (!item.prevIndexArr) item.prevIndexArr = [...prevIndexArr, index];
        if (value && (typeof item.titleNode === "string" ? item.titleNode : item.titleNode.props.children).toLowerCase().includes(value.toLowerCase())) {
          let currSetParentItems: any[] = listItems;
          const length = item.prevIndexArr.length;
          for (let i = 0; i < length; i++) {
            const nowItem = currSetParentItems[item.prevIndexArr[i]];
            if (nowItem.disable) return;
            nowItem.expanded = true;
            if (!nowItem.children) nowItem.focus = true;
            currSetParentItems = nowItem.children;
          }
        } else {
          item.expanded = false;
          if (!item.children) item.focus = false;
        }
        if (item.children) { checkItems(item.children, item.prevIndexArr); };
      });
    };

    this.searchTimeout = setTimeout(() => {
      checkItems(listItems, []);
      this.setState({ listItems, showFocus: true });
    }, 2000);
  }

  render() {
    const {
      className,
      id,
      style,
      path, // tslint:disable-line:no-unused-variable
      children,
      containerStyle
    } = this.props;
    const { listItems, showFocus } = this.state;
    const { date } = this.state;

    return (
      <Theme
        className={className}
        theme={theme}
        id={id}
        style={theme.prepareStyles({
          display: "flex",
          flexDirection: "row",
          ...style
        })}
      >
        <div style={{ width: 320 }}>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 320,
              padding: "10px 0",
              background: theme.altHigh,
              height: "100%"
            }}
          >
            <AutoSuggestBox
              style={{
                height: 42,
                fontSize: 20,
                width: "100%"
              }}
              iconSize={42}
              placeholder="Search Docs..."
              onChangeValue={this.handleChangeValue}
            />
            <TreeView
              listItems={listItems as any}
              listItemHeight={40}
              childPadding={20}
              iconPadding={2}
              showFocus={showFocus}
              titleNodeStyle={{
                fontSize: 14
              }}
              style={{
                maxHeight: "100%"
              }}
            />
          </div>
        </div>
        <div
          style={theme.prepareStyles({
            width: "calc(100% - 320px)",
            padding: "0 10px",
            ...containerStyle
          })}
        >
          {children}
        </div>
        <div style={{ position: "fixed", right: 20, bottom: 40, zIndex: 2000 }}>
          <FloatNav
            topNode={
              <IconButton
                hoverStyle={{
                  color: "#fff",
                  background: theme.accent
                }}
              >
                &#xE10F;
              </IconButton>
            }
            bottomNode={
              <IconButton
                style={{
                  background: theme.accent,
                  color: "#fff"
                }}
                hoverStyle={{
                  color: "#fff",
                  background: theme.accent
                }}
                onClick={() => scrollToYEasing(0)}
              >
                &#xE010;
                </IconButton>
            }
            floatNavWidth={200}
          />
        </div>
      </Theme>
    );
  }
};
