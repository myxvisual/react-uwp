import * as React from "react";
import * as PropTypes from "prop-types";

import Icon, { icons } from "react-uwp/Icon";
import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import Tooltip from "react-uwp/Tooltip";
import ThemeType from "react-uwp/styles/ThemeType";

const iconNames = Object.keys(icons);

let rootStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: 8,
  width: 80,
  height: 80,
  padding: "12px 4px 4px"
};
const iconStyle: React.CSSProperties = {
  fontSize: 24
};
const descStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 10,
  marginTop: 8,
  wordWrap: "break-word",
  textAlign: "center"
};
const inputStyle: React.CSSProperties = {
  display: "inherit",
  overflow: "hidden",
  border: "none",
  outline: "none",
  opacity: 0,
  width: 40,
  height: 0
};

export interface IconsState {
  currIconNames?: string[];
}

export default class Icons extends React.Component<void, IconsState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  state: IconsState = {
    currIconNames: iconNames
  };
  inputTimer: any = null;

  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    Object.assign(e.currentTarget.style, {
      background: this.context.theme.listLow
    } as CSSStyleDeclaration);
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    Object.assign(e.currentTarget.style, {
      background: "none"
    } as CSSStyleDeclaration);
  }

  handleCopy = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const currentFocus: any = document.activeElement;
    const inputElm: HTMLInputElement = e.currentTarget.children[0].children[0] as any;
    inputElm.focus();
    inputElm.setSelectionRange(0, inputElm.value.length);
    document.execCommand("copy");
    currentFocus.focus();
  }

  handleInput = (value: string) => {
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.setState({
        currIconNames: iconNames.filter(iconName => (
          iconName.toLowerCase().includes(value.toLowerCase())
        ))
      });
      window.scrollTo(0, 0);
    }, 500);
  }

  render() {
    const { context: { theme }, state: { currIconNames } } = this;
    rootStyle = theme.prepareStyles(rootStyle);
    return (
      <div style={{ width: "100%" }}>
        <div style={{ position: "relative", width: "100%", height: 100 }}>
          <div
            style={{
              position: "fixed",
              height: 100,
              width: "100%",
              zIndex: theme.zIndex.tooltip + 1,
              background: theme.chromeLow
            }}
          />
          <div
            style={{
              position: "fixed",
              padding: 10,
              fontSize: 14,
              zIndex: theme.zIndex.tooltip + 1,
              background: theme.chromeLow
            }}
          >
            <AutoSuggestBox
              placeholder="Search Icons"
              iconSize={40}
              background="none"
              style={{
                height: 40
              }}
              onChangeValue={this.handleInput}
            />
            <p style={{ lineHeight: 1.8 }}>
              Represents an icon that uses a glyph from the Segoe MDL2 Assets font as its content. Used mainly in AppBarButton and AppBarToggleButton. ({currIconNames.length} icon)
            </p>
          </div>
        </div>
        <div
          style={theme.prepareStyles({
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexWrap: "wrap"
          })}
        >
          {currIconNames.map((iconName, index) => (
            <Tooltip
              verticalPosition="bottom"
              horizontalPosition="center"
              onClick={this.handleCopy}
              contentNode={(
                <div>
                  <input
                    value={iconName}
                    style={inputStyle}
                  />
                  <p>Copy</p>
                </div>
              )}
              style={{
                cursor: "pointer"
              }}
              margin={-6}
              key={`${index}`}
            >
              <div
                style={rootStyle}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                key={`${index}`}
              >
                <Icon style={iconStyle}>{iconName}</Icon>
                <p style={descStyle}>{iconName}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }
}
