import * as React from "react";
import * as Router from "react-router";
import * as PropTypes from "prop-types";

import scrollToYEasing from "react-uwp/common/browser/scrollToYEasing";

import Header from "../components/Header";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import TreeView from "react-uwp/TreeView";
import IconButton from "react-uwp/IconButton";
import Icon from "react-uwp/Icon";
import FloatNav from "react-uwp/FloatNav";
import Theme from "react-uwp/Theme";
import { ThemeType } from "react-uwp/styles/ThemeType";
import getTheme from "react-uwp/styles/getTheme";
import setScrollBarStyle from "react-uwp/styles/setScrollBarStyle";

import listItemsData from "./categories";

function setListItemsUrl(path = "/") {
  const designChild: any = listItemsData[1];
  const names = location.pathname.replace("/../../design/", "").replace(/\-/gim, " ").split("/");
  const setUrl = (listData: any) => {
    if (typeof listData.titleNode !== "string") return;

    const title = listData.titleNode.toLowerCase();
    if (names.includes(title)) {
      listData.expanded = true;
      if (names.slice(-1)[0].toLocaleLowerCase().includes(title)) listData.visited = true;
    }

    const parentUrlNow = `${listData.parentUrl}/${listData.titleNode.toLowerCase().replace(/\s/gim, "-")}`;
    listData.style = {
      cursor: "pointer",
      textDecoration: "inherit"
    } as React.CSSProperties;
    listData.onClick = () => {
      // Router.browserHistory.push(parentUrlNow);
      location.href = parentUrlNow;
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
export interface ReactUWPProps extends DataProps, Router.RouteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
export interface ReactUWPState {
  listItems?: any[];
  showFocus?: boolean;

  child?: number;
  date?: Date;
  renderMaxWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const theme = getTheme("Dark");

export default class ReactUWP extends React.Component<ReactUWPProps, ReactUWPState> {
  static contextTypes = { theme: PropTypes.object };
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
    this.resize();
  }

  componentDidMount() {
    Object.assign(document.body.style, {
      background: theme.chromeLow,
      color: theme.baseHigh
    });
    setScrollBarStyle();
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize = (e?: Event) => {
    const { innerWidth } = window;
    if (innerWidth < 960) {
      const screenType = "phone";
      this.updateRenderMaxWidth("100%", screenType);
    } else if (innerWidth >= 960 && innerWidth < 1366) {
      const screenType = "tablet";
      this.updateRenderMaxWidth(960, screenType);
    } else if (innerWidth >= 1366 && innerWidth < 1920) {
      const screenType = "laptop";
      this.updateRenderMaxWidth(1280, screenType);
    } else {
      const screenType = "pc";
      this.updateRenderMaxWidth(1600, screenType);
    }
  }

  updateRenderMaxWidth = (renderMaxWidth: string | number, screenType: "phone" | "tablet" | "laptop" | "pc") => {
    if (this.state.renderMaxWidth !== renderMaxWidth) {
      this.setState({
        renderMaxWidth,
        screenType
      });
    }
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
        if (item.children) { checkItems(item.children, item.prevIndexArr); }
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
    const { listItems, showFocus, renderMaxWidth, screenType } = this.state;
    const { date } = this.state;
    const notPhoneTablet = screenType !== "phone" && screenType !== "tablet";

    return (
      <Theme
        className={className}
        theme={theme}
        id={id}
        style={theme.prepareStyles({
          display: "flex",
          flexDirection: "column",
          maxWidth: renderMaxWidth,
          margin: "0 auto",
          ...style
        }) as any}
      >
        <Header maxWidth={renderMaxWidth} />
        <div style={theme.prepareStyles({ display: "flex", flexDirection: "row" })}>
          <div
            style={{
              width: 320,
              position: "relative",
              display: notPhoneTablet ? void 0 : "none"
            }}
          >
            <div
              style={{
                position: "fixed",
                top: 0,
                width: 320,
                padding: "10px 0",
                height: "100%"
              }}
            >
              <AutoSuggestBox
                background="none"
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
                  onClick={() => location.href = "/"}
                >
                  Home
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
                  ScrollChevronUpLegacy
                  </IconButton>
              }
              floatNavWidth={200}
            />
          </div>
        </div>
      </Theme>
    );
  }
}

