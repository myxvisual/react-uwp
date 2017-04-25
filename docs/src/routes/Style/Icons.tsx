import * as React from "react";

import Icon, { icons } from "react-uwp/src/controls/Icon";
import AutoSuggestBox from "react-uwp/src/controls/AutoSuggestBox";
import ThemeType from "react-uwp/src/styles/ThemeType";

const iconNames = Object.keys(icons);

const rootStyle: React.CSSProperties = {
  margin: 8,
  width: 80,
  height: 80
};
const iconStyle: React.CSSProperties = {
  fontSize: 24
};
const descStyle: React.CSSProperties = {
  fontSize: 10,
  marginTop: 8,
  wordWrap: "break-word",
  textAlign: "center"
};

export default class Icons extends React.Component<void, void> {
  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const { context: { theme } } = this;
    return (
      <div>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 40
          }}
        >
          <div
              style={{
                position: "fixed",
                height: 40,
                width: "inherit"
              }}
          >
            <AutoSuggestBox
              placeholder="Search Icons"
              iconSize={40}
              style={{
                height: 40,
                width: "100%",
                margin: 4
              }}
            />
          </div>
        </div>
        <div
          style={theme.prepareStyles({
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap"
          })}
        >
          {iconNames.map((iconName, index) => (
            <div style={rootStyle} key={`${index}`}>
              <Icon style={iconStyle}>{iconName}</Icon>
              <p style={descStyle}>{iconName}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
