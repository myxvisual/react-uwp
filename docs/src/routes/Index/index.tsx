import * as React from "react";
import { RouterProps } from "react-router";

import {
  ArticleCard,
  AutoSuggestBox,
  Button,
  CalendarDatePicker,
  CalendarView,
  CheckBox,
  CommandBar,
  HyperLink,
  IconButton,
  Link,
  ListView,
  PasswordBox,
  ProgressRing,
  Radius,
  Slider,
  SplitView,
  ThemeType,
  TreeView,
  Flyout,
  FlyoutWrapper
} from "../../../../";

import listItemsData from "../../categories";
export interface Item {
  titleNode?: string;
  expanded?: boolean;
  children?: Item[];
}
export interface DataProps {}
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

export default class ReactUWP extends React.Component<ReactUWPProps, ReactUWPState> {
  static defaultProps = { className: "" };

  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  state: ReactUWPState = {
    listItems: listItemsData,
    showFocus: true,
    child: 0,

    date: new Date()
  };

  refs: {
    flyout1: Flyout;
    flyout2: Flyout;
    flyout3: Flyout;
  };

  searchTimeout: any = null;

  render() {
    const { className, id, style } = this.props;
    const { listItems, showFocus } = this.state;
    const { theme } = this.context;
    const { date } = this.state;

    return (
      <div
        className={className}
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
                fontSize: 20
              }}
              placeholder="Search Docs..."
              onChangeValue={(value => {
                clearTimeout(this.searchTimeout);
                const checkItems = (items: any[], prevIndexArr: number[]) => {
                  items.forEach((item, index) => {
                    if (!item.prevIndexArr) item.prevIndexArr = [...prevIndexArr, index];
                    if (value && item.titleNode.toLowerCase().includes(value.toLowerCase())) {
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
              })}
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
        <div style={theme.prepareStyles({ width: "calc(100% - 320px)" })}>
          {/*<ScrollBar style={{ width: 200, height: 400 }} />*/}
          <CommandBar labelPosition="bottom" content="" />
          <CalendarDatePicker readOnly value={date.toISOString()} />
          <CalendarView onChangeDate={date => this.setState({ date })} />
          <ArticleCard />
          <CheckBox isChecked={null} />
          <Radius />
          <AutoSuggestBox />
          <Button>Button</Button>
          <ProgressRing />
          <IconButton>&#xE700;</IconButton>
          <Link />
          <HyperLink />
          <PasswordBox />
          <TreeView style={{ width: 400, height: 400 }} />
          <ListView />
          <SplitView />
          <div style={{ margin: 40 }}>
              <Slider />
          </div>
          <FlyoutWrapper>
            <Flyout
              horizontalPosition="right"
              verticalPosition="top"
              ref="flyout1"
              style={{ display: "none" }}
            >
              Flyout1
            </Flyout>
            <Flyout
              horizontalPosition="center"
              verticalPosition="top"
              ref="flyout2"
            >
              Flyout
            </Flyout>
            <Flyout
              horizontalPosition="left"
              verticalPosition="bottom"
              ref="flyout3"
              style={{ display: "none" }}
            >
              Flyout3
            </Flyout>
            <Button
              onClick={() => {
                this.refs.flyout1.toggleShowFlyout();
                this.refs.flyout2.toggleShowFlyout();
                this.refs.flyout3.toggleShowFlyout();
              }}
            >
              Toggle Flyout Show
            </Button>
          </FlyoutWrapper>
          <CommandBar style={{ width: "100%" }} />
        </div>
      </div>
    );
  }
};
