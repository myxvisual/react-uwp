import * as React from "react";
import * as PropTypes from "prop-types";
import { Link, browserHistory } from "react-router";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import TreeView from "react-uwp/TreeView";

import docTreeData from "./docTreeData";

export interface Item {
  titleNode?: string;
  expanded?: boolean;
  children?: Item[];
}

let prevItemFocused: any = {};

const convert2string = (titleNode?: any): any => {
  if (typeof titleNode === "string") {
    return titleNode;
  } else {
    titleNode = titleNode.props.children;
    return convert2string(titleNode);
  }
};

function setListItemsUrl(path = "/") {
  const listItem: any = docTreeData;
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
    let title: string;
    let titleNode: any = listData.titleNode;
    title = convert2string(titleNode);
    title = title.replace(/\s/gim, "-").toLowerCase();

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

    const parentUrlNow = `${listData.parentUrl}/${title}`;
    if (typeof listData.titleNode === "string") {
      listData.titleNode = <Link style={{ color: "inherit", textDecoration: "inherit" }} to={parentUrlNow}>{listData.titleNode}</Link>;
    }
    listData.onClick = () => {
      browserHistory.push(parentUrlNow);
    };
    listData.style = {
      textDecoration: "inherit"
    };
    listData.hoverStyle = {
      textDecoration: "underline"
    };
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

export interface DocsTreeViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface DocsTreeViewState {
  listItems?: any[];
}

export default class DocsTreeView extends React.Component<DocsTreeViewProps, DocsTreeViewState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: DocsTreeViewState = {
    listItems: docTreeData
  };
  searchTimeout: any = null;

  handleChangeValue = (value: string) => {
    const { listItems } = this.state;
    clearTimeout(this.searchTimeout);

    const checkItems = (items: any[], prevIndexArr: number[]) => {
      items.forEach((item, index) => {
        if (!item.prevIndexArr) item.prevIndexArr = [...prevIndexArr, index];
        const title = convert2string(item.titleNode);
        if (value && title.toLowerCase().includes(value.toLowerCase())) {
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
      this.setState({ listItems });
    }, 200);
  }

  getRootPath = () => {
    const paths = location.pathname.split("/");
    const versionPattern = /v\d{1,2}.\d{1,2}.\d{1,2}-?\w*\.?\d{0,2}/;
    let version: string;
    const rootPath = paths[1];
    if (versionPattern.test(rootPath)) {
      version = rootPath;
    }
    return version;
  }

  render() {
    const {
      path,
      style,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { listItems } = this.state;
    setListItemsUrl(path || this.getRootPath());

    return (
      <div
        style={theme.prefixStyle({
          width: 320,
          padding: "10px 0",
          background: theme.useFluentDesign ? theme.acrylicTexture40.background : theme.chromeLow,
          ...style
        })}
        {...attributes}
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
          background="none"
          itemHeight={32}
          itemPadding={20}
          iconPadding={2}
          listSource={listItems as any}
          style={{
            width: 320,
            maxHeight: "100%"
          }}
        />
      </div>
    );
  }
}
