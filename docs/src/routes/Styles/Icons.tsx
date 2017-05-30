import * as React from "react";
import * as PropTypes from "prop-types";

import Icon, { icons } from "react-uwp/Icon";
import AutoSuggestBox from "react-uwp/AutoSuggestBox";
import Tooltip from "react-uwp/Tooltip";

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
  context: { theme: ReactUWP.ThemeType };

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
    }, 250);
  }

  render() {
    const { context: { theme }, state: { currIconNames } } = this;
    rootStyle = theme.prepareStyles(rootStyle);
    return (
      <div style={{ width: "100%", fontSize: 14 }}>
        <div style={{ position: "relative", width: "100%", height: 60 }}>
          <div
            style={{
              position: "fixed",
              height: 60,
              width: "100%",
              zIndex: theme.zIndex.tooltip + 1
            }}
          />
          <div
            style={{
              position: "fixed",
              padding: 10,
              zIndex: theme.zIndex.tooltip + 1
            }}
          >
            <AutoSuggestBox
              placeholder="Search Icons"
              background={theme.altHigh}
              style={{
                width: 320
              }}
              onChangeValue={this.handleInput}
            />
          </div>
        </div>
        <p style={{ lineHeight: 1.8, padding: 10 }}>
          Represents an icon that uses a glyph from the Segoe MDL2 Assets font as its content. ({currIconNames.length} icon)
        </p>
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
