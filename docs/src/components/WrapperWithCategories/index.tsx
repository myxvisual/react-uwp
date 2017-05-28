import * as React from "react";
import * as Router from "react-router";
import * as PropTypes from "prop-types";

import * as tinycolor from "tinycolor2";
import getStripedBackground from "react-uwp/styles/getStripedBackground";
import Wrapper from "../Wrapper";
import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import TreeView from "react-uwp/TreeView";
import Icon from "react-uwp/Icon";
import ThemeType from "react-uwp/styles/ThemeType";

import listItemsData from "./categories";

export interface Item {
  titleNode?: string;
  expanded?: boolean;
  children?: Item[];
}

let prevItemFocused: any = {};
function setListItemsUrl(path = "/") {
  const listItem: any = listItemsData;
  const isRootPath = path === "/";
  const parentUrl = isRootPath ? "" : `/${path}`;
  const names = location.pathname.split("/").map(path => path.toLowerCase());

  const setUrl = (listData: any) => {
    if (Array.isArray(listData)) {
      for (const listDataItem of listData) {
        listDataItem.parentUrl = parentUrl;
        setUrl(listDataItem);
      }
      return;
    }
    if (typeof listData.titleNode !== "string") return;

    const title = listData.titleNode.toLowerCase().replace(/\s/gim, "-");
    if (names.includes(title)) {
      listData.expanded = true;
      if (names.slice(-1)[0] === title) {
        listData.visited = true;
        if (prevItemFocused !== listData) {
          prevItemFocused.visited = false;
          prevItemFocused = listData;
        }
      }
    }

    const parentUrlNow = `${listData.parentUrl}/${listData.titleNode.toLowerCase().replace(/\s/gim, "-")}`;
    listData.style = {
      textDecoration: "inherit"
    } as React.CSSProperties;
    listData.onClick = () => {
      Router.browserHistory.push(parentUrlNow);
      // location.href = parentUrlNow;
    };
    listData.hoverStyle = {
      textDecoration: "underline"
    } as CSSStyleDeclaration;
    if (listData.children) {
      listData.children.forEach((item: any) => {
        item.parentUrl = parentUrlNow;
        setUrl(item);
      });
    }
  };
  setUrl(listItem);
}

export interface DataProps {
  path?: string;
}

export interface WrapperWithCategoriesProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface WrapperWithCategoriesState {
  showFocus?: boolean;
  listItems?: any[];
  renderContentWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 260;

export default class WrapperWithCategories extends React.Component<WrapperWithCategoriesProps, WrapperWithCategoriesState> {
  static defaultProps: WrapperWithCategoriesProps = {
    path: "/"
  };

  state: WrapperWithCategoriesState = {
    showFocus: true,
    listItems: listItemsData
  };
  searchTimeout: any = null;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

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
        if (item.children) { checkItems(item.children, item.prevIndexArr); }
      });
    };

    this.searchTimeout = setTimeout(() => {
      checkItems(listItems, []);
      this.setState({ listItems, showFocus: true });
    }, 200);
  }

  handleChangeRenderContentWidth = (
    renderContentWidth?: number | string,
    screenType?: "phone" | "tablet" | "laptop" | "pc"
  ) => {
    this.setState({
      renderContentWidth,
      screenType
    });
  }

  render() {
    setListItemsUrl(this.props.path);
    const { children, ...attributes } = this.props;
    const { listItems, showFocus, renderContentWidth, screenType } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const notPhoneTablet = screenType !== "phone" && screenType !== "tablet";

    return (
      <Wrapper onChangeRenderContentWidth={this.handleChangeRenderContentWidth}>
        <div
          style={theme.prepareStyles({
            display: "flex",
            flexDirection: "row",
            width: renderContentWidth,
            minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT - 20}px)`,
            margin: "0 auto"
          })}
        >
          <div
            style={{
              width: 320,
              padding: "10px 0",
              background: theme.listLow,
              display: notPhoneTablet ? void 0 : "none"
            }}
          >
            <AutoSuggestBox
              background="none"
              style={{
                height: 32,
                fontSize: 16,
                width: "100%"
              }}
              iconSize={32}
              placeholder="Search Docs..."
              onChangeValue={this.handleChangeValue}
            />
            <TreeView
              listItems={listItems as any}
              listItemHeight={32}
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
          <Icon
            style={{
              display: notPhoneTablet ? "none" : "flex",
              position: "fixed",
              top: 12,
              left: 12,
              width: 48,
              height: 48,
              fontSize: 24,
              cursor: "pointer"
            }}
            hoverStyle={{
              background: theme.baseLow
            }}
          >
            GlobalNavButton
          </Icon>
          <div
            style={theme.prepareStyles({
              width: notPhoneTablet ? "calc(100% - 320px)" : "100%",
              ...getStripedBackground(4, tinycolor(theme.baseHigh).setAlpha(0.025).toRgbString(), "transparent"),
              minHeight: "100%"
            })}
          >
            {children}
          </div>
        </div>
      </Wrapper>
    );
  }
}

function getStyles(wrapperWithCategories: WrapperWithCategories): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = wrapperWithCategories;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}
